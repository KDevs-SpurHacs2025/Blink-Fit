import { Router } from "express";
import { getHello, postHello, healthCheck } from "../controllers/helloController";
import { generateGuide } from "../controllers/guideController";
import { generateExerciseGuide } from "../controllers/exerciseController";
import { login, getUserProfile } from "../controllers/authController";
import { updateBlinkCount } from "../controllers/blinkController";
import { updateSessionSummary } from "../controllers/summaryController";

const router = Router();

// Basic health check
router.get("/", healthCheck);

// Hello API endpoints
router.get("/hello", getHello);
router.post("/hello", postHello);

// Guide generation
router.post("/generate-guide", generateGuide);

// Exercise guidance
router.post("/exercise-guidance", generateExerciseGuide);

// Authentication & User endpoints
router.post("/login", login);
router.get("/user/:userId", getUserProfile);

// Blink count tracking
router.post("/blink-count", updateBlinkCount);

// Session summary
router.post("/summary", updateSessionSummary);

// 404 handler
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

export default router;
