const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);


const generateStructuredJobDescription = async (data) => {

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const { title, responsibilities, qualificationsSkills, salaryBenefits, workEnv } = data;
  const prompt = `
      You are RecruiterGPT, a world-class HR expert.
      Generate a professional job offer based on these details:
      - Title: ${title}
      - Responsibilities: ${responsibilities}
      - Skills: ${qualificationsSkills}
      - Benefits: ${salaryBenefits}
      - Environment: ${workEnv}

      IMPORTANT: Return ONLY a valid JSON object with the following structure:
      {
        "title": "Professional Title",
        "introduction": "Company intro...",
        "detailedDescription": "HTML formatted detailed description for WYSIWYG",
        "keyKeywords": ["skill1", "skill2"],
        "suggestedQuestions": ["question1", "question2"]
      }
    `;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error generating job description:", error);
    throw new Error("Failed to generate job description");
  }

};

module.exports = { generateStructuredJobDescription };