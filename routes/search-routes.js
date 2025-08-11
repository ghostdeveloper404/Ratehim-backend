const express = require("express");
const router = express.Router();
const RateCard = require("../models/RateCard");
const searchController = require("../controllers/searchController");

// GET /api/search?q=keyword
router.get("/search", searchController.searchAnythingRated);


// GET /api/users/nearby-rated
router.get("/users/nearby-rated", searchController.getRatedUsersNearby);


// GET /api/discover/trending-nearby?lat=12.97&lng=77.59
router.get("/trending-nearby", searchController.trendingRateCardsNearby);

// GET /api/ratecards/by-tag?tag=food
router.get("/by-tag", searchController.searchByTag);

module.exports = router;