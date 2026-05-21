const AI_PROMPTS = {
  outline: (topic, level, audience, syllabus) => {
    const syllabusSection = syllabus
      ? `\nSyllabus provided by instructor (use this to shape lecture titles):\n${syllabus.slice(0, 2000)}`
      : "";
    return (
      `You are an expert online course creator. Generate a complete course outline as a JSON object.\n` +
      `Topic: "${topic}"\nLevel: ${level}\nTarget audience: ${audience || "online learners"}${syllabusSection}\n\n` +
      `Return ONLY valid JSON with exactly these fields:\n` +
      `{\n` +
      `  "title": "5-10 word course title, max 60 chars",\n` +
      `  "subtitle": "compelling one-line value proposition, max 120 chars",\n` +
      `  "description": "3-4 sentence overview for potential students. Focus on what they will gain.",\n` +
      `  "objectives": "4-6 learning objectives, each starting with a bullet point character •",\n` +
      `  "welcomeMessage": "warm 2-sentence welcome from the instructor to new students",\n` +
      `  "curriculum": [\n` +
      `    { "section": "Section name", "lectures": [{ "title": "Lecture title" }] }\n` +
      `  ]\n` +
      `}\n` +
      `Aim for 4-6 sections with 3-5 lectures each. Make lecture titles specific and actionable.`
    );
  },

  outlineField: (fieldName, fieldLabel, courseContext, instruction) => {
    const { title = "", topic = "", level = "", currentValue = "" } = courseContext;
    const maxChars = {
      title: 60,
      subtitle: 120,
      description: 800,
      objectives: 600,
      welcomeMessage: 300,
    }[fieldName] || 500;

    return (
      `You are improving a single field of an online course listing.\n` +
      `Course context: Title="${title || topic}", Level=${level || "beginner"}.\n` +
      `Field to improve: ${fieldLabel}\n` +
      `Current value: "${currentValue || "(empty)"}"\n` +
      `Instruction: "${instruction || "Improve this field to be more compelling and professional"}"\n\n` +
      `Return ONLY the new value as plain text. No JSON, no explanation, no quotes around the value.\n` +
      `Maximum ${maxChars} characters.`
    );
  },

  tutor: (course, { detailed = false } = {}) => {
    const responseStyle = detailed
      ? "Provide thorough, well-structured answers. Use Markdown formatting with headings (##), bullet points (-), bold (**term**), and code blocks where relevant. Include examples and explanations."
      : "Be concise — 2-5 sentences unless the question genuinely requires more. Use Markdown: brief bullet points when listing, **bold** for key terms, `code` for technical terms. Avoid unnecessary verbosity.";

    return (
      `You are an expert AI tutor for the course "${course.title}". ` +
      `Course description: ${course.description || "No description provided."}. ` +
      `Learning objectives: ${course.objectives || "Not specified."}. ` +
      `${responseStyle} ` +
      `Always relate answers to this course's topics. ` +
      `If a question is unrelated, politely redirect the student to ask something relevant to "${course.title}".`
    );
  },
};

module.exports = { AI_PROMPTS };
