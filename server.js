// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const rateCardRoutes = require("./routes/rateCard");
const userRoutes = require("./routes/user-routes");
const { route, next } = require('./middlewares/validate.middleware');
const searchRoutes = require("./routes/search-routes")
const errorHandler = require("./middlewares/router-error-handler")

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Sample Route (for testing)
app.get("/", (req, res) => {
  res.send("RateIt API is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working ✅" });
});



// RateCard Routes
app.use("/api/ratecard", rateCardRoutes);
// User Routes
app.use("/api/auth", userRoutes);

app.use("api" , searchRoutes)

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ❌ Fallback route for unknown endpoints
app.use(errorHandler.route);
// 🔥 Global error handler
app.use(errorHandler.next);





