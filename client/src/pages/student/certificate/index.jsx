import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { getCurrentCourseProgressService, getQuizStateService } from "@/services";
import { trackEvent } from "@/lib/pulsar";
import {
  Award,
  ChevronLeft,
  Printer,
  CheckCircle,
  GraduationCap,
  Calendar,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CertificatePage() {
  const { courseId } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notCompleted, setNotCompleted] = useState(false);
  const [quizNotPassed, setQuizNotPassed] = useState(false);
  const certificateRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      if (!auth?.user?._id || !courseId) return;
      const [progressRes, quizRes] = await Promise.all([
        getCurrentCourseProgressService(auth.user._id, courseId),
        getQuizStateService(auth.user._id, courseId),
      ]);

      if (!progressRes?.success || !progressRes.data?.completed) {
        setNotCompleted(true);
        setLoading(false);
        return;
      }

      // If course has an end-of-course quiz, require it to be passed
      const quiz = quizRes?.data?.quiz;
      if (quiz?.config?.mode === "end") {
        const attempts = quizRes?.data?.attempts || [];
        const endAttempt = attempts.find((a) => a.groupIndex === 0);
        if (!endAttempt?.passed) {
          setQuizNotPassed(true);
          setLoading(false);
          return;
        }
      }

      setCourseData(progressRes.data);
      setLoading(false);
      trackEvent("certificate_viewed", {
        courseId,
        title: progressRes.data?.courseDetails?.title,
      });
    }
    fetchData();
  }, [courseId, auth?.user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (notCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Completed</h2>
          <p className="text-gray-600 mb-6">
            You need to complete this course before generating a certificate. Keep learning!
          </p>
          <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (quizNotPassed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-10 w-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Final Quiz Required</h2>
          <p className="text-gray-400 mb-2 leading-relaxed">
            To earn your certificate, you must score at least{" "}
            <span className="text-amber-400 font-semibold">60%</span> on the final course assessment.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Complete the quiz in the course player to unlock your certificate.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const completionDate = courseData?.completionDate
    ? new Date(courseData.completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const studentName = auth?.user?.userName || "Learner";
  const courseName = courseData?.courseDetails?.title || "Course";
  const instructorName =
    courseData?.courseDetails?.instructorName || "SkillSphere Instructor";

  const yearPart = courseData?.completionDate
    ? new Date(courseData.completionDate).getFullYear()
    : new Date().getFullYear();
  const certId = `SS-${(auth?.user?._id || "000000").slice(-6).toUpperCase()}-${(
    courseId || "000000"
  )
    .slice(-4)
    .toUpperCase()}-${yearPart}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4 print:min-h-0 print:py-0 print:px-0 print:bg-white">
      {/* Action Bar - hidden on print */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>

      {/* Certificate Card */}
      <div
        ref={certificateRef}
        id="certificate-card"
        className="max-w-5xl mx-auto bg-white shadow-2xl print:shadow-none relative overflow-hidden"
        style={{ minHeight: "680px" }}
      >
        {/* Outer decorative double border */}
        <div className="absolute inset-3 border-[3px] border-double border-amber-500 pointer-events-none z-10 rounded-sm"></div>
        <div className="absolute inset-5 border border-blue-900/30 pointer-events-none z-10 rounded-sm"></div>

        {/* Background watermark pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #1e3a8a 0, #1e3a8a 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-16 h-16 pointer-events-none z-10">
          <div className="w-full h-full border-l-4 border-t-4 border-amber-500 rounded-tl-lg opacity-60"></div>
        </div>
        <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none z-10">
          <div className="w-full h-full border-r-4 border-t-4 border-amber-500 rounded-tr-lg opacity-60"></div>
        </div>
        <div className="absolute bottom-8 left-8 w-16 h-16 pointer-events-none z-10">
          <div className="w-full h-full border-l-4 border-b-4 border-amber-500 rounded-bl-lg opacity-60"></div>
        </div>
        <div className="absolute bottom-8 right-8 w-16 h-16 pointer-events-none z-10">
          <div className="w-full h-full border-r-4 border-b-4 border-amber-500 rounded-br-lg opacity-60"></div>
        </div>

        {/* Certificate Content */}
        <div className="relative z-20 px-20 py-14">
          {/* Header - Logo */}
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
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <Award className="h-5 w-5 text-amber-500" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>

          {/* Certificate Title */}
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
              <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1"></div>
            </div>
          </div>

          {/* Completion Text */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-lg mb-3">
              has successfully completed the course
            </p>
            <div className="inline-block bg-blue-50 border-l-4 border-blue-700 px-8 py-3 max-w-2xl">
              <h2 className="text-xl font-bold text-blue-900 leading-snug">{courseName}</h2>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Footer Row */}
          <div className="flex items-end justify-between">
            {/* Instructor Signature */}
            <div className="text-center">
              <div
                className="text-2xl text-gray-700 mb-1 border-b border-gray-400 pb-1 px-4"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
              >
                {instructorName}
              </div>
              <p className="text-xs text-gray-500 tracking-wider uppercase">Instructor</p>
            </div>

            {/* Center Seal */}
            <div className="text-center flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-blue-800 flex items-center justify-center border-4 border-amber-400 shadow-lg">
                  <div className="text-center">
                    <Award className="h-8 w-8 text-amber-300 mx-auto" />
                    <div className="text-white text-[8px] font-bold tracking-wider mt-0.5">
                      CERTIFIED
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 tracking-wider">SkillSphere Verified</p>
            </div>

            {/* Date & Details */}
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

      {/* Info below certificate - hidden on print */}
      <div className="max-w-5xl mx-auto mt-6 print:hidden">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-3">
          <Shield className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
          <div>
            <span className="font-semibold">Certificate ID: {certId}</span> — This certificate is
            issued by SkillSphere and verifies that {studentName} has completed{" "}
            <span className="font-semibold">{courseName}</span>. Validity is{" "}
            <span className="font-semibold text-green-700">Unlimited</span>.
          </div>
        </div>
      </div>

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

export default CertificatePage;
