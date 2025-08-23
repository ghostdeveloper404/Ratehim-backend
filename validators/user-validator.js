// validators/userRatingValidator.js
const Joi = require("joi");
const mongoose = require("mongoose");

// custom validator for ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// validators/userValidator.js


exports.userSchema = {
  create: Joi.object({
    uid: Joi.string().required().messages({
      "any.required": "uid is required.",
      "string.base": "uid must be a string.",
    }),
    email: Joi.string().email().optional().messages({
      "string.email": "email must be a valid email address.",
    }),
    displayName: Joi.string().optional().messages({
      "string.base": "displayName must be a string.",
    }),
    profileImage: Joi.string().uri().optional().messages({
      "string.uri": "profileImage must be a valid URL.",
    }),
    karmaScore: Joi.number().integer().min(0).default(0).messages({
      "number.base": "karmaScore must be a number.",
      "number.min": "karmaScore cannot be negative.",
    }),
    createdAt: Joi.date().default(Date.now),
  }),

  update: Joi.object({
    email: Joi.string().email().optional(),
    displayName: Joi.string().optional(),
    profileImage: Joi.string().uri().optional(),
    karmaScore: Joi.number().integer().min(0).optional(),
  }),
};


exports.rateUserSchema = {
  params: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required().messages({
      "any.required": "User ID is required.",
      "any.invalid": "Invalid User ID."
    }),
  }),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "any.required": "rating is required.",
      "number.base": "rating must be a number.",
      "number.min": "rating must be between 1 and 5.",
      "number.max": "rating must be between 1 and 5."
    }),
    tag:Joi.string().optional().messages({
       "array.base": "tags must be an array of strings."
    }),
    comment: Joi.string().optional().messages({
      "string.base": "comment must be a string."
    })
  })
};


exports.updateRatingSchema = {
  params: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required().messages({
      "any.required": "User ID is required.",
      "any.invalid": "Invalid User ID."
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



