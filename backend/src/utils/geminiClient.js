import { GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Use the same model product is using
export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", 
});

export default geminiModel;