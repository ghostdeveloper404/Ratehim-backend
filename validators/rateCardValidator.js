// validators/rateCardValidator.js
const Joi = require("joi");

// Create RateCard (POST)
exports.createRateCardSchema = Joi.object({
  objectType: Joi.string().required().messages({
    "any.required": "objectType is required.",
    "string.empty": "objectType is required."
  }),
  title: Joi.string().required().messages({
    "any.required": "title is required.",
    "string.empty": "title is required."
  }),
  tags: Joi.string().optional().messages({
    "string.base": "Tags must be a string."
  }),
  description: Joi.string().required().messages({
    "any.required": "description is required.",
    "string.empty": "description is required."
  }),
  location: Joi.string().optional().messages({
    "string.base": "Location must be a string."
  })
});

// Get RateCards (GET with query params)
exports.getRateCardsSchema = Joi.object({
  objectType: Joi.string().optional().messages({
    "string.base": "objectType must be a string."
  }),
  tags: Joi.string().optional().messages({
    "string.base": "Tags must be a string."
  }),
  location: Joi.string().optional().messages({
    "string.base": "Location must be a string."
  })
});
