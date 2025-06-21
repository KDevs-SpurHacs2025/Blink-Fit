import { Router } from "express";
import { getHello, postHello, healthCheck } from "../controllers/helloController";
import { generateGuide } from "../controllers/guideController";
import { generateExerciseGuide } from "../controllers/exerciseController";

const router = Router();

// Basic health check
router.get("/", healthCheck);

// Hello API endpoints
router.get("/api/hello", getHello);
router.post("/api/hello", postHello);

// Guide generation
router.post("/api/generate-guide", generateGuide);

// Exercise guidance
router.post("/api/exercise-guidance", generateExerciseGuide);

// 404 handler
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

export default router;
