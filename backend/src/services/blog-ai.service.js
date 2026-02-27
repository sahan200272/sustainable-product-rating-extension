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
 * Validate if content is related to SDG-12 before generating education guide
 * @param {string} title - The content title
 * @param {string} content - The content text
 * @returns {Promise<Object>} Validation result with relevance check
 */
export const validateSDG12Content = async (title, content) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const validationPrompt = `
You are an expert in UN SDG-12 (Responsible Consumption and Production). Analyze the following content to determine if it's relevant to SDG-12.

Title: "${title}"
Content: "${content}"

SDG-12 covers:
- Responsible consumption patterns
- Sustainable production practices
- Circular economy and waste reduction
- Eco-friendly products and materials
- Life cycle assessment
- Resource efficiency
- Sustainable supply chains
- Consumer behavior for sustainability

Respond with ONLY a JSON object:
{
  "isSDG12Relevant": true/false,
  "relevanceScore": 0-100,
  "reason": "Brief explanation of why it is or isn't SDG-12 relevant",
  "sdg12Aspects": ["list of relevant SDG-12 aspects found"] or []
}

Be strict - only approve content directly related to consumption, production, circular economy, or eco-friendly products.
`;

    const result = await model.generateContent(validationPrompt);
    let responseText = result.response.text().trim();
    
    // Clean response
    responseText = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
    responseText = responseText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    
    const validation = JSON.parse(responseText);
    return validation;
    
  } catch (error) {
    console.error('Error validating SDG-12 content:', error);
    // If validation fails, be conservative and reject
    return {
      isSDG12Relevant: false,
      relevanceScore: 0,
      reason: "Unable to validate content relevance to SDG-12",
      sdg12Aspects: []
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

    // STEP 1: Validate if content is SDG-12 relevant
    console.log('Validating SDG-12 relevance...');
    const validation = await validateSDG12Content(title, content);
    
    if (!validation.isSDG12Relevant || validation.relevanceScore < 60) {
      const error = new Error(`This content is not relevant to SDG-12 (Responsible Consumption and Production). Education Hub only covers sustainable consumption, eco-friendly products, circular economy, and responsible production. Reason: ${validation.reason}`);
      error.status = 400;
      error.code = 'NOT_SDG12_RELEVANT';
      throw error;
    }

    console.log(`✅ Content validated as SDG-12 relevant (Score: ${validation.relevanceScore}%)`);

    // STEP 2: Generate education guide (only for validated content)
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert educator specializing EXCLUSIVELY in UN SDG-12 (Responsible Consumption and Production). This content has been pre-validated as SDG-12 relevant.

Validated Content:
Title: "${title}"
Content: "${content}"
SDG-12 Aspects Found: ${validation.sdg12Aspects.join(', ')}

STRICT SDG-12 FOCUS AREAS ONLY:
- Responsible consumption patterns and consumer choices
- Sustainable production practices and manufacturing
- Circular economy principles (reduce, reuse, recycle)
- Eco-friendly product lifecycle and materials
- Resource efficiency and waste minimization
- Sustainable supply chain management
- Environmental footprint reduction
- Green purchasing and procurement

Create STRICTLY SDG-12 focused educational content. Reject any deviation from these themes. Return ONLY valid JSON:

{
  "summary": "2-3 sentences connecting this topic directly to SDG-12 responsible consumption and production goals",
  "keyPoints": [
    "SDG-12 responsible consumption principle from this content",
    "Sustainable production practice or circular economy aspect",
    "Eco-friendly product selection or lifecycle consideration",
    "Resource efficiency or waste reduction strategy",
    "Consumer behavior change for sustainable consumption"
  ],
  "quiz": [
    {
      "question": "According to SDG-12 principles, what is the most important factor when choosing eco-friendly products?",
      "options": ["Lowest price available", "Product lifecycle and environmental impact", "Brand popularity", "Packaging design"],
      "correctAnswer": 1,
      "explanation": "SDG-12 emphasizes considering the entire lifecycle and environmental impact of products to ensure responsible consumption and production patterns."
    },
    {
      "question": "How does choosing eco-friendly products contribute to ecosystem health?",
      "options": ["It has no real impact", "It reduces pollution and resource depletion", "It only benefits manufacturers", "It's just a marketing trend"],
      "correctAnswer": 1,
      "explanation": "Eco-friendly products typically use sustainable materials, generate less pollution, and require fewer natural resources, directly benefiting ecosystem health and biodiversity."
    },
    {
      "question": "What circular economy principle best supports SDG-12 goals?",
      "options": ["Buy new products frequently", "Reduce, Reuse, Recycle approach", "Focus only on recycling", "Ignore product lifespan"],
      "correctAnswer": 1,
      "explanation": "The 3Rs (Reduce, Reuse, Recycle) embody circular economy principles by minimizing waste, extending product life, and keeping materials in productive use, aligning with SDG-12's sustainable consumption goals."
    }
  ],
  "glossary": [
    { "term": "SDG-12", "definition": "UN Sustainable Development Goal 12: Responsible Consumption and Production - aims to ensure sustainable consumption and production patterns worldwide" },
    { "term": "Circular Economy", "definition": "An economic model that eliminates waste by keeping products and materials in use for as long as possible through reuse, sharing, repair, and recycling" },
    { "term": "Life Cycle Assessment (LCA)", "definition": "A method to evaluate the environmental impacts of a product throughout its entire life cycle, from raw material extraction to disposal" },
    { "term": "Eco-footprint", "definition": "The measure of human demand on Earth's ecosystems, representing the amount of biologically productive land and sea area needed to sustain consumption" }
  ],
  "actionableTips": [
    "Look for eco-labels and certifications when shopping (Energy Star, EPEAT, Forest Stewardship Council)",
    "Choose products with minimal, recyclable, or biodegradable packaging",
    "Prioritize durability and repairability over disposable alternatives",
    "Support companies with transparent sustainability reporting and circular business models",
    "Calculate your consumption footprint and set reduction goals aligned with SDG-12 targets"
  ],
  "sdg12Connection": "Explains how this topic directly supports SDG-12 targets of sustainable consumption patterns, responsible production practices, and ecosystem protection"
}

Requirements:
- summary: Must connect to SDG-12 and responsible consumption ONLY
- keyPoints: Focus STRICTLY on SDG-12 practical knowledge
- quiz: Educational questions ONLY about SDG-12 consumption and production
- glossary: Include SDG-12 and related sustainability terms ONLY
- actionableTips: 5 practical SDG-12 aligned actions users can take
- sdg12Connection: Clear link to specific SDG-12 targets and objectives
- REJECT any content not directly related to responsible consumption and production
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
  const requiredFields = ['summary', 'keyPoints', 'quiz', 'glossary', 'actionableTips', 'sdg12Connection'];
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

  // Validate sdg12Connection
  if (typeof guide.sdg12Connection !== 'string' || guide.sdg12Connection.trim().length === 0) {
    return 'sdg12Connection must be a non-empty string';
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