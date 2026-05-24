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

  quiz: (courseTitle, courseDescription, objectives, lectureGroups, { questionCount, easy, medium, hard }) => {
    const easyCount = Math.round(questionCount * easy / 100);
    const hardCount = Math.round(questionCount * hard / 100);
    const mediumCount = questionCount - easyCount - hardCount;

    const groupsDescription = lectureGroups
      .map((g, i) => `  Group ${i + 1}: Covers lectures — ${g.lectureNames.join(", ")}`)
      .join("\n");

    return (
      `You are an expert quiz creator for online courses.\n\n` +
      `Course: "${courseTitle}"\n` +
      `Description: ${courseDescription || "Not provided"}\n` +
      `Learning objectives: ${objectives || "Not specified"}\n\n` +
      `IMPORTANT: Generate questions STRICTLY based on the lecture topics listed below. ` +
      `Each question must be directly answerable from what students learn in those specific lectures. ` +
      `Do NOT include questions about topics not covered in the given lecture titles.\n\n` +
      `Lecture groups to generate quizzes for:\n${groupsDescription}\n\n` +
      `For EACH group, create exactly ${questionCount} multiple-choice questions.\n` +
      `Difficulty: ${easyCount} Easy, ${mediumCount} Medium, ${hardCount} Hard.\n\n` +
      `Return ONLY valid JSON — an array with one object per group:\n` +
      `[\n` +
      `  {\n` +
      `    "groupIndex": 0,\n` +
      `    "questions": [\n` +
      `      {\n` +
      `        "question": "Question text ending with ?",\n` +
      `        "options": ["Option A", "Option B", "Option C", "Option D"],\n` +
      `        "correctAnswer": 0,\n` +
      `        "explanation": "One sentence explaining why this answer is correct",\n` +
      `        "difficulty": "easy"\n` +
      `      }\n` +
      `    ]\n` +
      `  }\n` +
      `]\n` +
      `correctAnswer is the zero-based index (0–3) of the correct option. ` +
      `difficulty must be exactly "easy", "medium", or "hard". ` +
      `All questions must be grounded in the course content — no trick questions or off-topic content.`
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
