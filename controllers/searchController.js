// controllers/searchController.js

const RateCard = require("../models/RateCard");
const User = require("../models/User");

exports.searchAnythingRated = async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ message: "Search query is required." });

  try {
    const results = await RateCard.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { objectType: { $regex: q, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

exports.trendingRateCardsNearby = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) return res.status(400).json({ message: "Latitude and longitude required." });

  try {
    const results = await RateCard.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 50000
        }
      }
    }).sort({ karmaScore: -1 }).limit(50);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Nearby search failed", error: err.message });
  }
};

exports.searchByTag = async (req, res) => {
  const { tag } = req.query;
  if (!tag) return res.status(400).json({ message: "Tag is required." });

  try {
    const results = await RateCard.find({ tags: tag }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Tag search failed", error: err.message });
  }
};

exports.getRatedUsersNearby = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) return res.status(400).json({ message: "Latitude and longitude required." });

  try {
    const users = await User.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 50000
        }
      },
      "profileRatings.0": { $exists: true }
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "User discovery failed", error: err.message });
  }
};
