const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fs = require('fs');
const pdf = require('pdf-parse');

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

const analyzeCandidateMatch = async(jobDescription, resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
      As a Senior Technical Recruiter, analyze the match between this Job Description and the Candidate's Resume.
      
      Job Description: ${jobDescription}
      Candidate Resume: ${resumeText}

      Return ONLY a JSON object with this exact structure:
      {
        "matchPercentage": (number between 0 and 100),
        "strengths": ["point1", "point2"],
        "weaknesses": ["missing skill1", "missing skill2"],
        "hiringRecommendation": "Strong Hire / Potential / Reject",
        "feedbackToCandidate": "A short encouraging advice for the candidate"
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Error analyzing candidate match:", error);
      throw new Error("Failed to analyze candidate match");
    }
}

const extractTextFromPDF = async(filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

module.exports = { 
  generateStructuredJobDescription, 
  analyzeCandidateMatch,
  extractTextFromPDF,
};