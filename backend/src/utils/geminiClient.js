import { GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();   // Load environment variables

// // Initialize Gemini client with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Use the same model product is using - Updated model to working version
export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  model: "gemini-3-flash-preview", 
});

export default geminiModel;