import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register); // ✅ POST
router.post("/login", login);       // ✅ POST

export default router;