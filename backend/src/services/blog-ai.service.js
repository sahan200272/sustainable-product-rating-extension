import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key from environment variables  
const getGenAI = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
};

/**
 * Blog content moderation function
 */
export const moderateBlogContent = async (title, content) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a content moderation AI. Analyze the following blog content for inappropriate content.

    Title: "${title}"
    Content: "${content}"

    Check for:
    - Hate speech, discrimination, or harassment
    - Explicit violence or graphic content
    - Spam or misleading information
    - Off-topic content (not related to sustainability, environment, or responsible consumption)
    - Promotional content or excessive self-promotion
    - Inappropriate language or profanity

    Return your analysis in JSON format:
    {
      "flagged": boolean,
      "score": number (0-1, where 1 is most problematic),
      "reasons": ["reason1", "reason2"]
    }

    If content is appropriate, return flagged: false, score: 0, reasons: []
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Remove markdown code fences if present
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const moderationResult = JSON.parse(cleanedResponse);

    // Ensure the response has the correct structure
    return {
      flagged: Boolean(moderationResult.flagged),
      score: Math.max(0, Math.min(1, Number(moderationResult.score) || 0)),
      reasons: Array.isArray(moderationResult.reasons) ? moderationResult.reasons : []
    };

  } catch (error) {
    console.error("Error in content moderation:", error);
    // Return safe defaults if AI moderation fails
    return {
      flagged: false,
      score: 0,
      reasons: []
    };
  }
};

/**
 * Generate Education Hub content from blog posts
 * @param {string} title - The blog title
 * @param {string} content - The blog content
 * @returns {Promise<Object>} Education guide object
 */
export const generateEducationGuide = async (title, content) => {
  try {
    // Validate input parameters
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('Content is required and must be a non-empty string');
    }

    // Initialize Gemini model
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an educational content creator specializing in sustainability. Create an educational guide from this blog post.

Blog Title: "${title}"
Blog Content: "${content}"

Create educational content that helps users learn about sustainability topics. Return ONLY valid JSON in exactly this format:

{
  "summary": "A concise 2-3 sentence summary of the main topic",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "quiz": [
    {
      "question": "Question about the topic?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    },
    {
      "question": "Another question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1,
      "explanation": "Explanation for the correct answer"
    },
    {
      "question": "Third question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2,
      "explanation": "Explanation for this answer"
    }
  ],
  "glossary": [
    { "term": "Important Term 1", "definition": "Clear definition" },
    { "term": "Important Term 2", "definition": "Clear definition" },
    { "term": "Important Term 3", "definition": "Clear definition" }
  ]
}

Requirements:
- summary: 2-3 sentences max
- keyPoints: exactly 5 bullet points
- quiz: exactly 3 questions with 4 options each
- correctAnswer: index (0, 1, 2, or 3)
- glossary: 3-5 relevant terms
- Focus on sustainability, environment, and responsible consumption
- Return ONLY the JSON object, no markdown, no text before or after
`;

    // Generate content
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error('No response received from Gemini AI');
    }

    let responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('Empty response from Gemini AI');
    }

    // Clean the response - remove any markdown formatting
    responseText = responseText.trim();
    
    // Remove code block markers if present
    responseText = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
    responseText = responseText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    
    // Remove any leading/trailing whitespace again
    responseText = responseText.trim();

    // Attempt to parse JSON
    let educationGuide;
    try {
      educationGuide = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw AI Response:', responseText);
      throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
    }

    // Validate the structure of the response
    const validationError = validateEducationGuide(educationGuide);
    if (validationError) {
      throw new Error(`Invalid response structure: ${validationError}`);
    }

    return educationGuide;

  } catch (error) {
    console.error('Error generating education guide:', error);
    
    // Provide more specific error messages
    if (error.message.includes('API key')) {
      throw new Error('Invalid Google API key. Please check your GOOGLE_API_KEY environment variable.');
    }
    
    if (error.message.includes('quota')) {
      throw new Error('Google AI API quota exceeded. Please try again later.');
    }
    
    if (error.message.includes('Invalid JSON')) {
      throw new Error('AI response could not be parsed as JSON. Please try again.');
    }

    // Re-throw with original message for other errors
    throw error;
  }
};

/**
 * Validate the structure of the education guide
 * @param {Object} guide - The education guide object
 * @returns {string|null} Error message or null if valid
 */
const validateEducationGuide = (guide) => {
  if (!guide || typeof guide !== 'object') {
    return 'Response must be an object';
  }

  // Check required fields
  const requiredFields = ['summary', 'keyPoints', 'quiz', 'glossary'];
  for (const field of requiredFields) {
    if (!(field in guide)) {
      return `Missing required field: ${field}`;
    }
  }

  // Validate summary
  if (typeof guide.summary !== 'string' || guide.summary.trim().length === 0) {
    return 'Summary must be a non-empty string';
  }

  // Validate keyPoints
  if (!Array.isArray(guide.keyPoints) || guide.keyPoints.length !== 5) {
    return 'keyPoints must be an array with exactly 5 elements';
  }

  // Validate quiz
  if (!Array.isArray(guide.quiz) || guide.quiz.length !== 3) {
    return 'quiz must be an array with exactly 3 questions';
  }

  // Validate each quiz question
  for (let i = 0; i < guide.quiz.length; i++) {
    const question = guide.quiz[i];
    if (!question.question || !Array.isArray(question.options) || 
        question.options.length !== 4 || typeof question.correctAnswer !== 'number' ||
        question.correctAnswer < 0 || question.correctAnswer > 3 || !question.explanation) {
      return `Invalid quiz question structure at index ${i}`;
    }
  }

  // Validate glossary
  if (!Array.isArray(guide.glossary) || guide.glossary.length < 3) {
    return 'glossary must be an array with at least 3 terms';
  }

  for (let i = 0; i < guide.glossary.length; i++) {
    const term = guide.glossary[i];
    if (!term.term || !term.definition) {
      return `Invalid glossary term structure at index ${i}`;
    }
  }

  return null; // Valid
};

/**
 * Test function to check if Gemini API is working
 */
export const testGeminiConnection = async () => {
  try {
    // Debug: Check API key when function is actually called
    console.log('🔑 API Key when testing:', process.env.GOOGLE_API_KEY ? 'Loaded (length: ' + process.env.GOOGLE_API_KEY.length + ')' : 'MISSING!');
    
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = 'Respond with this exact JSON: {"status": "working", "message": "API connection successful"}';
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log("Gemini API Test Response:", response);
    return response;
  } catch (error) {
    console.error("Gemini API Test Error:", error.message);
    throw error;
  }
};