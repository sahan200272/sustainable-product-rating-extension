import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL_CANDIDATES = [
  process.env.GEMINI_PRIMARY_MODEL || "gemini-2.5-flash",
  process.env.GEMINI_FALLBACK_MODEL,
].filter(Boolean);
const MAX_RETRY_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 700;

// Initialize Gemini AI with API key from environment variables  
const getGenAI = () => {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is not set (blog AI service uses GOOGLE_API_KEY only)');
  }
  return new GoogleGenerativeAI(googleApiKey);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorText = (error) => {
  const direct = error?.message || "";
  const nested = error?.errorDetails?.message || error?.response?.data?.error || "";
  return `${direct} ${nested}`.toLowerCase();
};

const isRetryableGeminiError = (error) => {
  const text = getErrorText(error);
  return (
    text.includes("503") ||
    text.includes("service unavailable") ||
    text.includes("high demand") ||
    text.includes("unavailable") ||
    text.includes("overloaded") ||
    text.includes("timeout") ||
    text.includes("econnreset")
  );
};

const createServiceUnavailableError = (error) => {
  const wrappedError = new Error(
    "AI service is temporarily busy. Please try again in a few seconds."
  );
  wrappedError.status = 503;
  wrappedError.code = "AI_SERVICE_UNAVAILABLE";
  wrappedError.cause = error;
  return wrappedError;
};

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

const extractKeyPoints = (content) => {
  const sentences = String(content || "")
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 24);

  const unique = [];
  for (const sentence of sentences) {
    if (!unique.some((u) => u.toLowerCase() === sentence.toLowerCase())) {
      unique.push(sentence);
    }
    if (unique.length === 5) break;
  }

  while (unique.length < 5) {
    unique.push("Choose practical actions that reduce environmental impact in daily decisions.");
  }

  return unique.map((point) => point.length > 140 ? `${point.slice(0, 137)}...` : point);
};

const buildFallbackEducationGuide = ({ title, content, category }) => {
  const normalizedCategory =
    typeof category === "string" && category.trim().length > 0
      ? category.trim()
      : "General Sustainability";

  const keyPoints = extractKeyPoints(content);
  const safeTitle = String(title || "This topic").trim();

  return {
    summary: `${safeTitle} highlights practical sustainability ideas in the ${normalizedCategory} category. This guide was generated using a reliable fallback mode so learning can continue even when AI capacity is limited. Focus on measurable actions, smarter consumption, and continuous improvement.`,
    keyPoints,
    quiz: [
      {
        question: `What is the best first step when applying ideas from "${safeTitle}"?`,
        options: [
          "Identify one realistic behavior change and track it weekly",
          "Wait until you can change everything at once",
          "Ignore trade-offs and costs",
          "Focus only on short-term convenience"
        ],
        correctAnswer: 0,
        explanation: "Small, consistent actions are easier to maintain and produce lasting sustainability outcomes."
      },
      {
        question: `How should users evaluate claims in the ${normalizedCategory} category?`,
        options: [
          "Rely only on marketing slogans",
          "Use evidence, transparency, and measurable impact",
          "Prefer the most expensive option",
          "Assume all products have the same footprint"
        ],
        correctAnswer: 1,
        explanation: "Good sustainability choices are evidence-based and compare real impact metrics."
      },
      {
        question: "What leads to better long-term sustainability results?",
        options: [
          "Random one-time actions",
          "No follow-up after changes",
          "Reviewing progress and improving habits over time",
          "Copying others without context"
        ],
        correctAnswer: 2,
        explanation: "Regular review helps users improve decisions and maintain progress."
      }
    ],
    glossary: [
      { term: "Sustainability", definition: "Meeting present needs while protecting environmental and social systems for the future." },
      { term: "Lifecycle Impact", definition: "Total impact of a product from raw material sourcing to disposal or reuse." },
      { term: "Evidence-Based Choice", definition: "A decision supported by verifiable data, certifications, or measurable outcomes." }
    ],
    actionableTips: [
      "Pick one weekly sustainability goal and record progress.",
      "Prefer durable, repairable, and reusable products where possible.",
      "Compare alternatives using transparent impact information.",
      "Reduce unnecessary consumption before buying replacements.",
      "Review your habits monthly and set one improvement target."
    ],
    categoryConnection: `This content aligns with ${normalizedCategory} by translating core ideas into clear decisions users can apply in daily life. It supports practical behavior change, better product choices, and steady impact improvements.`
  };
};

const generateTextWithRetry = async (prompt) => {
  const genAI = getGenAI();
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    for (const modelName of GEMINI_MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);

        if (!result || !result.response) {
          throw new Error("No response received from Gemini AI");
        }

        const responseText = result.response.text();
        if (!responseText || !responseText.trim()) {
          throw new Error("Empty response from Gemini AI");
        }

        return responseText;
      } catch (error) {
        lastError = error;

        if (!isRetryableGeminiError(error)) {
          throw error;
        }

        console.warn(
          `[Gemini Retry] attempt=${attempt}/${MAX_RETRY_ATTEMPTS}, model=${modelName}, reason=${error?.message || "unknown"}`
        );
      }
    }

    if (attempt < MAX_RETRY_ATTEMPTS) {
      const jitter = Math.floor(Math.random() * 300);
      const delay = BASE_RETRY_DELAY_MS * (2 ** (attempt - 1)) + jitter;
      await sleep(delay);
    }
  }

  throw createServiceUnavailableError(lastError);
};

/**
 * Blog content moderation function
 */
export const moderateBlogContent = async (title, content) => {
  try {
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

    const response = await generateTextWithRetry(prompt);

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
 * @param {string} category - The blog category
 * @returns {Promise<Object>} Education guide object
 */
export const generateEducationGuide = async (title, content, category) => {
  try {
    // Validate input parameters
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('Content is required and must be a non-empty string');
    }

    const normalizedCategory =
      typeof category === 'string' && category.trim().length > 0
        ? category.trim()
        : 'General Sustainability';

    const prompt = `
You are an expert sustainability educator. Create practical learning content based on the blog category and post.

Input:
Category: "${normalizedCategory}"
Title: "${title}"
Content: "${content}"

Return ONLY valid JSON:

{
  "summary": "2-3 sentences summarizing the blog and why the topic matters",
  "keyPoints": [
    "Key concept 1 from the blog",
    "Key concept 2 from the blog",
    "Key concept 3 from the blog",
    "Key concept 4 from the blog",
    "Key concept 5 from the blog"
  ],
  "quiz": [
    {
      "question": "Question based on the blog content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why the correct answer is correct"
    },
    {
      "question": "Question based on the blog content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1,
      "explanation": "Why the correct answer is correct"
    },
    {
      "question": "Question based on the blog content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2,
      "explanation": "Why the correct answer is correct"
    }
  ],
  "glossary": [
    { "term": "Term 1", "definition": "Definition 1" },
    { "term": "Term 2", "definition": "Definition 2" },
    { "term": "Term 3", "definition": "Definition 3" }
  ],
  "actionableTips": [
    "Practical action 1",
    "Practical action 2",
    "Practical action 3",
    "Practical action 4",
    "Practical action 5"
  ],
  "categoryConnection": "1 paragraph that clearly explains how this blog fits the selected category and why it matters"
}

Requirements:
- Use the provided category as the main framing for the output
- Keep language clear and educational
- Make quiz questions answerable from the blog's ideas
- Provide exactly 5 keyPoints, 3 quiz questions, and 5 actionableTips
- Return ONLY the JSON object, no markdown, no text before or after
`;

    // Generate content
    let responseText = await generateTextWithRetry(prompt);

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

    if (!educationGuide.categoryConnection && typeof educationGuide.sdg12Connection === 'string') {
      educationGuide.categoryConnection = educationGuide.sdg12Connection;
    }

    // Validate the structure of the response
    const validationError = validateEducationGuide(educationGuide);
    if (validationError) {
      throw new Error(`Invalid response structure: ${validationError}`);
    }

    return educationGuide;

  } catch (error) {
    console.error('Error generating education guide:', error);
    const errorText = getErrorText(error);
    
    // Provide more specific error messages
    if (error.message.includes('API key')) {
      throw new Error('Invalid Google API key. Please check your GOOGLE_API_KEY environment variable.');
    }
    
    if (
      error.message.includes('quota') ||
      error.code === 'AI_SERVICE_UNAVAILABLE' ||
      errorText.includes('429') ||
      errorText.includes('resource_exhausted') ||
      errorText.includes('service unavailable') ||
      errorText.includes('high demand')
    ) {
      return buildFallbackEducationGuide({ title, content, category });
    }
    
    if (error.message.includes('Invalid JSON')) {
      throw new Error('AI response could not be parsed as JSON. Please try again.');
    }

    if (error.message.includes('Invalid JSON') || error.message.includes('Invalid response structure')) {
      return buildFallbackEducationGuide({ title, content, category });
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
  const requiredFields = ['summary', 'keyPoints', 'quiz', 'glossary', 'actionableTips', 'categoryConnection'];
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

  // Validate actionableTips
  if (!Array.isArray(guide.actionableTips) || guide.actionableTips.length !== 5) {
    return 'actionableTips must be an array with exactly 5 elements';
  }

  // Validate categoryConnection
  if (typeof guide.categoryConnection !== 'string' || guide.categoryConnection.trim().length === 0) {
    return 'categoryConnection must be a non-empty string';
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
    
    const prompt = 'Respond with this exact JSON: {"status": "working", "message": "API connection successful"}';

    const response = await generateTextWithRetry(prompt);
    
    console.log("Gemini API Test Response:", response);
    return response;
  } catch (error) {
    console.error("Gemini API Test Error:", error.message);
    throw error;
  }
};