const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const RateCard = require("../models/RateCard");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // multer config
const { bodyValidator, paramValidator } = require("../middlewares/route-error-handler");
const {
  addRatingSchema,
  editRatingSchema,
  deleteRatingSchema
} = require("../validators/ratingValidator");
const rateCardController = require("../controllers/rateCardController");

const { createRateCardSchema, getRateCardsSchema } = require("../validators/rateCardValidator")


// Create RateCard
router.post('/create', auth, upload.single('image'), bodyValidator(createRateCardSchema), rateCardController.createRateCard);

// Get All RateCards
router.get("/cards", // simple query validator middleware
    (req, res, next) => {
    // simple query validator middleware
    const { error } = getRateCardsSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.message, details: error.details });
    }
    next();
  }, rateCardController.getAllRateCards);

// Add rating to RateCard
router.post("/:objectId/rate", auth, rateCardController.addRating);

// Get all ratings by user
router.get("/my-ratings", auth, rateCardController.getMyRatings);

// Edit rating
router.put("/:id/edit-rating", auth, paramValidator(editRatingSchema.params),  bodyValidator(editRatingSchema.body), rateCardController.editRating);

// Delete rating
router.delete("/:id/delete-rating", auth, paramValidator(deleteRatingSchema), rateCardController.deleteRating);


// Add rating to RateCard
router.post("/:objectId/rate", auth,   paramValidator(addRatingSchema.params),  bodyValidator(addRatingSchema.body), rateCardController.addRating);

// Get all ratings by user
router.get("/my-ratings", auth, rateCardController.getMyRatings);






module.exports = router;
