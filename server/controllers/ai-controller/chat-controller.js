const { getModel } = require("../../helpers/gemini");
const { AI_PROMPTS } = require("../../config/ai-prompts");
const Course = require("../../models/Course");

const askAITutor = async (req, res) => {
  try {
    const { courseId, message, history = [], detailed = false } = req.body;

    if (!courseId || !message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "courseId and message are required" });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Message too long (max 1000 chars)" });
    }

    const course = await Course.findById(courseId).select("title description objectives");
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const model = getModel({
      systemInstruction: AI_PROMPTS.tutor(course, { detailed }),
      maxOutputTokens: detailed ? 2000 : 900,
    });

    // Convert {role, content} to Gemini {role, parts} format; cap at last 10 turns
    const recentHistory = history.slice(-10).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: recentHistory });

    // Stream the response as Server-Sent Events. X-Accel-Buffering disables nginx
    // buffering so chunks reach the client immediately rather than batched.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    if (typeof res.flushHeaders === "function") res.flushHeaders();

    const send = (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
      if (typeof res.flush === "function") res.flush();
    };

    try {
      const result = await chat.sendMessageStream(message.trim());
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) send({ chunk: text });
      }
      send({ done: true });
      res.end();
    } catch (err) {
      console.log("Streaming error:", err);
      if (err.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED")) {
        send({ error: "AI is rate-limited — wait a moment and try again." });
      } else {
        send({ error: "AI service error. Please try again." });
      }
      res.end();
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "AI service error. Please try again." });
    }
    try { res.end(); } catch { /* socket already closed */ }
  }
};

module.exports = { askAITutor };
