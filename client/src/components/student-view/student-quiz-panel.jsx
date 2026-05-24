import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { submitQuizAttemptService } from "@/services";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ percentage, passed }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="rotate-[-90deg]" width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={radius} fill="none"
          stroke={passed ? "#10b981" : "#ef4444"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-black", passed ? "text-emerald-400" : "text-rose-400")}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function StudentQuizPanel({
  groupIndex,
  questions = [],
  lectureNames = [],
  quizMode = "end",
  existingAttempt = null,
  onAttemptComplete,
}) {
  const { id: courseId } = useParams();
  const { auth } = useContext(AuthContext);

  const [selectedAnswers, setSelectedAnswers] = useState(
    existingAttempt?.answers
      ? Object.fromEntries(existingAttempt.answers.map((a, i) => [i, a]))
      : {}
  );
  const [phase, setPhase] = useState(existingAttempt ? "results" : "taking");
  const [results, setResults] = useState(existingAttempt || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length && questions.length > 0;

  function handleSelect(qi, oi) {
    if (phase === "results") return;
    setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }));
  }

  async function handleSubmit() {
    if (!allAnswered) return;
    setLoading(true);
    setError("");
    try {
      const answers = questions.map((_, i) => selectedAnswers[i] ?? -1);
      const response = await submitQuizAttemptService(auth?.user?._id, courseId, groupIndex, answers);
      if (response?.success) {
        setResults({ ...response.data, answers });
        setPhase("results");
        onAttemptComplete?.(response.data);
      } else {
        setError(response?.message || "Failed to submit. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    setSelectedAnswers({});
    setPhase("taking");
    setResults(null);
    setError("");
  }

  // ─── Results phase ────────────────────────────────────────────────────────

  if (phase === "results" && results) {
    const { score, totalQuestions, percentage, passed, correctAnswers } = results;
    const studentAnswers = results.answers || questions.map((_, i) => selectedAnswers[i] ?? -1);

    return (
      <div className="flex-1 overflow-y-auto bg-gray-950 text-white">
        {/* Results hero */}
        <div className={cn(
          "px-8 py-10 text-center",
          passed
            ? "bg-gradient-to-b from-emerald-950/60 via-gray-950 to-gray-950"
            : "bg-gradient-to-b from-rose-950/40 via-gray-950 to-gray-950"
        )}>
          <ScoreRing percentage={percentage} passed={passed} />

          <div className={cn(
            "text-2xl font-extrabold mt-4 mb-1",
            passed ? "text-emerald-400" : "text-rose-400"
          )}>
            {passed ? "Quiz Passed!" : "Not Passed Yet"}
          </div>

          <p className="text-sm text-gray-400 mb-1">
            {score} / {totalQuestions} correct
          </p>

          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
            {passed
              ? quizMode === "end"
                ? "All lectures completed and quiz passed — your certificate is ready."
                : "Great work! The next section of lectures is now unlocked."
              : "You need at least 60% to pass. Review the material and try again!"}
          </p>

          {!passed && (
            <Button
              onClick={handleRetry}
              className="mt-5 bg-amber-500 hover:bg-amber-600 text-white gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Quiz
            </Button>
          )}
        </div>

        {/* Per-question breakdown */}
        <div className="px-6 pb-10">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Question Breakdown
          </h3>

          <div className="space-y-4">
            {questions.map((q, qi) => {
              const studentAns = studentAnswers[qi];
              const correctAns = correctAnswers?.[qi] ?? q.correctAnswer;
              const isCorrect = studentAns === correctAns;

              return (
                <motion.div
                  key={qi}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qi * 0.04 }}
                  className={cn(
                    "border rounded-xl p-4",
                    isCorrect
                      ? "border-emerald-800/50 bg-emerald-950/30"
                      : "border-rose-800/50 bg-rose-950/20"
                  )}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    }
                    <p className="text-sm text-white font-medium leading-snug">{q.question}</p>
                  </div>

                  <div className="ml-7 grid grid-cols-2 gap-1.5 mb-2">
                    {q.options.map((opt, oi) => {
                      const isStudentChoice = studentAns === oi;
                      const isCorrectOpt = correctAns === oi;
                      return (
                        <div
                          key={oi}
                          className={cn(
                            "flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 border",
                            isCorrectOpt
                              ? "bg-emerald-900/40 border-emerald-700/60 text-emerald-300"
                              : isStudentChoice && !isCorrectOpt
                              ? "bg-rose-900/30 border-rose-700/50 text-rose-300"
                              : "bg-gray-800/50 border-gray-700/50 text-gray-500"
                          )}
                        >
                          <span className={cn(
                            "w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0",
                            isCorrectOpt
                              ? "bg-emerald-500 text-white"
                              : isStudentChoice && !isCorrectOpt
                              ? "bg-rose-500 text-white"
                              : "bg-gray-700 text-gray-400"
                          )}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p className="ml-7 text-xs text-gray-600 italic leading-relaxed">
                      {q.explanation}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Taking phase ─────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950 text-white">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-amber-950/50 to-gray-950 border-b border-amber-900/30 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-900/50">
              {quizMode === "end"
                ? <Trophy className="w-4.5 h-4.5 text-white w-5 h-5" />
                : <HelpCircle className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">
                {quizMode === "end"
                  ? "Final Course Assessment"
                  : `Quiz — After: ${lectureNames.slice(0, 2).join(", ")}${lectureNames.length > 2 ? ` +${lectureNames.length - 2} more` : ""}`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {questions.length} questions · 60% to {quizMode === "end" ? "earn certificate" : "unlock next section"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={cn("text-lg font-black", allAnswered ? "text-amber-400" : "text-gray-500")}>
              {answeredCount}/{questions.length}
            </p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">answered</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
        <AnimatePresence>
          {questions.map((q, qi) => (
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.05, duration: 0.25 }}
            >
              {/* Question */}
              <div className="flex items-start gap-3 mb-3">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all",
                  selectedAnswers[qi] !== undefined
                    ? "bg-amber-500 text-white shadow-md shadow-amber-900/50"
                    : "bg-gray-800 text-gray-500"
                )}>
                  {qi + 1}
                </div>
                <p className="text-sm text-gray-100 font-medium leading-relaxed">{q.question}</p>
              </div>

              {/* Options */}
              <div className="ml-10 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selectedAnswers[qi] === oi;
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => handleSelect(qi, oi)}
                      className={cn(
                        "text-left text-sm px-3.5 py-2.5 rounded-xl border-2 transition-all duration-150 flex items-center gap-2.5 group",
                        isSelected
                          ? "border-amber-500 bg-amber-500/15 text-amber-200 shadow-sm shadow-amber-900/30"
                          : "border-gray-700/60 bg-gray-900/60 text-gray-400 hover:border-amber-800/60 hover:bg-amber-950/20 hover:text-gray-300"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all",
                        isSelected ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-500 group-hover:bg-gray-600"
                      )}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="leading-tight">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswers[qi] === undefined && (
                <p className="ml-10 mt-1.5 text-xs text-gray-700">Not answered</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Submit bar */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-800/70 bg-gray-950">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 text-rose-400 text-sm mb-3"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">
            {allAnswered
              ? "All answered — ready to submit!"
              : `${questions.length - answeredCount} unanswered`}
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className={cn(
              "gap-2 font-semibold transition-all",
              allAnswered && !loading
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-900/40"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            )}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Submit Quiz</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StudentQuizPanel;
