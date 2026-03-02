import express from "express";
import { getClassrooms, createClassroom } from "../controllers/classroomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getClassrooms);
router.post("/", protect, createClassroom);

export default router;