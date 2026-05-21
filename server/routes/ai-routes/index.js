const express = require("express");
const { askAITutor } = require("../../controllers/ai-controller/chat-controller");

const router = express.Router();

// Feature 2: Course AI Tutor
router.post("/chat", askAITutor);

module.exports = router;
