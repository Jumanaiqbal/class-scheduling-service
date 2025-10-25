import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import classTypeRoutes from "./routes/classTypeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

connectDB();

// CORS: Explicit origin & credentials to avoid wildcard + credentials mismatch
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api/stats", statsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.json({
    status: "OK",
    message: "Class Scheduling API is running!",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});
// Add with other route imports
app.use("/api/students", studentRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/class-types", classTypeRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/config", configRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(
    `📊 Registration API: http://localhost:${PORT}/api/registrations`
  );
});
