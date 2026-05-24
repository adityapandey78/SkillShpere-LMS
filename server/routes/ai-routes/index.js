const express = require("express");
const { askAITutor } = require("../../controllers/ai-controller/chat-controller");
const { generateOutline, regenerateField } = require("../../controllers/ai-controller/outline-controller");
const { generateQuiz, saveQuiz, getQuizByCourse } = require("../../controllers/ai-controller/quiz-controller");
const { submitQuizAttempt, getQuizState } = require("../../controllers/ai-controller/quiz-attempt-controller");

const router = express.Router();

// Feature 2: Course AI Tutor
router.post("/chat", askAITutor);

// Feature 7: Course Outline Generator
router.post("/generate-outline", generateOutline);
router.post("/regenerate-field", regenerateField);

// Feature 3: AI Quiz Generator
router.post("/generate-quiz", generateQuiz);
router.post("/save-quiz", saveQuiz);
router.get("/quiz/:courseId", getQuizByCourse);

// Feature 3: Student quiz attempts + state
router.post("/quiz/attempt", submitQuizAttempt);
router.get("/quiz-state/:userId/:courseId", getQuizState);

module.exports = router;
