import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSustainabilityData = async (product) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
  You are a sustainability evaluation expert.

  Product Name: ${product.name}
  Description: ${product.description}

  1. Generate a professional sustainability explanation.
  2. Give a sustainability score from 0 to 100.
  3. Return response in JSON format like:

  {
    "analysis": "...",
    "score": 85
  }
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Remove markdown code fences if present
  const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return JSON.parse(cleanedResponse);
};