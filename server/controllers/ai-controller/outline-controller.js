const { getModel } = require("../../helpers/gemini");
const { AI_PROMPTS } = require("../../config/ai-prompts");

const ALLOWED_FIELDS = ["title", "subtitle", "description", "objectives", "welcomeMessage"];

const FIELD_LABELS = {
  title: "Course Title",
  subtitle: "Subtitle",
  description: "Description",
  objectives: "Learning Objectives",
  welcomeMessage: "Welcome Message",
};

const generateOutline = async (req, res) => {
  try {
    const { topic, level, targetAudience, syllabus } = req.body;

    if (!topic || topic.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Topic is required (min 3 characters)" });
    }

    if (topic.trim().length > 100) {
      return res.status(400).json({ success: false, message: "Topic too long (max 100 characters)" });
    }

    const safeLevel = ["beginner", "intermediate", "advanced"].includes(level) ? level : "beginner";
    const safeAudience = (targetAudience || "").slice(0, 100);
    const safeSyllabus = (syllabus || "").slice(0, 2000);

    // 3500 tokens avoids truncation — a full outline with 5+ sections easily hits 1800
    const model = getModel({ jsonMode: true, maxOutputTokens: 3500 });
    const result = await model.generateContent(
      AI_PROMPTS.outline(topic.trim(), safeLevel, safeAudience, safeSyllabus)
    );

    const rawText = result.response.text().trim();
    let outline;
    try {
      // Strip markdown fences the model occasionally wraps around JSON
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      outline = JSON.parse(cleaned);
    } catch {
      console.log("Outline JSON parse failed. Raw length:", rawText.length, "tail:", rawText.slice(-80));
      return res.status(500).json({ success: false, message: "The AI response was too long and got cut off. Try a shorter topic or fewer sections." });
    }

    if (!outline.title || !outline.description || !Array.isArray(outline.curriculum)) {
      return res.status(500).json({ success: false, message: "Incomplete outline generated. Please try again." });
    }

    const flatLectures = [];
    for (const section of outline.curriculum) {
      for (const lecture of section.lectures || []) {
        flatLectures.push({
          title: lecture.title || "Lecture",
          videoUrl: "",
          public_id: "",
          freePreview: false,
          duration: 0,
          videoType: "upload",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        title: (outline.title || "").slice(0, 60),
        subtitle: (outline.subtitle || "").slice(0, 120),
        description: outline.description || "",
        objectives: outline.objectives || "",
        welcomeMessage: outline.welcomeMessage || "",
        flatLectures,
        fullCurriculum: outline.curriculum,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({ success: false, message: "AI is busy. Please try again in a moment." });
    }
    res.status(500).json({ success: false, message: "Failed to generate outline. Please try again." });
  }
};

const regenerateField = async (req, res) => {
  try {
    const { fieldName, courseContext = {}, instruction = "" } = req.body;

    if (!ALLOWED_FIELDS.includes(fieldName)) {
      return res.status(400).json({ success: false, message: "Invalid field name." });
    }

    const model = getModel({ maxOutputTokens: 400 });
    const result = await model.generateContent(
      AI_PROMPTS.outlineField(fieldName, FIELD_LABELS[fieldName], courseContext, instruction.slice(0, 200))
    );

    const value = result.response.text().trim();

    res.status(200).json({
      success: true,
      data: { fieldName, value },
    });
  } catch (error) {
    console.log(error);
    if (error.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({ success: false, message: "AI is busy. Please try again in a moment." });
    }
    res.status(500).json({ success: false, message: "Failed to regenerate field. Please try again." });
  }
};

module.exports = { generateOutline, regenerateField };
