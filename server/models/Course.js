const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: String,
  videoType: { type: String, enum: ["upload", "youtube"], default: "upload" },
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
  duration: { type: Number, default: 0 },
});

const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image: String,
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  syllabus: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [LectureSchema],
  isPublised: Boolean,
});

module.exports = mongoose.model("Course", CourseSchema);
