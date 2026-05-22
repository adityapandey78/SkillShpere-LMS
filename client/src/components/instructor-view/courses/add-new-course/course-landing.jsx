import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { courseCategories, courseLevelOptions, languageOptions } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { generateCourseOutlineService, regenerateCourseFieldService } from "@/services";
import { useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Wand2, Loader2, AlertCircle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const REQUIRED_FIELDS = {
  title: "Title",
  category: "Category",
  level: "Level",
  primaryLanguage: "Language",
  subtitle: "Subtitle",
  description: "Description",
  pricing: "Pricing",
  objectives: "Learning Objectives",
};

const FIELD_OPTIONS = [
  { value: "title", label: "Course Title" },
  { value: "subtitle", label: "Subtitle" },
  { value: "description", label: "Description" },
  { value: "objectives", label: "Learning Objectives" },
  { value: "welcomeMessage", label: "Welcome Message" },
];

function CourseLanding() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
  } = useContext(InstructorContext);

  const { toast } = useToast();

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // AI dialog state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiMode, setAiMode] = useState("all"); // "all" | "field"
  const [aiTopic, setAiTopic] = useState("");
  const [aiLevel, setAiLevel] = useState("beginner");
  const [aiAudience, setAiAudience] = useState("");
  const [aiSyllabus, setAiSyllabus] = useState("");
  const [aiTargetField, setAiTargetField] = useState("description");
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateField = (name, value) => {
    if (!REQUIRED_FIELDS[name]) return ""; // welcomeMessage, image are optional
    if (!value || value.toString().trim() === "") return `${REQUIRED_FIELDS[name]} is required`;
    if (name === "pricing") {
      const price = parseFloat(value);
      if (isNaN(price) || price < 0) return "Please enter a valid price";
    }
    return "";
  };

  useEffect(() => {
    const newErrors = {};
    Object.keys(touchedFields).forEach(field => {
      const error = validateField(field, courseLandingFormData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
  }, [courseLandingFormData, touchedFields]);

  const handleBlur = (fieldName) => setTouchedFields(prev => ({ ...prev, [fieldName]: true }));

  const handleChange = (name, value) => setCourseLandingFormData(prev => ({ ...prev, [name]: value }));

  // ── AI handlers ─────────────────────────────────────────────────────────────

  function openAiDialog(mode) {
    setAiMode(mode);
    setAiError("");
    if (mode === "all" && !aiTopic && courseLandingFormData.title) {
      setAiTopic(courseLandingFormData.title);
    }
    setAiDialogOpen(true);
  }

  async function handleAiSubmit() {
    if (aiGenerating) return;
    setAiError("");
    setAiGenerating(true);
    try {
      if (aiMode === "all") {
        const res = await generateCourseOutlineService(aiTopic, aiLevel, aiAudience, aiSyllabus);
        if (res?.success) {
          const d = res.data;
          setCourseLandingFormData(prev => ({
            ...prev,
            title: d.title || prev.title,
            subtitle: d.subtitle || prev.subtitle,
            description: d.description || prev.description,
            objectives: d.objectives || prev.objectives,
            welcomeMessage: d.welcomeMessage || prev.welcomeMessage,
          }));
          // Intentionally NOT auto-populating curriculum — instructor adds lectures manually
          setAiDialogOpen(false);
          setAiTopic("");
          setAiAudience("");
          setAiSyllabus("");
          toast({ title: "Outline generated!", description: "Course details have been filled in. Review and edit as needed." });
        } else {
          setAiError(res?.message || "Failed to generate. Please try again.");
        }
      } else {
        const courseContext = {
          title: courseLandingFormData.title,
          topic: aiTopic || courseLandingFormData.title,
          level: courseLandingFormData.level || aiLevel,
          currentValue: courseLandingFormData[aiTargetField] || "",
        };
        const res = await regenerateCourseFieldService(aiTargetField, courseContext, aiInstruction);
        if (res?.success) {
          setCourseLandingFormData(prev => ({ ...prev, [aiTargetField]: res.data.value }));
          setAiDialogOpen(false);
          setAiInstruction("");
          toast({ title: "Field updated!", description: `${FIELD_OPTIONS.find(f => f.value === aiTargetField)?.label} has been regenerated.` });
        } else {
          setAiError(res?.message || "Failed to regenerate. Please try again.");
        }
      }
    } catch {
      setAiError("Something went wrong. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  }

  // ── Shared style helpers ────────────────────────────────────────────────────

  const inputCls = (name) => cn(
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400",
    "focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors",
    errors[name] && "border-red-400 focus:border-red-400 focus:ring-red-300 bg-red-50/30"
  );

  const selectCls = (name) => cn(
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white",
    "focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors",
    errors[name] && "border-red-400 focus:border-red-400 focus:ring-red-300"
  );

  const canGenerate = aiMode === "field" || aiTopic.trim().length >= 3;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-6 py-5">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 mb-0.5">Step 1</div>
            Course Overview
          </div>
        </CardTitle>
        <CardDescription className="text-gray-500 mt-1 ml-[52px]">
          Set the title, description, pricing and learning objectives.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 px-6 pb-8 space-y-6">

        {/* ── AI Banner ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-xl">
          <div>
            <p className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Fill with AI
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Generate all course details in seconds — then edit as needed.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => openAiDialog("field")}
              className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Improve one field
            </button>
            <Button
              type="button"
              size="sm"
              onClick={() => openAiDialog("all")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 h-8"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Generate Outline
            </Button>
          </div>
        </div>

        {/* ── Section: Basic Information ─────────────────────────── */}
        <div className="space-y-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Basic Information
          </p>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={courseLandingFormData.title || ""}
              onChange={e => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder="e.g. Complete Python Bootcamp from Zero to Hero"
              className={inputCls("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.title}
              </p>
            )}
          </div>

          {/* Category + Level + Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={courseLandingFormData.category || ""}
                onChange={e => handleChange("category", e.target.value)}
                onBlur={() => handleBlur("category")}
                className={selectCls("category")}
              >
                <option value="">Select category</option>
                {courseCategories.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.category}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                name="level"
                value={courseLandingFormData.level || ""}
                onChange={e => handleChange("level", e.target.value)}
                onBlur={() => handleBlur("level")}
                className={selectCls("level")}
              >
                <option value="">Select level</option>
                {courseLevelOptions.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              {errors.level && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.level}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                name="primaryLanguage"
                value={courseLandingFormData.primaryLanguage || ""}
                onChange={e => handleChange("primaryLanguage", e.target.value)}
                onBlur={() => handleBlur("primaryLanguage")}
                className={selectCls("primaryLanguage")}
              >
                <option value="">Select language</option>
                {languageOptions.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              {errors.primaryLanguage && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.primaryLanguage}
                </p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1.5 max-w-xs">
            <label className="text-sm font-medium text-gray-700">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm pointer-events-none select-none">
                $
              </span>
              <input
                name="pricing"
                type="number"
                min="0"
                step="0.01"
                value={courseLandingFormData.pricing ?? ""}
                onChange={e => handleChange("pricing", e.target.value)}
                onBlur={() => handleBlur("pricing")}
                placeholder="0 for free"
                className={cn(inputCls("pricing"), "pl-7")}
              />
            </div>
            {errors.pricing && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.pricing}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── Section: Course Content ────────────────────────────── */}
        <div className="space-y-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Course Content
          </p>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Subtitle <span className="text-red-500">*</span>
            </label>
            <input
              name="subtitle"
              value={courseLandingFormData.subtitle || ""}
              onChange={e => handleChange("subtitle", e.target.value)}
              onBlur={() => handleBlur("subtitle")}
              placeholder="A compelling one-liner about your course"
              className={inputCls("subtitle")}
            />
            {errors.subtitle && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={5}
              value={courseLandingFormData.description || ""}
              onChange={e => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="What will students learn? What problem does this course solve?"
              className={cn(inputCls("description"), "resize-none leading-relaxed")}
            />
            {errors.description && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.description}
              </p>
            )}
          </div>

          {/* Objectives */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Learning Objectives <span className="text-red-500">*</span>
            </label>
            <textarea
              name="objectives"
              rows={4}
              value={courseLandingFormData.objectives || ""}
              onChange={e => handleChange("objectives", e.target.value)}
              onBlur={() => handleBlur("objectives")}
              placeholder={"• Understand core concepts\n• Build real-world projects\n• Master advanced techniques"}
              className={cn(inputCls("objectives"), "resize-none leading-relaxed")}
            />
            {errors.objectives && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.objectives}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── Section: Student Experience ───────────────────────── */}
        <div className="space-y-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Student Experience
          </p>

          {/* Welcome Message */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Welcome Message{" "}
              <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              name="welcomeMessage"
              rows={3}
              value={courseLandingFormData.welcomeMessage || ""}
              onChange={e => handleChange("welcomeMessage", e.target.value)}
              onBlur={() => handleBlur("welcomeMessage")}
              placeholder="A warm welcome to your new students..."
              className={cn(inputCls("welcomeMessage"), "resize-none leading-relaxed")}
            />
          </div>

        </div>
      </CardContent>

      {/* ── AI Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={aiDialogOpen}
        onOpenChange={v => { if (!aiGenerating) { setAiDialogOpen(v); setAiError(""); } }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Generate Course Content with AI
            </DialogTitle>
          </DialogHeader>

          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => { setAiMode("all"); setAiError(""); }}
              className={cn(
                "flex-1 py-2 rounded-md text-sm font-medium transition-all",
                aiMode === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
              All Fields
            </button>
            <button
              type="button"
              onClick={() => { setAiMode("field"); setAiError(""); }}
              className={cn(
                "flex-1 py-2 rounded-md text-sm font-medium transition-all",
                aiMode === "field" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"
              )}
            >
              <Wand2 className="w-3.5 h-3.5 inline mr-1.5" />
              One Field
            </button>
          </div>

          <div className="space-y-4 py-1">
            {aiMode === "all" ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Course Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={aiTopic}
                    onChange={e => { setAiTopic(e.target.value); setAiError(""); }}
                    placeholder="e.g. Python for Beginners, React.js Masterclass"
                    maxLength={100}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  />
                  <p className="text-xs text-gray-400 text-right">{aiTopic.length}/100</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Level</label>
                    <select
                      value={aiLevel}
                      onChange={e => setAiLevel(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Target Audience{" "}
                      <span className="text-xs font-normal text-gray-400">(optional)</span>
                    </label>
                    <input
                      value={aiAudience}
                      onChange={e => setAiAudience(e.target.value)}
                      placeholder="e.g. developers"
                      maxLength={100}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Syllabus / Course Notes{" "}
                    <span className="text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={aiSyllabus}
                    onChange={e => setAiSyllabus(e.target.value)}
                    rows={4}
                    placeholder={"Paste your course outline or topics here...\n\nExample:\n- Week 1: Introduction\n- Week 2: Core concepts\n- Week 3: Advanced topics"}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 leading-relaxed"
                  />
                  <p className="text-xs text-gray-400">
                    Helps the AI match descriptions and objectives to your actual course content.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Field to improve</label>
                  <select
                    value={aiTargetField}
                    onChange={e => setAiTargetField(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  >
                    {FIELD_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {courseLandingFormData[aiTargetField] && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400">Current value</p>
                    <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 leading-relaxed line-clamp-3">
                      {courseLandingFormData[aiTargetField]}
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    What to improve?{" "}
                    <span className="text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    value={aiInstruction}
                    onChange={e => setAiInstruction(e.target.value)}
                    placeholder='e.g. "Make it more concise" or "Use an engaging tone"'
                    maxLength={200}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
              </>
            )}

            {aiError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {aiError}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setAiDialogOpen(false); setAiError(""); }}
                disabled={aiGenerating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAiSubmit}
                disabled={!canGenerate || aiGenerating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
              >
                {aiGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                ) : aiMode === "all" ? (
                  <><Sparkles className="w-4 h-4 mr-2" />Generate All</>
                ) : (
                  <><Wand2 className="w-4 h-4 mr-2" />Improve Field</>
                )}
              </Button>
            </div>

            {aiGenerating && (
              <p className="text-xs text-center text-gray-400">This may take a few seconds…</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default CourseLanding;
