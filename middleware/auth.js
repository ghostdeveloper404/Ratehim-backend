// middlewares/auth.js
const admin = require("../firebase");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  console.log(token ? "Token received" : "No token provided");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    if (err.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Token invalid" });
  }
};

module.exports = authMiddleware;
