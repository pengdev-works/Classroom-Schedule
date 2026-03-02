import express from "express";
import { getSchedules, createSchedule } from "../controllers/scheduleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSchedules);
router.post("/", protect, createSchedule);

export default router;