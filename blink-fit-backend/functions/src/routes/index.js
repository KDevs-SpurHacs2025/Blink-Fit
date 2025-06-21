"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helloController_1 = require("../controllers/helloController");
const guideController_1 = require("../controllers/guideController");
const exerciseController_1 = require("../controllers/exerciseController");
const router = (0, express_1.Router)();
// Basic health check
router.get("/", helloController_1.healthCheck);
// Hello API endpoints
router.get("/api/hello", helloController_1.getHello);
router.post("/api/hello", helloController_1.postHello);
// Guide generation
router.post("/api/generate-guide", guideController_1.generateGuide);
// Exercise guidance
router.post("/api/exercise-guidance", exerciseController_1.generateExerciseGuide);
// 404 handler
router.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});
exports.default = router;
