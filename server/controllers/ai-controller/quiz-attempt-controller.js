const QuizAttempt = require("../../models/QuizAttempt");
const Quiz = require("../../models/Quiz");

async function submitQuizAttempt(req, res) {
  try {
    const { userId, courseId, groupIndex, answers } = req.body;

    if (!userId || !courseId || groupIndex === undefined || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "No quiz found for this course" });
    }

    const group = quiz.groups[groupIndex];
    if (!group) {
      return res.status(400).json({ success: false, message: "Invalid quiz group index" });
    }

    const correctAnswers = group.questions.map((q) => q.correctAnswer);
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) score++;
    });

    const totalQuestions = group.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

    // Upsert: replace previous attempt for this group
    const attempt = await QuizAttempt.findOneAndUpdate(
      { userId, courseId, groupIndex },
      { userId, courseId, groupIndex, score, totalQuestions, percentage, passed, answers, attemptDate: new Date() },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      data: { score, totalQuestions, percentage, passed, correctAnswers, answers, groupIndex, attempt },
    });
  } catch (error) {
    console.error("Submit quiz attempt error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit quiz" });
  }
}

async function getQuizState(req, res) {
  try {
    const { userId, courseId } = req.params;

    const [quiz, attempts] = await Promise.all([
      Quiz.findOne({ courseId }),
      QuizAttempt.find({ userId, courseId }),
    ]);

    return res.json({
      success: true,
      data: { quiz: quiz || null, attempts: attempts || [] },
    });
  } catch (error) {
    console.error("Get quiz state error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch quiz state" });
  }
}

module.exports = { submitQuizAttempt, getQuizState };
