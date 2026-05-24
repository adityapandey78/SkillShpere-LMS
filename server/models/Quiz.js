const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: { type: Number, min: 0, max: 3 },
  explanation: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
});

const QuizGroupSchema = new mongoose.Schema({
  lectureIndices: [Number],
  lectureNames: [String],
  questions: [QuestionSchema],
});

const QuizSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  config: {
    mode: { type: String, enum: ["interval", "end"], default: "end" },
    lectureInterval: { type: Number, default: 2 },
    questionCount: { type: Number, default: 10 },
    difficulty: {
      easy: { type: Number, default: 30 },
      medium: { type: Number, default: 50 },
      hard: { type: Number, default: 20 },
    },
  },
  groups: [QuizGroupSchema],
  generatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", QuizSchema);
