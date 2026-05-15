const express = require("express");
const {
  getCoursesByStudentId,
  unenrollCourse,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.post("/unenroll", unenrollCourse);

module.exports = router;
