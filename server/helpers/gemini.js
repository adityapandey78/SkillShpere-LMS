const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getModel({ systemInstruction, maxOutputTokens = 600 } = {}) {
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    systemInstruction,
    generationConfig: { maxOutputTokens },
  });
}

module.exports = { getModel };
