const { body, param, query } = require("express-validator");

exports.createRateCardValidator = [
  body("objectType").notEmpty().withMessage("objectType is required."),
  body("title").notEmpty().withMessage("title is required."),
  body("tags").optional().isString().withMessage("Tags must be a string."),
  body("location").optional().isString(),
];


exports.addRatingValidator = [
  param("objectId").notEmpty().withMessage("objectId is required."),
  body("rating").notEmpty().isNumeric().withMessage("Rating must be a number."),
];  

