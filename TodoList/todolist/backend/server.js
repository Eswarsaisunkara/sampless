require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Models
const Note = require("./models/Note");
const Task = require("./models/Task");
const Pomodoro = require("./models/Pomodoro");
const Goal = require("./models/Goal");
const Plan = require("./models/Plan");
const Session = require("./models/Session");

// Routes
const authRoutes = require("./routes/auth");
const makeResourceRoutes = require("./routes/resource");
const pointsRoutes = require("./routes/points");
const notificationRoutes = require("./routes/notifications");
const quizRoutes = require("./routes/quiz");
const aiPlannerController = require("./controllers/aiPlannerController");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", makeResourceRoutes(Note));
app.use("/api/tasks", makeResourceRoutes(Task));
app.use("/api/pomodoros", makeResourceRoutes(Pomodoro));
app.use("/api/goals", makeResourceRoutes(Goal));
app.use("/api/plans", makeResourceRoutes(Plan));
app.use("/api/sessions", makeResourceRoutes(Session));
app.use("/api/points", pointsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/quiz", quizRoutes);

// AI Planner endpoint
app.post("/api/ai-planner", authMiddleware, aiPlannerController.generate);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Handle uncaught errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
