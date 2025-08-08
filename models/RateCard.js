const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  userId: String,
  displayName: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const RateCardSchema = new mongoose.Schema({
  objectId: { type: String, unique: true, required: true },
  objectType: {
    type: String,
    enum: ["person", "place", "product", "idea", "moment", "experience", "event", "service", "object", "other"],
    required: true,
  },
  title: { type: String, required: true, minlength: 3 },
  description: String,
  tags: { type: [String], default: [] },
  location: String,
  imageUrl: String,
  karmaScore: { type: Number, default: 0 },
  ratings: [RatingSchema],
  createdBy: {
    uid: String,
    displayName: String,
    email: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RateCard", RateCardSchema);
