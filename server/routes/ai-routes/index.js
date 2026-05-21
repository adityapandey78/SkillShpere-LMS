const express = require("express");
const { askAITutor } = require("../../controllers/ai-controller/chat-controller");
const { generateOutline, regenerateField } = require("../../controllers/ai-controller/outline-controller");

const router = express.Router();

// Feature 2: Course AI Tutor
router.post("/chat", askAITutor);

// Feature 7: Course Outline Generator
router.post("/generate-outline", generateOutline);
router.post("/regenerate-field", regenerateField);

module.exports = router;
