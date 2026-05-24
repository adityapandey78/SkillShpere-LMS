const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  groupIndex: { type: Number, required: true },
  score: Number,
  totalQuestions: Number,
  percentage: Number,
  passed: Boolean,
  answers: [Number],
  attemptDate: { type: Date, default: Date.now },
});

QuizAttemptSchema.index({ userId: 1, courseId: 1, groupIndex: 1 });

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
