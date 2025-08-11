const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const RateCard = require("../models/RateCard");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // multer config
const rateCardController = require("../controllers/rateCardController");

// Create RateCard
router.post('/create', auth, upload.single('image'), rateCardController.createRateCard);

// Get All RateCards
router.get("/cards", rateCardController.getAllRateCards);

// Add rating to RateCard
router.post("/:objectId/rate", auth, rateCardController.addRating);

// Get all ratings by user
router.get("/my-ratings", auth, rateCardController.getMyRatings);

// Edit rating
router.put("/:id/edit-rating", auth, rateCardController.editRating);

// Delete rating
router.delete("/:id/delete-rating", auth, rateCardController.deleteRating);


// Add rating to RateCard
router.post("/:objectId/rate", auth, rateCardController.addRating);

// Get all ratings by user
router.get("/my-ratings", auth, rateCardController.getMyRatings);






module.exports = router;
