const { getModel } = require("../../helpers/gemini");
const { AI_PROMPTS } = require("../../config/ai-prompts");
const Quiz = require("../../models/Quiz");

async function generateQuiz(req, res) {
  try {
    const { courseTitle, courseDescription, objectives, lectureGroups, config } = req.body;

    if (!courseTitle || !lectureGroups?.length) {
      return res.status(400).json({
        success: false,
        message: "Course title and lecture groups are required",
      });
    }

    const { questionCount = 10, difficulty = { easy: 30, medium: 50, hard: 20 } } = config || {};

    const prompt = AI_PROMPTS.quiz(
      courseTitle,
      courseDescription,
      objectives,
      lectureGroups,
      { questionCount, easy: difficulty.easy, medium: difficulty.medium, hard: difficulty.hard }
    );

    const model = getModel({ maxOutputTokens: 8000, jsonMode: true });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const groups = JSON.parse(text);

    return res.json({ success: true, data: groups });
  } catch (error) {
    console.error("Quiz generation error:", error);
    if (error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        success: false,
        message: "AI is busy right now. Please try again in a moment.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz. Please try again.",
    });
  }
}

async function saveQuiz(req, res) {
  try {
    const { courseId, config, groups } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { courseId },
      { courseId, config, groups, generatedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.json({ success: true, data: quiz });
  } catch (error) {
    console.error("Quiz save error:", error);
    return res.status(500).json({ success: false, message: "Failed to save quiz" });
  }
}

async function getQuizByCourse(req, res) {
  try {
    const { courseId } = req.params;
    const quiz = await Quiz.findOne({ courseId });
    return res.json({ success: true, data: quiz || null });
  } catch (error) {
    console.error("Get quiz error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch quiz" });
  }
}

module.exports = { generateQuiz, saveQuiz, getQuizByCourse };
