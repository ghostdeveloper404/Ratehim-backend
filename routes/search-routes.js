const express = require("express");
const router = express.Router();
const RateCard = require("../models/RateCard");
const searchController = require("../controllers/searchController");

// GET /api/search?q=keyword
router.get("/search", searchController.searchAnythingRated , async (req, res) => {
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
});


// GET /api/discover/trending-nearby?lat=12.97&lng=77.59
router.get("/discover/trending-nearby",  searchController.trendingRateCardsNearby, async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) return res.status(400).json({ message: "Latitude and longitude required." });

  try {
    const results = await RateCard.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 50000 // 50km
        }
      }
    }).sort({ karmaScore: -1 }).limit(50);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Nearby search failed", error: err.message });
  }
});

// GET /api/ratecards/by-tag?tag=food
router.get("/by-tag", searchController.searchByTag, async (req, res) => {
  const { tag } = req.query;
  if (!tag) return res.status(400).json({ message: "Tag is required." });

  try {
    const results = await RateCard.find({ tags: tag }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Tag search failed", error: err.message });
  }
});





module.exports = router;