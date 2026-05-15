import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  fetchStudentBoughtCoursesService,
  unenrollCourseService,
  resetCourseProgressService,
} from "@/services";
import {
  Watch,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  GraduationCap,
  MoreVertical,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import images from "@/assets/images";

// Renders the tooltip via createPortal so it escapes DropdownMenuContent's overflow-hidden
function DisabledMenuOption({ icon: Icon, label, tooltip }) {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);

  function handleMouseEnter() {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.bottom + 10, left: r.left + r.width / 2 });
    }
  }

  return (
    <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={() => setPos(null)}>
      <div className="flex items-center px-2 py-1.5 text-sm rounded-sm opacity-40 cursor-not-allowed select-none">
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </div>
      {pos &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{ top: pos.top, left: pos.left, transform: "translateX(-50%)" }}
          >
            <div
              className="mx-auto"
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: "5px solid #111827",
                marginBottom: -1,
              }}
            />
            <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-2xl max-w-[180px] text-center leading-snug whitespace-normal">
              {tooltip}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(null);
  const [unenrollDialog, setUnenrollDialog] = useState(null); // { courseId, courseTitle }

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  useEffect(() => {
    if (auth?.user?._id) fetchStudentBoughtCourses();
  }, [auth?.user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleUnenroll(courseId, courseTitle) {
    setUnenrollDialog({ courseId, courseTitle });
  }

  async function handleConfirmUnenroll() {
    const { courseId } = unenrollDialog;
    setUnenrollDialog(null);
    setActionLoading(courseId + "_unenroll");
    try {
      const response = await unenrollCourseService(auth?.user?._id, courseId);
      if (!response?.success) {
        window.alert("Failed to unenroll. Please try again.");
      }
    } catch {
      window.alert("An error occurred. Please try again.");
    } finally {
      setActionLoading(null);
      await fetchStudentBoughtCourses();
    }
  }

  async function handleRewatch(courseId) {
    if (
      !window.confirm(
        "This will reset all your progress for this course and start from the very beginning. Are you sure?"
      )
    )
      return;

    setActionLoading(courseId + "_rewatch");
    try {
      const response = await resetCourseProgressService(auth?.user?._id, courseId);
      if (response?.success) {
        await fetchStudentBoughtCourses();
        navigate(`/student/course-progress/${courseId}`);
      }
    } catch {
      window.alert("An error occurred. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  const completedCount =
    studentBoughtCoursesList?.filter((c) => c.isCompleted)?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
              <p className="text-gray-600">
                Continue your learning journey and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {studentBoughtCoursesList?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          <>
            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-blue-50 hover:border-blue-200"
                  onClick={() => navigate("/student/courses")}
                >
                  <BookOpen className="h-5 w-5 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Browse Courses</div>
                    <div className="text-sm text-gray-600">Find new courses to learn</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-green-50 hover:border-green-200"
                  onClick={() => navigate("/student")}
                >
                  <TrendingUp className="h-5 w-5 mr-3 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">View Dashboard</div>
                    <div className="text-sm text-gray-600">See your learning stats</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => navigate("/student/certificates")}
                >
                  <Award className="h-5 w-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Certificates</div>
                    <div className="text-sm text-gray-600">View your achievements</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {studentBoughtCoursesList.map((course) => (
                  <Card
                    key={course.courseId}
                    className="group hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-md"
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={course?.courseImage || images.studentView.coursePlaceholder}
                          alt={course?.title}
                          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Status badge */}
                        <div className="absolute top-3 left-3">
                          {course?.isCompleted ? (
                            <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="bg-white bg-opacity-90 backdrop-blur-sm text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
                              Enrolled
                            </span>
                          )}
                        </div>

                        {/* Ellipsis menu */}
                        <div
                          className="absolute top-3 right-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="bg-white bg-opacity-90 hover:bg-opacity-100 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow transition-all">
                                <MoreVertical className="h-4 w-4 text-gray-700" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              {/* Generate Certificate */}
                              {course?.isCompleted ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/student/certificate/${course.courseId}`)
                                  }
                                  className="cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                >
                                  <Award className="mr-2 h-4 w-4" />
                                  Generate Certificate
                                </DropdownMenuItem>
                              ) : (
                                <DisabledMenuOption
                                  icon={Award}
                                  label="Generate Certificate"
                                  tooltip="Complete the course first"
                                />
                              )}

                              {/* Rewatch Course */}
                              {course?.isCompleted ? (
                                <DropdownMenuItem
                                  onClick={() => handleRewatch(course.courseId)}
                                  disabled={
                                    actionLoading === course.courseId + "_rewatch"
                                  }
                                  className="cursor-pointer"
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Rewatch Course
                                </DropdownMenuItem>
                              ) : (
                                <DisabledMenuOption
                                  icon={RefreshCw}
                                  label="Rewatch Course"
                                  tooltip="Available after completing. Resets all progress."
                                />
                              )}

                              <DropdownMenuSeparator />

                              {/* Unenroll */}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUnenroll(course.courseId, course.title)
                                }
                                disabled={
                                  actionLoading === course.courseId + "_unenroll"
                                }
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                {actionLoading === course.courseId + "_unenroll"
                                  ? "Unenrolling…"
                                  : "Unenroll"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {course?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {course?.instructorName}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span
                              className={
                                course?.isCompleted ? "text-green-600 font-semibold" : ""
                              }
                            >
                              {course?.progress ?? 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                course?.isCompleted ? "bg-green-500" : "bg-blue-600"
                              }`}
                              style={{ width: `${course?.progress ?? 0}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Lectures & time */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course?.timeRemaining || "Not started"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {course?.completedLectures ?? 0}/
                              {course?.totalLectures ?? 0} lessons
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      {course?.isCompleted ? (
                        <Button
                          onClick={() =>
                            navigate(`/student/certificate/${course?.courseId}`)
                          }
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg"
                        >
                          <Award className="mr-2 h-4 w-4" />
                          Generate Certificate
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            navigate(`/student/course-progress/${course?.courseId}`)
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                        >
                          <Watch className="mr-2 h-4 w-4" />
                          Continue Learning
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courses Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start your learning journey by enrolling in your first course.
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold rounded-lg"
                onClick={() => navigate("/student/courses")}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse All Courses
              </Button>
              <div className="mt-4">
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => navigate("/student")}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unenroll Confirmation Dialog */}
      <Dialog
        open={!!unenrollDialog}
        onOpenChange={(open) => { if (!open) setUnenrollDialog(null); }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-gray-900">
              <div className="flex items-center justify-center w-9 h-9 bg-red-100 rounded-full flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              Unenroll from Course?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-gray-600 mt-1 space-y-3">
                <p>
                  You're about to unenroll from{" "}
                  <span className="font-semibold text-gray-900">
                    "{unenrollDialog?.courseTitle}"
                  </span>.
                </p>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-red-700 text-xs font-medium">
                  Your progress will be permanently deleted and cannot be recovered.
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setUnenrollDialog(null)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUnenroll}
              disabled={actionLoading !== null}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? "Unenrolling…" : "Yes, Unenroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentCoursesPage;
