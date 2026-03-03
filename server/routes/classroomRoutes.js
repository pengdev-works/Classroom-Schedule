import express from "express";
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from "../controllers/classroomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getClassrooms);
router.post("/", createClassroom);
router.put("/:id", updateClassroom);
router.delete("/:id", deleteClassroom);

export default router;