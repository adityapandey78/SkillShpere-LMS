const mongoose = require("mongoose");
const StudentCourses = require("../../models/StudentCourses");
const Progress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const { getVideoDuration } = require("../../helpers/cloudinary");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({ userId: studentId });

    if (!studentBoughtCourses) {
      return res.status(200).json({ success: true, data: [] });
    }

    const enrichedCourses = await Promise.all(
      studentBoughtCourses.courses.map(async (course) => {
        const courseId = (course.courseId || "").trim();
        const baseCourse = {
          courseId: course.courseId,
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: course.dateOfPurchase,
          courseImage: course.courseImage,
        };

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
          console.warn(`[courses] Invalid courseId: "${courseId}" — skipping enrichment`);
          return { ...baseCourse, progress: 0, completedLectures: 0, totalLectures: 0, isCompleted: false, completionDate: null, timeRemaining: "N/A" };
        }

        try {
          const [courseProgress, courseDetails] = await Promise.all([
            Progress.findOne({ userId: studentId, courseId }),
            Course.findById(courseId).select("curriculum").lean(),
          ]);

          let curriculum = courseDetails?.curriculum || [];

          // Backfill durations from Cloudinary for legacy lectures that were uploaded
          // before the duration field was added to the schema.
          const needsBackfill = curriculum.some((l) => !l.duration && l.public_id);
          if (needsBackfill) {
            curriculum = await Promise.all(
              curriculum.map(async (lec) => {
                if (!lec.duration && lec.public_id) {
                  const dur = await getVideoDuration(lec.public_id);
                  return { ...lec, duration: dur };
                }
                return lec;
              })
            );
            Course.findByIdAndUpdate(courseId, { curriculum }).catch(() => {});
          }

          const totalLectures = curriculum.length;
          const viewedIds = new Set(
            courseProgress?.lecturesProgress?.filter((lp) => lp.viewed).map((lp) => lp.lectureId) || []
          );
          const completedLectures = viewedIds.size;
          const progressPercentage =
            totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

          const totalSeconds = curriculum.reduce((s, l) => s + (l.duration || 0), 0);
          const remainingSeconds = totalSeconds > 0
            ? curriculum.filter((l) => !viewedIds.has(String(l._id))).reduce((s, l) => s + (l.duration || 0), 0)
            : (totalLectures - completedLectures) * 15 * 60;

          return {
            ...baseCourse,
            progress: progressPercentage,
            completedLectures,
            totalLectures,
            isCompleted: !!courseProgress?.completed,
            completionDate: courseProgress?.completionDate || null,
            timeRemaining: calculateTimeRemaining(remainingSeconds, totalLectures),
          };
        } catch (err) {
          console.error(`[courses] Error for courseId=${courseId}:`, err.message);
          return { ...baseCourse, progress: 0, completedLectures: 0, totalLectures: 0, isCompleted: false, completionDate: null, timeRemaining: "N/A" };
        }
      })
    );

    res.status(200).json({ success: true, data: enrichedCourses });
  } catch (error) {
    console.error("[courses] Top-level error:", error);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

// Uses splice so Mongoose reliably detects the array mutation
const unenrollCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const studentCoursesDoc = await StudentCourses.findOne({ userId: studentId });
    if (!studentCoursesDoc) {
      return res.status(404).json({ success: false, message: "Student courses not found" });
    }

    const idx = studentCoursesDoc.courses.findIndex((c) => c.courseId === courseId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Course not found in enrolled list" });
    }

    studentCoursesDoc.courses.splice(idx, 1);
    await studentCoursesDoc.save();

    // Best-effort cleanup — don't fail if these throw
    try {
      if (mongoose.Types.ObjectId.isValid(courseId)) {
        await Course.findByIdAndUpdate(courseId, { $pull: { students: { studentId } } });
      }
    } catch (e) {
      console.warn("[unenroll] Could not update Course.students:", e.message);
    }
    try {
      await Progress.findOneAndDelete({ userId: studentId, courseId });
    } catch (e) {
      console.warn("[unenroll] Could not delete progress:", e.message);
    }

    res.status(200).json({ success: true, message: "Successfully unenrolled" });
  } catch (error) {
    console.error("[unenroll] Error:", error);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const calculateTimeRemaining = (remainingSeconds, totalLectures) => {
  if (totalLectures === 0) return "Not started";
  if (remainingSeconds <= 0) return "Completed";
  const mins = Math.round(remainingSeconds / 60);
  if (mins < 60) return `${mins}m left`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m left` : `${h}h left`;
};

module.exports = { getCoursesByStudentId, unenrollCourse };
