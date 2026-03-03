import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // ✅ Must have for req.body
app.use(express.urlencoded({ extended: true })); // optional, safe

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/student-classrooms", enrollmentRoutes);

app.get("/", (req, res) => res.json({ message: "Server running 🚀" }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));