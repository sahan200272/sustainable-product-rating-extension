import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSustainabilityData = async (product) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a sustainability evaluation expert.

  Product Name: ${product.name}
  Description: ${product.description}
  Materials: ${product.materials}

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

  return JSON.parse(response);
};