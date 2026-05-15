import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  GraduationCap,
  Printer,
  Shield,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CertificatesPage() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);

  useEffect(() => {
    async function fetchCourses() {
      if (!auth?.user?._id) return;
      const response = await fetchStudentBoughtCoursesService(auth.user._id);
      if (response?.success) {
        const completed = response.data.filter((c) => c.isCompleted);
        setCompletedCourses(completed);
        if (completed.length > 0) setSelectedCourse(completed[0]);
      }
      setLoading(false);
    }
    fetchCourses();
  }, [auth?.user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const studentName = auth?.user?.userName || "Learner";

  function getCertId(course) {
    const userId = auth?.user?._id || "000000";
    const year = course?.completionDate
      ? new Date(course.completionDate).getFullYear()
      : new Date().getFullYear();
    return `SS-${userId.slice(-6).toUpperCase()}-${(course?.courseId || "000000").slice(-4).toUpperCase()}-${year}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (completedCourses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Award className="h-14 w-14 text-gray-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Certificates Yet</h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-2">
            Your certificates will appear here once you complete a course.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-10">
            Pick up where you left off — finish a course to earn your first certificate!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => navigate("/student/student-courses")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Continue Learning
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/student")}
              className="px-8"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const completionDate = selectedCourse?.completionDate
    ? new Date(selectedCourse.completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const certId = getCertId(selectedCourse);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 print:hidden">
        <div className="p-5 border-b border-gray-100">
          <button
            onClick={() => navigate("/student/student-courses")}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            My Courses
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">My Certificates</h2>
              <p className="text-xs text-gray-400">
                {completedCourses.length} earned
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {completedCourses.map((course) => {
            const isSelected = course.courseId === selectedCourse?.courseId;
            return (
              <button
                key={course.courseId}
                onClick={() => setSelectedCourse(course)}
                className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-start gap-3 ${
                  isSelected
                    ? "bg-blue-600 shadow-md"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-white/20" : "bg-green-100"
                  }`}
                >
                  <Award
                    className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-green-600"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold leading-snug line-clamp-2 ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {course.title}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 truncate ${
                      isSelected ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {course.instructorName}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-100 to-blue-50">
        {/* Sticky action bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-3 flex justify-between items-center print:hidden">
          <div>
            <p className="text-sm font-semibold text-gray-800 line-clamp-1">
              {selectedCourse?.title}
            </p>
            <p className="text-xs text-gray-400">Certificate of Completion</p>
          </div>
          <Button
            onClick={() => window.print()}
            className="bg-blue-700 hover:bg-blue-800 text-white shadow"
            size="sm"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>

        <div className="py-10 px-6">
          {/* Certificate Card */}
          <div
            ref={certificateRef}
            id="certificate-card"
            className="max-w-5xl mx-auto bg-white shadow-2xl print:shadow-none relative overflow-hidden"
            style={{ minHeight: "680px" }}
          >
            {/* Outer decorative double border */}
            <div className="absolute inset-3 border-[3px] border-double border-amber-500 pointer-events-none z-10 rounded-sm" />
            <div className="absolute inset-5 border border-blue-900/30 pointer-events-none z-10 rounded-sm" />

            {/* Background watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #1e3a8a 0, #1e3a8a 1px, transparent 0, transparent 50%)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            {/* Corner ornaments */}
            <div className="absolute top-8 left-8 w-16 h-16 pointer-events-none z-10">
              <div className="w-full h-full border-l-4 border-t-4 border-amber-500 rounded-tl-lg opacity-60" />
            </div>
            <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none z-10">
              <div className="w-full h-full border-r-4 border-t-4 border-amber-500 rounded-tr-lg opacity-60" />
            </div>
            <div className="absolute bottom-8 left-8 w-16 h-16 pointer-events-none z-10">
              <div className="w-full h-full border-l-4 border-b-4 border-amber-500 rounded-bl-lg opacity-60" />
            </div>
            <div className="absolute bottom-8 right-8 w-16 h-16 pointer-events-none z-10">
              <div className="w-full h-full border-r-4 border-b-4 border-amber-500 rounded-br-lg opacity-60" />
            </div>

            {/* Certificate Content */}
            <div className="relative z-20 px-20 py-14">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-700 rounded-full">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-4xl font-black tracking-wide text-blue-900">
                    SkillSphere
                  </span>
                </div>
                <p className="text-xs text-gray-500 tracking-[0.3em] uppercase font-medium">
                  Learning Management Platform
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <Award className="h-5 w-5 text-amber-500" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-[0.15em] uppercase text-gray-800 mb-1">
                  Certificate of Completion
                </h1>
                <p className="text-gray-500 text-sm tracking-wider">
                  This is to proudly certify that
                </p>
              </div>

              {/* Student Name */}
              <div className="text-center mb-6">
                <div className="inline-block relative">
                  <span
                    className="text-5xl text-blue-900 font-bold"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {studentName}
                  </span>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1" />
                </div>
              </div>

              {/* Completion text */}
              <div className="text-center mb-6">
                <p className="text-gray-600 text-lg mb-3">
                  has successfully completed the course
                </p>
                <div className="inline-block bg-blue-50 border-l-4 border-blue-700 px-8 py-3 max-w-2xl">
                  <h2 className="text-xl font-bold text-blue-900 leading-snug">
                    {selectedCourse?.title}
                  </h2>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Footer Row */}
              <div className="flex items-end justify-between">
                {/* Instructor */}
                <div className="text-center">
                  <div
                    className="text-2xl text-gray-700 mb-1 border-b border-gray-400 pb-1 px-4"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontStyle: "italic",
                    }}
                  >
                    {selectedCourse?.instructorName || "SkillSphere Instructor"}
                  </div>
                  <p className="text-xs text-gray-500 tracking-wider uppercase">Instructor</p>
                </div>

                {/* Seal */}
                <div className="text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-blue-800 flex items-center justify-center border-4 border-amber-400 shadow-lg">
                    <div className="text-center">
                      <Award className="h-8 w-8 text-amber-300 mx-auto" />
                      <div className="text-white text-[8px] font-bold tracking-wider mt-0.5">
                        CERTIFIED
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 tracking-wider">SkillSphere Verified</p>
                </div>

                {/* Date & ID */}
                <div className="text-right space-y-2">
                  <div>
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                      <Calendar className="h-3 w-3" />
                      Date of Completion
                    </div>
                    <p className="font-semibold text-gray-800">{completionDate}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                      <Shield className="h-3 w-3" />
                      Certificate ID
                    </div>
                    <p className="text-xs font-mono text-gray-600">{certId}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                      <CheckCircle className="h-3 w-3" />
                      Validity
                    </div>
                    <p className="font-semibold text-green-600">Unlimited</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info below */}
          <div className="max-w-5xl mx-auto mt-6 print:hidden">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-3">
              <Shield className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
              <div>
                <span className="font-semibold">Certificate ID: {certId}</span> — This
                certificate is issued by SkillSphere and verifies that {studentName} has
                completed <span className="font-semibold">{selectedCourse?.title}</span>.
                Validity is <span className="font-semibold text-green-700">Unlimited</span>.
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @page {
          size: landscape;
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            overflow: hidden !important;
          }
          body * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            visibility: hidden;
          }
          #certificate-card,
          #certificate-card * {
            visibility: visible;
          }
          #certificate-card {
            position: fixed !important;
            inset: 0 !important;
            max-width: none !important;
            width: 100% !important;
            min-height: 0 !important;
            height: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CertificatesPage;
