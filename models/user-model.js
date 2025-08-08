
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String },
  displayName: { type: String },
  profileImage: { type: String },
  karmaScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },

  ratingsReceived: [
  {
    raterId: String,
    raterName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }
 ],
ratingsGiven: [
  {
    userId: String, // the one they rated
    userName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }
]

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);


