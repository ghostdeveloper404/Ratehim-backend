// validators/ratingValidator.js
const Joi = require("joi");
const mongoose = require("mongoose");

// 🔹 custom validator to check MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Add rating to RateCard
exports.addRatingSchema = {
  params: Joi.object({
    cardId: Joi.string().custom(objectIdValidator).required().messages({
      "any.required": "RateCard ID is required.",
      "any.invalid": "Invalid RateCard ID."
    }),
  }),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "any.required": "rating is required.",
      "number.base": "rating must be a number.",
      "number.min": "rating must be between 1 and 5.",
      "number.max": "rating must be between 1 and 5."
    }),
    comment: Joi.string().optional().messages({
      "string.base": "comment must be a string."
    })
  })
};

// Edit rating
exports.editRatingSchema = {
  params: Joi.object({
    ratingId: Joi.string().custom(objectIdValidator).required().messages({
      "any.required": "Rating ID is required.",
      "any.invalid": "Invalid Rating ID."
    }),
  }),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).optional().messages({
      "number.base": "rating must be a number.",
      "number.min": "rating must be between 1 and 5.",
      "number.max": "rating must be between 1 and 5."
    }),
    comment: Joi.string().optional().messages({
      "string.base": "comment must be a string."
    })
  })
};

// Delete rating
exports.deleteRatingSchema = Joi.object({
  ratingId: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "Rating ID is required.",
    "any.invalid": "Invalid Rating ID."
  }),
});
