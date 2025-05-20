
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middlewares/authMiddleware");
const blogRoutes = require("./routes/blogRoutes");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Database Connection Error:", err));

app.use("/api/auth", authRoutes);
app.get("/api/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your profile", userId: req.user.userId });
});

app.use("/api/blogs", blogRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
