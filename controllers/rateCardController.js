const { v4: uuidv4 } = require("uuid");
const RateCard = require("../models/RateCard");

// @desc    Create a new RateCard
exports.createRateCard = async (req, res) => {
  try {
    const { objectType, title, description, tags, location } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!objectType || !title) {
      return res.status(400).json({ message: "objectType and title are required." });
    }

    const newCard = new RateCard({
      objectId: uuidv4(),
      objectType,
      title,
      description,
      location,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      imageUrl,
      createdBy: {
        uid: req.user.uid,
        displayName: req.user.name || "",
        email: req.user.email || "",
      },
      ratings: [],
      karmaScore: 0,
    });

    const saved = await newCard.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create rate card.", error: error.message });
  }
};

// @desc    Get all RateCards
exports.getAllRateCards = async (req, res) => {
  try {
    const cards = await RateCard.find().sort({ createdAt: -1 }).limit(50);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rate cards." });
  }
};

// @desc    Add a rating to a RateCard
exports.addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { objectId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const card = await RateCard.findOne({ objectId });
    if (!card) return res.status(404).json({ message: "RateCard not found." });

    const alreadyRated = card.ratings.find(r => r.userId === req.user.uid);
    if (alreadyRated) {
      return res.status(400).json({ message: "You already rated this card." });
    }

    card.ratings.push({
      userId: req.user.uid,
      displayName: req.user.name || "",
      rating: Number(rating),
      comment,
    });

    const total = card.ratings.reduce((sum, r) => sum + r.rating, 0);
    card.karmaScore = total / card.ratings.length;

    const updated = await card.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to rate card.", error: err.message });
  }
};

// @desc    Get all ratings given by current user
exports.getMyRatings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cards = await RateCard.find({ "ratings.userId": userId });

    const userRatings = cards.map(card => {
      const userRating = card.ratings.find(r => r.userId === userId);
      return {
        cardId: card._id,
        cardTitle: card.title,
        rating: userRating.rating,
        comment: userRating.comment,
        karmaScore: card.karmaScore,
        createdAt: userRating.createdAt
      };
    });

    res.json(userRatings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user ratings" });
  }
};

// @desc    Edit a rating on a RateCard
exports.editRating = async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  try {
    const card = await RateCard.findById(id);
    if (!card) return res.status(404).json({ error: "Rate card not found" });

    const userRating = card.ratings.find(r => r.userId === req.user.uid);
    if (!userRating) return res.status(403).json({ error: "You haven't rated this card" });

    userRating.rating = rating || userRating.rating;
    userRating.comment = comment || userRating.comment;
    userRating.updatedAt = new Date();

    const total = card.ratings.reduce((sum, r) => sum + r.rating, 0);
    card.karmaScore = total / card.ratings.length;

    await card.save();
    res.json({ message: "Rating updated", card });
  } catch (err) {
    res.status(500).json({ error: "Failed to update rating" });
  }
};

// @desc    Delete a rating from a RateCard
exports.deleteRating = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await RateCard.findById(id);
    if (!card) return res.status(404).json({ error: "Rate card not found" });

    const initialLength = card.ratings.length;
    card.ratings = card.ratings.filter(r => r.userId !== req.user.uid);

    if (card.ratings.length === initialLength) {
      return res.status(403).json({ error: "You haven't rated this card" });
    }

    const total = card.ratings.reduce((sum, r) => sum + r.rating, 0);
    card.karmaScore = card.ratings.length > 0 ? total / card.ratings.length : 0;

    await card.save();
    res.json({ message: "Rating deleted", card });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete rating" });
  }
};

exports.getRateCardById = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await RateCard.findById(id);
    if (!card) return res.status(404).json({ message: "RateCard not found." });

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rate card.", error: error.message });
  }
};


