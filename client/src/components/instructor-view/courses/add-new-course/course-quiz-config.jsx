import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { InstructorContext } from "@/context/instructor-context";
import { generateQuizGroupsService } from "@/services";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit3,
  HelpCircle,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useContext, useState } from "react";

// ─── Difficulty bar ────────────────────────────────────────────────────────────

function DifficultyBar({ easy, medium, hard }) {
  return (
    <div className="flex rounded-full overflow-hidden h-2 bg-gray-100 w-full">
      <div
        className="bg-emerald-400 transition-all duration-300"
        style={{ width: `${easy}%` }}
      />
      <div
        className="bg-amber-400 transition-all duration-300"
        style={{ width: `${medium}%` }}
      />
      <div
        className="bg-rose-400 transition-all duration-300"
        style={{ width: `${hard}%` }}
      />
    </div>
  );
}

// ─── Difficulty input row ───────────────────────────────────────────────────────

function DifficultyInput({ label, color, value, onChange }) {
  const colorMap = {
    emerald: "text-emerald-600 border-emerald-300 bg-emerald-50 focus:ring-emerald-200",
    amber: "text-amber-600 border-amber-300 bg-amber-50 focus:ring-amber-200",
    rose: "text-rose-600 border-rose-300 bg-rose-50 focus:ring-rose-200",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={cn("text-xs font-semibold w-14 shrink-0", `text-${color}-600`)}>
        {label}
      </span>
      <div className="relative flex items-center">
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
          className={cn(
            "w-16 text-center text-sm font-bold border rounded-lg py-1.5 outline-none transition-all",
            colorMap[color]
          )}
        />
        <span className="absolute right-2 text-xs text-gray-400 pointer-events-none">%</span>
      </div>
    </div>
  );
}

// ─── Question card (read + inline edit) ───────────────────────────────────────

function QuestionCard({ question, index, groupIndex, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(question);

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    hard: "bg-rose-100 text-rose-700 border-rose-200",
  };

  function handleSave() {
    onUpdate(draft);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(question);
    setEditing(false);
  }

  function setOption(i, val) {
    const opts = [...draft.options];
    opts[i] = val;
    setDraft({ ...draft, options: opts });
  }

  if (editing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-amber-200 rounded-xl bg-amber-50/40 p-4 space-y-3"
      >
        <div className="flex items-center gap-2 mb-1">
          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Editing Question {index + 1}
          </span>
        </div>

        {/* Question text */}
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Question</Label>
          <Textarea
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            rows={2}
            className="text-sm resize-none"
          />
        </div>

        {/* Options */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Options (select correct answer)</Label>
          {draft.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, correctAnswer: i })}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  draft.correctAnswer === i
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 bg-white hover:border-emerald-300"
                )}
              >
                {draft.correctAnswer === i && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </button>
              <Input
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
                className="text-sm h-8"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
              />
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Explanation</Label>
          <Input
            value={draft.explanation}
            onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
            className="text-sm"
            placeholder="Why is this the correct answer?"
          />
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <Label className="text-xs text-gray-500">Difficulty</Label>
          <div className="flex gap-1.5">
            {["easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDraft({ ...draft, difficulty: d })}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize transition-all",
                  draft.difficulty === d
                    ? difficultyColors[d]
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={handleSave} className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white">
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="gap-1.5">
            <X className="w-3.5 h-3.5" />
            Cancel
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="border border-gray-100 rounded-xl bg-white p-4 hover:border-amber-200 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug mb-2.5">
            {question.question}
          </p>
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 border",
                  question.correctAnswer === i
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                    : "bg-gray-50 border-gray-100 text-gray-600"
                )}
              >
                <span className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  question.correctAnswer === i
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-600"
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            ))}
          </div>
          {question.explanation && (
            <p className="text-xs text-gray-400 italic flex items-start gap-1">
              <HelpCircle className="w-3 h-3 shrink-0 mt-0.5 text-gray-300" />
              {question.explanation}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize",
            difficultyColors[question.difficulty] || "bg-gray-100 text-gray-600 border-gray-200"
          )}>
            {question.difficulty}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600"
            title="Edit question"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Quiz Group Accordion ──────────────────────────────────────────────────────

function QuizGroupAccordion({ group, groupIndex, mode, onUpdateQuestion }) {
  const [open, setOpen] = useState(groupIndex === 0);

  const easyCount = group.questions.filter((q) => q.difficulty === "easy").length;
  const mediumCount = group.questions.filter((q) => q.difficulty === "medium").length;
  const hardCount = group.questions.filter((q) => q.difficulty === "hard").length;

  const groupTitle =
    mode === "end"
      ? "End of Course Assessment"
      : `After Lectures: ${group.lectureNames.join(" · ")}`;

  return (
    <div className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
            {mode === "end" ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : (
              <HelpCircle className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{groupTitle}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {group.questions.length} questions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {easyCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {easyCount} Easy
            </span>
          )}
          {mediumCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {mediumCount} Med
            </span>
          )}
          {hardCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
              {hardCount} Hard
            </span>
          )}
          {open ? (
            <ChevronUp className="w-4 h-4 text-amber-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-amber-600" />
          )}
        </div>
      </button>

      {/* Accordion body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="p-3 space-y-2 bg-gray-50/60">
              {group.questions.map((q, qi) => (
                <QuestionCard
                  key={qi}
                  question={q}
                  index={qi}
                  groupIndex={groupIndex}
                  onUpdate={(updated) => onUpdateQuestion(groupIndex, qi, updated)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

function CourseQuizConfig() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    quizConfig,
    setQuizConfig,
    quizGroups,
    setQuizGroups,
    isGeneratingQuiz,
    setIsGeneratingQuiz,
  } = useContext(InstructorContext);

  const [error, setError] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function updateConfig(patch) {
    setQuizConfig((prev) => ({ ...prev, ...patch }));
  }

  function updateDifficulty(key, val) {
    setQuizConfig((prev) => ({
      ...prev,
      difficulty: { ...prev.difficulty, [key]: val },
    }));
  }

  const diffTotal =
    quizConfig.difficulty.easy + quizConfig.difficulty.medium + quizConfig.difficulty.hard;
  const diffValid = diffTotal === 100;

  // Build lecture groups from current curriculum + quiz config
  function buildLectureGroups() {
    const lectures = courseCurriculumFormData.filter((l) => l.title?.trim());
    if (!lectures.length) return [];

    if (quizConfig.mode === "end") {
      return [
        {
          lectureIndices: lectures.map((_, i) => i),
          lectureNames: lectures.map((l) => l.title),
        },
      ];
    }

    // interval mode
    const n = Math.max(1, quizConfig.lectureInterval);
    const groups = [];
    for (let i = 0; i < lectures.length; i += n) {
      const slice = lectures.slice(i, i + n);
      groups.push({
        lectureIndices: slice.map((_, j) => i + j),
        lectureNames: slice.map((l) => l.title),
      });
    }
    return groups;
  }

  const previewGroups = quizConfig.enabled ? buildLectureGroups() : [];
  const hasEnoughLectures = courseCurriculumFormData.filter((l) => l.title?.trim()).length > 0;

  // ── Generate ─────────────────────────────────────────────────────────────────

  async function handleGenerate() {
    setError("");
    if (quizConfig.questionCount < 1) {
      setError("Questions per quiz must be at least 1.");
      return;
    }
    if (quizConfig.mode === "interval" && quizConfig.lectureInterval < 1) {
      setError("Lecture interval must be at least 1.");
      return;
    }
    if (!diffValid) {
      setError("Difficulty percentages must add up to 100%.");
      return;
    }
    if (!hasEnoughLectures) {
      setError("Add at least one lecture with a title before generating quizzes.");
      return;
    }

    const groups = buildLectureGroups();
    if (!groups.length) return;

    try {
      setIsGeneratingQuiz(true);
      const response = await generateQuizGroupsService(
        courseLandingFormData.title || "Untitled Course",
        courseLandingFormData.description,
        courseLandingFormData.objectives,
        groups,
        {
          questionCount: quizConfig.questionCount,
          difficulty: quizConfig.difficulty,
        }
      );

      if (response?.success) {
        // Merge AI-returned questions back into our groups
        const merged = groups.map((g, i) => ({
          ...g,
          questions: response.data.find((d) => d.groupIndex === i)?.questions || [],
        }));
        setQuizGroups(merged);
      } else {
        setError(response?.message || "Quiz generation failed. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  }

  function handleUpdateQuestion(groupIndex, questionIndex, updated) {
    setQuizGroups((prev) =>
      prev.map((g, gi) => {
        if (gi !== groupIndex) return g;
        return {
          ...g,
          questions: g.questions.map((q, qi) => (qi === questionIndex ? updated : q)),
        };
      })
    );
  }

  function handleRegenerate() {
    setQuizGroups([]);
    setError("");
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="mt-6">
      {/* Section divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            AI Quiz Generator
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-amber-200 via-transparent to-transparent" />
      </div>

      {/* Toggle card */}
      <div className="border border-amber-200/70 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-4 shadow-sm">
        {/* Enable toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
              <Zap className="w-4.5 h-4.5 text-white w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Generate AI Quizzes</p>
              <p className="text-xs text-gray-500">Auto-create assessments from your lecture topics</p>
            </div>
          </div>
          <Switch
            checked={quizConfig.enabled}
            onCheckedChange={(v) => updateConfig({ enabled: v })}
            id="quiz-enabled"
          />
        </div>

        <AnimatePresence>
          {quizConfig.enabled && (
            <motion.div
              key="quiz-config"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="space-y-5 pt-2">
                {/* ── Mode selection ──────────────────────────────────────── */}
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2.5 block">
                    Quiz Placement
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: After N lectures */}
                    <button
                      type="button"
                      onClick={() => updateConfig({ mode: "interval" })}
                      className={cn(
                        "relative text-left border-2 rounded-xl p-3.5 transition-all duration-150",
                        quizConfig.mode === "interval"
                          ? "border-amber-400 bg-amber-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          quizConfig.mode === "interval" ? "bg-amber-500" : "bg-gray-100"
                        )}>
                          <BookOpen className={cn("w-4 h-4", quizConfig.mode === "interval" ? "text-white" : "text-gray-400")} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">After Every N Lectures</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            Insert a quiz after every set of lectures
                          </p>
                        </div>
                      </div>
                      {quizConfig.mode === "interval" && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </button>

                    {/* Option 2: End of course */}
                    <button
                      type="button"
                      onClick={() => updateConfig({ mode: "end" })}
                      className={cn(
                        "relative text-left border-2 rounded-xl p-3.5 transition-all duration-150",
                        quizConfig.mode === "end"
                          ? "border-amber-400 bg-amber-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          quizConfig.mode === "end" ? "bg-amber-500" : "bg-gray-100"
                        )}>
                          <Trophy className={cn("w-4 h-4", quizConfig.mode === "end" ? "text-white" : "text-gray-400")} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">End of Course</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            One comprehensive quiz covering the full course
                          </p>
                        </div>
                      </div>
                      {quizConfig.mode === "end" && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Interval picker ─────────────────────────────────────── */}
                <AnimatePresence>
                  {quizConfig.mode === "interval" && (
                    <motion.div
                      key="interval-picker"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="flex items-start gap-3 bg-white border border-amber-200 rounded-xl p-3.5">
                        <div className="flex-1">
                          <Label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                            Generate a quiz after every
                          </Label>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={quizConfig.lectureInterval === 0 ? "" : quizConfig.lectureInterval}
                                onChange={(e) =>
                                  updateConfig({
                                    lectureInterval: e.target.value === "" ? 0 : Math.min(10, Number(e.target.value)),
                                  })
                                }
                                className={cn(
                                  "w-20 text-center font-bold text-amber-700",
                                  quizConfig.lectureInterval < 1 && "border-rose-400 focus-visible:ring-rose-300"
                                )}
                              />
                              <span className="text-sm text-gray-600">lecture(s)</span>
                            </div>
                            {quizConfig.lectureInterval < 1 && (
                              <p className="text-xs text-rose-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Must be at least 1
                              </p>
                            )}
                          </div>
                          {previewGroups.length > 0 && (
                            <p className="text-xs text-gray-400 mt-1.5">
                              This will create{" "}
                              <span className="font-semibold text-amber-600">
                                {previewGroups.length} quiz group{previewGroups.length !== 1 ? "s" : ""}
                              </span>{" "}
                              for your {courseCurriculumFormData.filter((l) => l.title?.trim()).length} lecture
                              {courseCurriculumFormData.filter((l) => l.title?.trim()).length !== 1 ? "s" : ""}.
                            </p>
                          )}
                        </div>
                        {/* Cost warning */}
                        <div className="shrink-0 flex items-start gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-2 max-w-[160px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-orange-700 leading-tight">
                            More frequent quizzes = more AI usage cost. Lower N = higher cost.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Question count + Difficulty ──────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Question count */}
                  <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                      Questions per Quiz
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={quizConfig.questionCount === 0 ? "" : quizConfig.questionCount}
                        onChange={(e) =>
                          updateConfig({
                            questionCount: e.target.value === "" ? 0 : Math.min(20, Number(e.target.value)),
                          })
                        }
                        className={cn(
                          "w-20 text-center font-bold",
                          quizConfig.questionCount < 1 && "border-rose-400 focus-visible:ring-rose-300"
                        )}
                      />
                      <span className="text-sm text-gray-500">questions</span>
                    </div>
                    {quizConfig.questionCount < 1 ? (
                      <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Must be at least 1
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1.5">Range: 1 – 20</p>
                    )}
                  </div>

                  {/* Difficulty distribution */}
                  <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Difficulty Mix
                      </Label>
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          diffValid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        )}
                      >
                        {diffTotal}% {diffValid ? "✓" : `(need 100%)`}
                      </span>
                    </div>
                    <DifficultyBar
                      easy={quizConfig.difficulty.easy}
                      medium={quizConfig.difficulty.medium}
                      hard={quizConfig.difficulty.hard}
                    />
                    <div className="flex items-center gap-4 mt-2.5">
                      <DifficultyInput
                        label="Easy"
                        color="emerald"
                        value={quizConfig.difficulty.easy}
                        onChange={(v) => updateDifficulty("easy", v)}
                      />
                      <DifficultyInput
                        label="Medium"
                        color="amber"
                        value={quizConfig.difficulty.medium}
                        onChange={(v) => updateDifficulty("medium", v)}
                      />
                      <DifficultyInput
                        label="Hard"
                        color="rose"
                        value={quizConfig.difficulty.hard}
                        onChange={(v) => updateDifficulty("hard", v)}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Error ───────────────────────────────────────────────── */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-rose-700">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Generate button ─────────────────────────────────────── */}
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={
                      isGeneratingQuiz ||
                      !diffValid ||
                      !hasEnoughLectures ||
                      quizConfig.questionCount < 1 ||
                      (quizConfig.mode === "interval" && quizConfig.lectureInterval < 1)
                    }
                    className={cn(
                      "gap-2 font-semibold transition-all",
                      isGeneratingQuiz || !diffValid || !hasEnoughLectures || quizConfig.questionCount < 1 || (quizConfig.mode === "interval" && quizConfig.lectureInterval < 1)
                        ? "bg-amber-300 text-white cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg"
                    )}
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Quiz{previewGroups.length > 1 ? `es (${previewGroups.length})` : ""}
                      </>
                    )}
                  </Button>
                  {quizGroups.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRegenerate}
                      className="gap-1.5 text-gray-600 border-gray-300"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </Button>
                  )}
                  {!hasEnoughLectures && (
                    <p className="text-xs text-gray-400 italic">
                      Add lectures with titles first
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Generated quiz accordion ─────────────────────────────────────────── */}
      <AnimatePresence>
        {quizGroups.length > 0 && (
          <motion.div
            key="quiz-results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-4 space-y-3"
          >
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-sm font-bold text-gray-800">
                  Generated Quiz{quizGroups.length > 1 ? "zes" : ""}
                </h3>
                <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-xs">
                  {quizGroups.reduce((s, g) => s + g.questions.length, 0)} total questions
                </Badge>
              </div>
              <p className="text-xs text-gray-400">Hover a question to edit</p>
            </div>

            {quizGroups.map((group, gi) => (
              <QuizGroupAccordion
                key={gi}
                group={group}
                groupIndex={gi}
                mode={quizConfig.mode}
                onUpdateQuestion={handleUpdateQuestion}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CourseQuizConfig;
