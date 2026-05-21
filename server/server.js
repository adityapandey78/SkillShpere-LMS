require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const aiRoutes = require("./routes/ai-routes/index");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("CLIENT_URL:", process.env.CLIENT_URL);

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL, 
      "http://localhost:5173", 
      "https://skill-shpere-lms.vercel.app",
      /\.vercel\.app$/
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Cache the connection across Vercel serverless invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Fail fast — was 30s, causing 30s hangs
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      // Keep TCP connection alive so Atlas doesn't close idle connections
      heartbeatFrequencyMS: 10000,
    });
    isConnected = true;
    console.log("mongodb is connected");
  } catch (e) {
    console.log("MongoDB connection error:", e);
    throw e;
  }
}

// Connect on startup; reconnect middleware ensures every request has a live connection
connectDB();

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
    } catch {
      return res.status(503).json({ success: false, message: "Database unavailable" });
    }
  }
  next();
});

//routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/ai", aiRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
