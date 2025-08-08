const express = require('express');
const router = express.Router();
const admin = require('../firebase');
const User = require('../models/user-model');
const auth = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token ? 'Token received' : 'No token provided');
  if (!token) return res.status(401).json({ message: 'Missing token' });
 
  try {
    // ✅ Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decoded;

    // ✅ Check if user exists in MongoDB, if not create
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({
        uid,
        email,
        displayName: name || '',
        profileImage: picture || '',
      });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Firebase token', error: err.message });
  }
});

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid Firebase token', error: err.message });
  }
});


router.post('/:userId/rate', auth, async (req, res) => {
  const { rating, comment } = req.body;
  const raterId = req.user.uid;
  const userId = req.params.userId;

  if (raterId === userId) return res.status(400).json({ message: 'Cannot rate yourself.' });

  try {
    const rater = await User.findOne({ uid: raterId });
    const targetUser = await User.findOne({ uid: userId });

    if (!targetUser) return res.status(404).json({ message: 'User not found.' });

    // Add to target's received ratings
    targetUser.ratingsReceived.push({
      raterId,
      raterName: rater.name || '',
      rating,
      comment,
    });

    // Recalculate karmaScore
    const total = targetUser.ratingsReceived.reduce((sum, r) => sum + r.rating, 0);
    targetUser.karmaScore = total / targetUser.ratingsReceived.length;

    // Add to rater's given ratings
    rater.ratingsGiven.push({
      userId,
      userName: targetUser.name || '',
      rating,
      comment,
    });

    await targetUser.save();
    await rater.save();

    res.json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to rate user', details: err.message });
  }
});


router.get('/:userId/karma', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.userId });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({
      karmaScore: user.karmaScore,
      ratingsReceived: user.ratingsReceived,
      ratingsGiven: user.ratingsGiven,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch karma profile', details: err.message });
  }
});


router.put('/:userId/rating', auth, async (req, res) => {
  const raterId = req.user.uid;
  const targetUserId = req.params.userId;
  const { rating, comment } = req.body;

  try {
    const rater = await User.findOne({ uid: raterId });
    const targetUser = await User.findOne({ uid: targetUserId });

    if (!rater || !targetUser) return res.status(404).json({ message: 'User not found.' });

    // Update in rater's ratingsGiven
    const givenRating = rater.ratingsGiven.find(r => r.userId === targetUserId);
    if (!givenRating) return res.status(404).json({ message: 'Rating not found in ratingsGiven' });

    givenRating.rating = rating;
    givenRating.comment = comment;

    // Update in targetUser's ratingsReceived
    const receivedRating = targetUser.ratingsReceived.find(r => r.raterId === raterId);
    if (!receivedRating) return res.status(404).json({ message: 'Rating not found in ratingsReceived' });

    receivedRating.rating = rating;
    receivedRating.comment = comment;

    // Recalculate karmaScore
    const total = targetUser.ratingsReceived.reduce((sum, r) => sum + r.rating, 0);
    targetUser.karmaScore = total / targetUser.ratingsReceived.length;

    await rater.save();
    await targetUser.save();

    res.json({ message: 'Rating updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rating', details: err.message });
  }
});


router.delete('/:userId/rating', auth, async (req, res) => {
  const raterId = req.user.uid;
  const targetUserId = req.params.userId;

  try {
    const rater = await User.findOne({ uid: raterId });
    const targetUser = await User.findOne({ uid: targetUserId });

    if (!rater || !targetUser) return res.status(404).json({ message: 'User not found.' });

    // Remove from rater's ratingsGiven
    rater.ratingsGiven = rater.ratingsGiven.filter(r => r.userId !== targetUserId);

    // Remove from targetUser's ratingsReceived
    targetUser.ratingsReceived = targetUser.ratingsReceived.filter(r => r.raterId !== raterId);

    // Recalculate karmaScore
    const total = targetUser.ratingsReceived.reduce((sum, r) => sum + r.rating, 0);
    targetUser.karmaScore = targetUser.ratingsReceived.length > 0
      ? total / targetUser.ratingsReceived.length
      : 0;

    await rater.save();
    await targetUser.save();

    res.json({ message: 'Rating deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete rating', details: err.message });
  }
});



module.exports = router;


