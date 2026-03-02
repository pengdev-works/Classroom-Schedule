import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/schedules", scheduleRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});