import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import StudentQuizPanel from "@/components/student-view/student-quiz-panel";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
  updateLectureDurationService,
  askAITutorService,
  getQuizStateService,
} from "@/services";
import { trackEvent } from "@/lib/pulsar";
import {
  Award,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  HelpCircle,
  Lock,
  Menu,
  Play,
  Send,
  SkipBack,
  SkipForward,
  Star,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const WRAP = { wordBreak: "break-word", overflowWrap: "break-word" };

const markdownComponents = {
  h1: ({ children }) => (
    <p style={{ color: "#10E9A0", fontSize: 15, fontWeight: 700, marginBottom: 6, marginTop: 10, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.03em", ...WRAP }}>{children}</p>
  ),
  h2: ({ children }) => (
    <p style={{ color: "#10E9A0", fontSize: 14, fontWeight: 600, marginBottom: 5, marginTop: 10, fontFamily: "'Outfit', sans-serif", ...WRAP }}>{children}</p>
  ),
  h3: ({ children }) => (
    <p style={{ color: "rgba(16,233,160,0.75)", fontSize: 13.5, fontWeight: 600, marginBottom: 4, marginTop: 8, fontFamily: "'Outfit', sans-serif", ...WRAP }}>{children}</p>
  ),
  p: ({ children }) => (
    <p style={{ color: "rgba(210,215,235,0.9)", fontSize: 13, lineHeight: 1.75, marginBottom: 6, fontFamily: "'Outfit', sans-serif", ...WRAP }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 8px" }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: 18, margin: "4px 0 8px", color: "rgba(210,215,235,0.9)", fontSize: 13, fontFamily: "'Outfit', sans-serif", ...WRAP }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ display: "flex", gap: 7, marginBottom: 4, alignItems: "flex-start" }}>
      <span style={{ color: "#10E9A0", flexShrink: 0, marginTop: 2, fontFamily: "monospace", fontWeight: 700, fontSize: 14 }}>›</span>
      <span style={{ color: "rgba(210,215,235,0.9)", fontSize: 13, lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", ...WRAP }}>{children}</span>
    </li>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.startsWith("language-"));
    return isBlock ? (
      <code style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, color: "rgba(210,215,235,0.85)" }}>{children}</code>
    ) : (
      <code style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, color: "#10E9A0", background: "rgba(16,233,160,0.1)", border: "1px solid rgba(16,233,160,0.2)", borderRadius: 4, padding: "0 5px", ...WRAP }}>{children}</code>
    );
  },
  pre: ({ children }) => (
    <pre style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px", overflowX: "auto", margin: "8px 0", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12 }}>{children}</pre>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "#fff", fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: "rgba(210,215,235,0.65)" }}>{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: "2px solid rgba(16,233,160,0.35)", paddingLeft: 12, margin: "8px 0", color: "rgba(210,215,235,0.65)", fontStyle: "italic", fontFamily: "'Outfit', sans-serif", fontSize: 13, ...WRAP }}>{children}</blockquote>
  ),
  hr: () => (
    <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "10px 0" }} />
  ),
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Outfit', sans-serif", fontSize: 12.5, minWidth: 280 }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: "rgba(16,233,160,0.07)", borderBottom: "1px solid rgba(16,233,160,0.18)" }}>{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th style={{ padding: "8px 12px", textAlign: "left", color: "#10E9A0", fontWeight: 600, fontSize: 12, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: "7px 12px", color: "rgba(210,215,235,0.85)", fontSize: 12.5, borderRight: "1px solid rgba(255,255,255,0.04)", ...WRAP }}>{children}</td>
  ),
};

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [currentLectureDuration, setCurrentLectureDuration] = useState(0);

  // Quiz state
  const [quizData, setQuizData] = useState({ quiz: null, attempts: [] });
  const [isQuizLoaded, setIsQuizLoaded] = useState(false);
  const [activeItemType, setActiveItemType] = useState("lecture"); // "lecture" | "quiz"
  const [activeQuizGroupIndex, setActiveQuizGroupIndex] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // AI chat state
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI tutor for this course. Ask me anything about the topics covered here." }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [detailedMode, setDetailedMode] = useState(false);
  const [aiPanelWidth, setAiPanelWidth] = useState(420);
  const chatBottomRef = useRef(null);
  const isResizingRef = useRef(false);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(420);

  const { id } = useParams();

  const currentLectureRef = useRef(null);
  const courseProgressRef = useRef(null);
  const authRef = useRef(null);
  const completedTrackedRef = useRef(false); // fire course_completed only once

  useEffect(() => { currentLectureRef.current = currentLecture; }, [currentLecture]);
  useEffect(() => { courseProgressRef.current = studentCurrentCourseProgress; }, [studentCurrentCourseProgress]);
  useEffect(() => { authRef.current = auth; }, [auth]);

  // ── Curriculum items: lectures interleaved with quiz items ─────────────────

  const curriculumItems = useMemo(() => {
    const curriculum = studentCurrentCourseProgress?.courseDetails?.curriculum;
    const quiz = quizData?.quiz;

    if (!curriculum?.length) return [];

    if (!quiz || !quiz.groups?.length) {
      return curriculum.map((l, i) => ({ type: "lecture", data: l, lectureIndex: i }));
    }

    const { mode, lectureInterval = 2 } = quiz.config;
    const items = [];

    if (mode === "end") {
      curriculum.forEach((l, i) => items.push({ type: "lecture", data: l, lectureIndex: i }));
      if (quiz.groups[0]) {
        items.push({
          type: "quiz",
          groupIndex: 0,
          questions: quiz.groups[0].questions,
          lectureNames: quiz.groups[0].lectureNames,
        });
      }
    } else {
      const n = Math.max(1, lectureInterval);
      let gi = 0;
      for (let i = 0; i < curriculum.length; i++) {
        items.push({ type: "lecture", data: curriculum[i], lectureIndex: i });
        if ((i + 1) % n === 0 && gi < quiz.groups.length) {
          const group = quiz.groups[gi];
          items.push({
            type: "quiz",
            groupIndex: gi,
            questions: group.questions,
            lectureNames: group.lectureNames,
          });
          gi++;
        }
      }
    }

    return items;
  }, [studentCurrentCourseProgress?.courseDetails?.curriculum, quizData]);

  // Sync currentItemIndex when curriculumItems first loads
  useEffect(() => {
    if (!curriculumItems.length) return;
    const match = curriculumItems.findIndex(
      (item) => item.type === "lecture" && item.lectureIndex === currentLectureIndex
    );
    if (match > -1) setCurrentItemIndex(match);
  }, [curriculumItems]); // intentionally only re-run when items change

  // ── Gating ─────────────────────────────────────────────────────────────────

  function isLectureLocked(lectureIndex) {
    const quiz = quizData?.quiz;
    if (!quiz || quiz.config.mode === "end") return false;
    const n = quiz.config.lectureInterval || 2;
    const lectureGroupIdx = Math.floor(lectureIndex / n);
    if (lectureGroupIdx === 0) return false;
    const prevAttempt = quizData.attempts.find((a) => a.groupIndex === lectureGroupIdx - 1);
    return !prevAttempt?.passed;
  }

  // ── Completion dialog logic ────────────────────────────────────────────────

  useEffect(() => {
    if (!isCourseCompleted || !isQuizLoaded) return;

    const quiz = quizData?.quiz;
    const endQuizRequired = quiz && quiz.config.mode === "end";

    if (endQuizRequired) {
      const endAttempt = quizData.attempts.find((a) => a.groupIndex === 0);
      if (!endAttempt?.passed) {
        // Auto-navigate to end quiz
        const quizIdx = curriculumItems.findIndex((i) => i.type === "quiz" && i.groupIndex === 0);
        if (quizIdx > -1) {
          setCurrentItemIndex(quizIdx);
          setActiveItemType("quiz");
          setActiveQuizGroupIndex(0);
          setCurrentLecture(null);
        }
        return;
      }
    }

    setShowCourseCompleteDialog(true);
    setShowConfetti(true);
  }, [isCourseCompleted, isQuizLoaded, quizData?.attempts, curriculumItems]);

  // ── Data fetching ──────────────────────────────────────────────────────────

  function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return null;
    const totalSec = Math.round(seconds);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return s > 0 ? `${h}h ${m}m ${s}s` : `${h}h ${m}m`;
    if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
    return `${s}s`;
  }

  async function fetchCurrentCourseProgress(advanceLecture = false) {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (!response?.success) return;

    if (!response.data?.isPurchased) {
      setLockCourse(true);
      return;
    }

    setStudentCurrentCourseProgress({
      courseDetails: response.data.courseDetails,
      progress: response.data.progress,
    });

    if (response.data.completed) {
      setIsCourseCompleted(true);
      if (!completedTrackedRef.current) {
        completedTrackedRef.current = true;
        trackEvent("course_completed", {
          courseId: response.data.courseDetails?._id,
          title: response.data.courseDetails?.title,
          lectures: response.data.courseDetails?.curriculum?.length,
        });
      }
      setCurrentLecture(response.data.courseDetails.curriculum[0]);
      setCurrentLectureIndex(0);
      // Completion dialog is now handled by the useEffect above (after quiz loads)
      return;
    }

    if (!advanceLecture) return;

    const curriculum = response.data.courseDetails.curriculum;
    if (!response.data.progress?.length) {
      setCurrentLecture(curriculum[0]);
      setCurrentLectureIndex(0);
    } else {
      const lastViewedIdx = response.data.progress.reduceRight(
        (acc, obj, idx) => (acc === -1 && obj.viewed ? idx : acc),
        -1
      );
      const nextIdx = Math.min(lastViewedIdx + 1, curriculum.length - 1);
      setCurrentLecture(curriculum[nextIdx]);
      setCurrentLectureIndex(nextIdx);
    }
  }

  async function fetchQuizState() {
    try {
      const response = await getQuizStateService(auth?.user?._id, id);
      if (response?.success) {
        setQuizData(response.data);
      }
    } catch (err) {
      console.error("Failed to load quiz state:", err);
    } finally {
      setIsQuizLoaded(true);
    }
  }

  // ── Video progress ─────────────────────────────────────────────────────────

  const handleVideoProgressUpdate = useCallback(async () => {
    const lecture = currentLectureRef.current;
    const courseProgress = courseProgressRef.current;
    const user = authRef.current?.user;

    if (!lecture?._id || !user?._id || !courseProgress?.courseDetails?._id) return;

    const alreadyViewed = courseProgress.progress?.find(
      (p) => p.lectureId === lecture._id
    )?.viewed;
    if (alreadyViewed) return;

    try {
      const response = await markLectureAsViewedService(
        user._id,
        courseProgress.courseDetails._id,
        lecture._id
      );
      if (response?.success) {
        trackEvent("lecture_completed", {
          courseId: courseProgress.courseDetails._id,
          courseTitle: courseProgress.courseDetails?.title,
          lectureId: lecture._id,
          lectureTitle: lecture?.title,
        });
        await fetchCurrentCourseProgress(false);
      }
    } catch (err) {
      console.error("Failed to mark lecture as viewed:", err);
    }
  }, [id]);

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );
    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      setIsCourseCompleted(false);
      setActiveItemType("lecture");
      setActiveQuizGroupIndex(null);
      fetchCurrentCourseProgress();
    }
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function selectItem(item, itemIndex) {
    if (item.type === "lecture" && isLectureLocked(item.lectureIndex)) return;
    setCurrentItemIndex(itemIndex);
    if (item.type === "lecture") {
      setCurrentLectureDuration(0);
      setCurrentLecture(item.data);
      setCurrentLectureIndex(item.lectureIndex);
      setActiveItemType("lecture");
      setActiveQuizGroupIndex(null);
    } else {
      setActiveItemType("quiz");
      setActiveQuizGroupIndex(item.groupIndex);
      setCurrentLecture(null);
    }
  }

  function goToPrev() {
    if (currentItemIndex <= 0) return;
    const prev = curriculumItems[currentItemIndex - 1];
    if (prev) selectItem(prev, currentItemIndex - 1);
  }

  function goToNext() {
    if (currentItemIndex >= curriculumItems.length - 1) return;
    const next = curriculumItems[currentItemIndex + 1];
    if (next && !(next.type === "lecture" && isLectureLocked(next.lectureIndex))) {
      selectItem(next, currentItemIndex + 1);
    }
  }

  function handleLectureDuration(duration) {
    setCurrentLectureDuration(duration);
    const courseId = studentCurrentCourseProgress?.courseDetails?._id;
    const lectureId = currentLecture?._id;
    if (duration > 0 && courseId && lectureId) {
      updateLectureDurationService(String(courseId), String(lectureId), Math.round(duration)).catch(() => {});
    }
  }

  // ── Quiz attempt handler ───────────────────────────────────────────────────

  function handleQuizAttemptComplete(result) {
    const { groupIndex, score, totalQuestions, percentage, passed, answers } = result;
    setQuizData((prev) => ({
      ...prev,
      attempts: [
        ...prev.attempts.filter((a) => a.groupIndex !== groupIndex),
        { userId: auth?.user?._id, courseId: id, groupIndex, score, totalQuestions, percentage, passed, answers },
      ],
    }));
  }

  // ── Progress calc ──────────────────────────────────────────────────────────

  const progressPercentage = useMemo(() => {
    const total = studentCurrentCourseProgress?.courseDetails?.curriculum?.length;
    const done = studentCurrentCourseProgress?.progress?.filter((p) => p.viewed).length;
    if (!total) return 0;
    return Math.round((done / total) * 100);
  }, [studentCurrentCourseProgress]);

  // ── AI Chat ────────────────────────────────────────────────────────────────

  const scrollChatToBottom = (smooth = true) => {
    chatBottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
  };

  async function handleAISend() {
    const trimmed = aiInput.trim();
    if (!trimmed || aiLoading) return;
    trackEvent("ai_tutor_used", {
      courseId: studentCurrentCourseProgress?.courseDetails?._id,
      courseTitle: studentCurrentCourseProgress?.courseDetails?.title,
      detailed: detailedMode,
    });
    const historyForRequest = aiMessages.slice(1);
    setAiMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setAiInput("");
    setAiLoading(true);
    requestAnimationFrame(() => scrollChatToBottom(true));
    let firstChunk = true;
    try {
      await askAITutorService(
        studentCurrentCourseProgress?.courseDetails?._id,
        trimmed,
        historyForRequest,
        detailedMode,
        (chunk) => {
          if (firstChunk) { setAiLoading(false); firstChunk = false; }
          setAiMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            if (next[lastIdx]?.role === "assistant") {
              next[lastIdx] = { ...next[lastIdx], content: next[lastIdx].content + chunk };
            }
            return next;
          });
          scrollChatToBottom(false);
        }
      );
    } catch (err) {
      const msg = err?.message || "Sorry, I had trouble connecting. Please try again.";
      setAiMessages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (next[lastIdx]?.role === "assistant" && !next[lastIdx].content) {
          next[lastIdx] = { ...next[lastIdx], content: msg };
        } else {
          next.push({ role: "assistant", content: `⚠ ${msg}` });
        }
        return next;
      });
    } finally {
      setAiLoading(false);
      setTimeout(() => scrollChatToBottom(true), 50);
    }
  }

  // ── Resize AI panel ────────────────────────────────────────────────────────

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingRef.current) return;
      const delta = resizeStartXRef.current - e.clientX;
      const next = Math.min(700, Math.max(300, resizeStartWidthRef.current + delta));
      setAiPanelWidth(next);
    };
    const onMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const startResize = (e) => {
    e.preventDefault();
    isResizingRef.current = true;
    resizeStartXRef.current = e.clientX;
    resizeStartWidthRef.current = aiPanelWidth;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      await Promise.all([
        fetchCurrentCourseProgress(true),
        fetchQuizState(),
      ]);
    }
    init();
  }, [id]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  useEffect(() => {
    const styleId = "ai-tutor-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');
        @keyframes ai-panel-in { from { opacity:0; transform:translateY(10px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes ai-fab-in   { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
        .ai-panel-enter { animation: ai-panel-in 0.22s cubic-bezier(0.16,1,0.3,1) forwards; }
        .ai-fab-enter   { animation: ai-fab-in   0.2s  cubic-bezier(0.16,1,0.3,1) forwards; }
        .ai-input-field::placeholder { color: rgba(255,255,255,0.18); }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────

  const activeQuizItem = activeItemType === "quiz"
    ? curriculumItems.find((i) => i.type === "quiz" && i.groupIndex === activeQuizGroupIndex)
    : null;

  const totalLectures = studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0;
  const isNextLocked = (() => {
    if (currentItemIndex >= curriculumItems.length - 1) return true;
    const next = curriculumItems[currentItemIndex + 1];
    return next?.type === "lecture" && isLectureLocked(next.lectureIndex);
  })();

  // For certificate button: only show when completed + (no end quiz required or end quiz passed)
  const endQuizRequired = quizData?.quiz?.config?.mode === "end";
  const endQuizPassed = quizData?.attempts?.find((a) => a.groupIndex === 0)?.passed;
  const canGetCertificate = isCourseCompleted && (!endQuizRequired || endQuizPassed);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student/student-courses")}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-300">{progressPercentage}%</span>
          </div>

          {canGetCertificate && (
            <Button
              onClick={() => navigate(`/student/certificate/${id}`)}
              className="hidden sm:flex bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold shadow-lg"
              size="sm"
            >
              <Award className="h-4 w-4 mr-2" />
              Get Certificate
            </Button>
          )}

          {isCourseCompleted && endQuizRequired && !endQuizPassed && (
            <Button
              onClick={() => {
                const quizIdx = curriculumItems.findIndex((i) => i.type === "quiz" && i.groupIndex === 0);
                if (quizIdx > -1) selectItem(curriculumItems[quizIdx], quizIdx);
              }}
              className="hidden sm:flex bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg"
              size="sm"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Take Final Quiz
            </Button>
          )}

          <Button
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className="bg-gray-800 hover:bg-gray-700 border-gray-600"
            variant="outline"
          >
            {isSideBarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div
          className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
          style={{ marginRight: aiChatOpen ? aiPanelWidth : (isSideBarOpen ? 420 : 0) }}
        >
          {/* Video OR Quiz panel */}
          {activeItemType === "quiz" && activeQuizItem ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              <StudentQuizPanel
                key={`quiz-${activeQuizGroupIndex}`}
                groupIndex={activeQuizGroupIndex}
                questions={activeQuizItem.questions}
                lectureNames={activeQuizItem.lectureNames}
                quizMode={quizData?.quiz?.config?.mode || "end"}
                existingAttempt={quizData.attempts.find((a) => a.groupIndex === activeQuizGroupIndex) || null}
                onAttemptComplete={handleQuizAttemptComplete}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="relative bg-black">
                <VideoPlayer
                  key={currentLecture?._id}
                  width="100%"
                  height="500px"
                  url={currentLecture?.videoUrl}
                  onProgressUpdate={handleVideoProgressUpdate}
                  progressData={currentLecture}
                  onDuration={handleLectureDuration}
                />
              </div>

              <div className="p-6 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-white">{currentLecture?.title}</h2>
                    {currentLectureDuration > 0 && (
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(currentLectureDuration)}</span>
                      </div>
                    )}
                  </div>
                  {studentCurrentCourseProgress?.progress?.find(
                    (p) => p.lectureId === currentLecture?._id
                  )?.viewed && (
                    <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation controls — always shown */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 bg-gray-900/60 backdrop-blur-sm border-t border-gray-700/50">
            <Button
              onClick={goToPrev}
              disabled={currentItemIndex === 0}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 disabled:opacity-40"
              variant="outline"
              size="sm"
            >
              <SkipBack className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-3 text-sm text-gray-400">
              {activeItemType === "quiz" ? (
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <HelpCircle className="h-4 w-4" />
                  {quizData?.quiz?.config?.mode === "end" ? "Final Quiz" : `Quiz ${(activeQuizGroupIndex ?? 0) + 1}`}
                </span>
              ) : (
                <span>Lecture {currentLectureIndex + 1} of {totalLectures}</span>
              )}
              <div className="w-16 bg-gray-700 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${curriculumItems.length ? ((currentItemIndex + 1) / curriculumItems.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <Button
              onClick={goToNext}
              disabled={isNextLocked || currentItemIndex >= curriculumItems.length - 1}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 disabled:opacity-40"
              variant="outline"
              size="sm"
            >
              Next
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={cn(
          "fixed top-[80px] right-0 bottom-0 w-[420px] bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-l border-gray-700/50 transition-all duration-300",
          isSideBarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-gray-800/50 w-full grid-cols-2 p-1 m-4 mb-0 rounded-lg">
              <TabsTrigger
                value="content"
                className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium"
              >
                <Target className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 mt-4 overflow-hidden">
              <ScrollArea className="h-full px-4">
                <div className="space-y-1.5 pb-6">
                  {curriculumItems.map((item, itemIndex) => {
                    if (item.type === "lecture") {
                      const isCompleted = !!studentCurrentCourseProgress?.progress?.find(
                        (p) => p.lectureId === item.data._id
                      )?.viewed;
                      const isCurrent = activeItemType === "lecture" && currentLecture?._id === item.data._id;
                      const locked = isLectureLocked(item.lectureIndex);

                      return (
                        <div
                          key={item.data._id}
                          onClick={() => !locked && selectItem(item, itemIndex)}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group",
                            locked
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer",
                            isCurrent
                              ? "bg-blue-600/20 border border-blue-500/40 shadow-lg"
                              : locked
                              ? "border border-transparent"
                              : "hover:bg-gray-700/50 hover:border-gray-600/50 border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            isCompleted ? "bg-green-500 text-white"
                              : isCurrent ? "bg-blue-500 text-white"
                              : locked ? "bg-gray-700 text-gray-600"
                              : "bg-gray-700 text-gray-400 group-hover:bg-gray-600"
                          )}>
                            {locked
                              ? <Lock className="h-3.5 w-3.5" />
                              : isCompleted
                              ? <Check className="h-4 w-4" />
                              : <Play className="h-4 w-4" />
                            }
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              isCurrent ? "text-blue-300" : locked ? "text-gray-600" : "text-white"
                            )}>
                              {item.data.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Lecture {item.lectureIndex + 1}
                              {formatDuration(item.data.duration) ? ` · ${formatDuration(item.data.duration)}` : ""}
                              {locked ? " · Complete previous quiz to unlock" : ""}
                            </p>
                          </div>

                          {isCurrent && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shrink-0" />
                          )}
                        </div>
                      );
                    }

                    // ── Quiz item ──────────────────────────────────────────────
                    const attempt = quizData.attempts.find((a) => a.groupIndex === item.groupIndex);
                    const isCurrent = activeItemType === "quiz" && activeQuizGroupIndex === item.groupIndex;
                    const quizStatus = !attempt ? "pending" : attempt.passed ? "passed" : "failed";
                    const isEndQuiz = quizData?.quiz?.config?.mode === "end";

                    return (
                      <div key={`quiz-${item.groupIndex}`}>
                        {/* Divider above quiz item */}
                        <div className="flex items-center gap-2 py-1 px-1">
                          <div className="flex-1 h-px bg-amber-900/40" />
                          <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">
                            {isEndQuiz ? "Final Assessment" : "Quiz"}
                          </span>
                          <div className="flex-1 h-px bg-amber-900/40" />
                        </div>

                        <div
                          onClick={() => selectItem(item, itemIndex)}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                            isCurrent
                              ? "bg-amber-600/20 border border-amber-500/40 shadow-lg"
                              : "hover:bg-amber-900/20 hover:border-amber-900/40 border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            quizStatus === "passed"
                              ? "bg-emerald-500"
                              : quizStatus === "failed"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          )}>
                            {quizStatus === "passed"
                              ? <Check className="h-4 w-4 text-white" />
                              : isEndQuiz
                              ? <Trophy className="h-4 w-4 text-white" />
                              : <HelpCircle className="h-4 w-4 text-white" />
                            }
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-semibold truncate",
                              isCurrent ? "text-amber-300" : "text-amber-200"
                            )}>
                              {isEndQuiz ? "Final Course Quiz" : `Quiz ${item.groupIndex + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.lectureNames.slice(0, 2).join(", ")}
                              {item.lectureNames.length > 2 ? ` +${item.lectureNames.length - 2}` : ""}
                            </p>
                            {attempt && (
                              <p className={cn(
                                "text-xs font-semibold mt-0.5",
                                attempt.passed ? "text-emerald-400" : "text-rose-400"
                              )}>
                                {attempt.percentage}% — {attempt.passed ? "Passed ✓" : "Try again"}
                              </p>
                            )}
                            {!attempt && (
                              <p className="text-xs text-amber-700 font-medium mt-0.5">
                                {isEndQuiz ? "Required for certificate" : "Required to unlock next section"}
                              </p>
                            )}
                          </div>

                          {isCurrent && (
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="flex-1 mt-4 overflow-hidden">
              <ScrollArea className="h-full px-4">
                <div className="space-y-6 pb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-lg font-bold text-white">{progressPercentage}%</p>
                          <p className="text-xs text-gray-400">Completed</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 p-4 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-lg font-bold text-white">{totalLectures}</p>
                          <p className="text-xs text-gray-400">Lectures</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quiz progress summary */}
                  {quizData?.quiz && (
                    <div className="bg-amber-900/20 border border-amber-800/40 rounded-lg p-4">
                      <h4 className="text-amber-300 font-semibold text-sm mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Quiz Progress
                      </h4>
                      {quizData.quiz.groups.map((_, gi) => {
                        const att = quizData.attempts.find((a) => a.groupIndex === gi);
                        return (
                          <div key={gi} className="flex items-center justify-between text-xs text-gray-400 py-1 border-b border-gray-800 last:border-0">
                            <span>
                              {quizData.quiz.config.mode === "end" ? "Final Quiz" : `Quiz ${gi + 1}`}
                            </span>
                            {att ? (
                              <span className={att.passed ? "text-emerald-400 font-semibold" : "text-rose-400"}>
                                {att.percentage}% {att.passed ? "✓" : "✗"}
                              </span>
                            ) : (
                              <span className="text-gray-600">Not attempted</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" />
                      About This Course
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Instructor
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {studentCurrentCourseProgress?.courseDetails?.instructorName}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Tutor FAB */}
      {!aiChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setAiChatOpen(true)}
            className="ai-fab-enter group relative flex items-center justify-center"
            style={{ width: 56, height: 56 }}
            title="Open AI Tutor"
          >
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(16,233,160,0.12)", animationDuration: "2.2s" }} />
            <span className="absolute inset-1.5 rounded-full"
              style={{ background: "rgba(16,233,160,0.07)" }} />
            <span
              className="relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300"
              style={{
                background: "rgba(4, 9, 22, 0.96)",
                border: "1px solid rgba(16,233,160,0.45)",
                boxShadow: "0 0 18px rgba(16,233,160,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 32px rgba(16,233,160,0.38), inset 0 1px 0 rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 18px rgba(16,233,160,0.18), inset 0 1px 0 rgba(255,255,255,0.06)")}
            >
              <Bot className="w-5 h-5" style={{ color: "#10E9A0" }} />
            </span>
          </button>
        </div>
      )}

      {/* AI Chat Panel */}
      {aiChatOpen && (
        <div
          className="ai-panel-enter fixed flex flex-col overflow-hidden"
          style={{
            top: 80, right: 0, bottom: 0,
            width: aiPanelWidth,
            zIndex: 60,
            background: "rgba(4, 9, 22, 0.97)",
            backdropFilter: "blur(28px)",
            borderLeft: "1px solid rgba(16,233,160,0.14)",
            boxShadow: "-12px 0 60px rgba(0,0,0,0.6), 0 0 80px rgba(16,233,160,0.04)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.009) 2px, rgba(255,255,255,0.009) 4px)", zIndex: 0 }} />

          <div onMouseDown={startResize}
            style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 6, cursor: "ew-resize", zIndex: 10, background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,233,160,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")} />

          <div className="relative flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.055)", zIndex: 1 }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center relative flex-shrink-0"
                style={{ background: "rgba(16,233,160,0.1)", border: "1px solid rgba(16,233,160,0.22)" }}>
                <Bot className="w-4 h-4" style={{ color: "#10E9A0" }} />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: "#10E9A0", boxShadow: "0 0 6px rgba(16,233,160,0.9)" }} />
              </div>
              <div className="flex flex-col leading-none gap-1">
                <span className="text-white font-semibold tracking-[0.12em] uppercase"
                  style={{ fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>AI Tutor</span>
                <span style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(16,233,160,0.45)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                  GEMINI · ONLINE
                </span>
              </div>
            </div>
            <button onClick={() => setAiChatOpen(false)}
              className="flex items-center justify-center rounded-xl transition-all duration-200"
              style={{ width: 32, height: 32, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.38)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.38)"; }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <ScrollArea className="flex-1 px-5 py-4" style={{ position: "relative", zIndex: 1 }}>
            <div className="space-y-6">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {msg.role === "assistant" ? (
                    <div style={{ width: "100%", minWidth: 0 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-3 h-3 flex-shrink-0" style={{ color: "#10E9A0" }} />
                        <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(16,233,160,0.5)", fontFamily: "'JetBrains Mono', ui-monospace, monospace", textTransform: "uppercase" }}>Tutor</span>
                      </div>
                      <div style={{ borderLeft: "2px solid rgba(16,233,160,0.3)", paddingLeft: 12, minWidth: 0, overflow: "hidden" }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div style={{ maxWidth: "86%", fontSize: 14, lineHeight: 1.65, padding: "10px 14px", borderRadius: "16px 16px 2px 16px", background: "rgba(16,233,160,0.11)", border: "1px solid rgba(16,233,160,0.2)", color: "rgba(255,255,255,0.93)", fontFamily: "'Outfit', sans-serif", wordBreak: "break-word", overflowWrap: "break-word" }}>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              {aiLoading && (
                <div className="flex items-start">
                  <div className="flex items-center gap-1 pl-3" style={{ borderLeft: "2px solid rgba(16,233,160,0.3)" }}>
                    {[0, 160, 320].map((delay) => (
                      <span key={delay} className="animate-pulse"
                        style={{ color: "#10E9A0", fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, animationDelay: `${delay}ms`, lineHeight: 1 }}>—</span>
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          </ScrollArea>

          <div className="flex-shrink-0 px-5 pb-5 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.055)", position: "relative", zIndex: 1 }}>
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 select-none"
                style={{ color: "#10E9A0", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 18, fontWeight: 500, lineHeight: 1, opacity: aiLoading ? 0.35 : 1 }}>›</span>
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAISend()}
                placeholder="ask anything..."
                maxLength={1000}
                disabled={aiLoading}
                className="ai-input-field flex-1 bg-transparent outline-none disabled:opacity-30"
                style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace", fontSize: 14, caretColor: "#10E9A0" }}
              />
              <button onClick={handleAISend} disabled={!aiInput.trim() || aiLoading}
                className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-25"
                style={{ width: 34, height: 34, background: aiInput.trim() && !aiLoading ? "rgba(16,233,160,0.14)" : "transparent", border: "1px solid rgba(16,233,160,0.28)", color: "#10E9A0" }}>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <button onClick={() => setDetailedMode((d) => !d)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 20, border: detailedMode ? "1px solid rgba(16,233,160,0.45)" : "1px solid rgba(255,255,255,0.1)", background: detailedMode ? "rgba(16,233,160,0.1)" : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: detailedMode ? "#10E9A0" : "rgba(255,255,255,0.2)", boxShadow: detailedMode ? "0 0 5px rgba(16,233,160,0.7)" : "none", transition: "all 0.2s" }} />
                <span style={{ fontSize: 10, letterSpacing: "0.1em", color: detailedMode ? "#10E9A0" : "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', ui-monospace, monospace", transition: "color 0.2s" }}>
                  {detailedMode ? "DETAILED" : "BRIEF"}
                </span>
              </button>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                {aiInput.length}/1000
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Not Purchased Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px] bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center">
              <X className="h-5 w-5 mr-2" />
              Access Restricted
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              You need to purchase this course to access the content.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Course Completion Dialog */}
      <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
        <DialogContent className="sm:w-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Award className="h-8 w-8 mr-3 text-yellow-400" />
              Congratulations! 🎉
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-center space-y-4">
                <p className="text-lg text-green-400 font-medium">
                  You&apos;ve completed the course!
                </p>
                <p className="text-gray-300 text-sm">
                  All lectures watched{endQuizPassed ? " and final quiz passed" : ""}. Your certificate is ready.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => { setShowCourseCompleteDialog(false); navigate(`/student/certificate/${id}`); }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold flex-1 shadow-lg"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Generate Certificate
                  </Button>
                  <Button
                    onClick={() => { setShowCourseCompleteDialog(false); handleRewatchCourse(); }}
                    variant="outline"
                    className="border-green-500 text-green-400 hover:bg-green-500/20 flex-1"
                  >
                    Rewatch Course
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
