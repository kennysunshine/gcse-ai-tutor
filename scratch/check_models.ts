import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

async function listModels() {
  try {
    // Note: The SDK doesn't have a direct listModels, we usually check documentation 
    // or try common names. But let's verify connectivity.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash");
  } catch (e: any) {
    console.error("Failed with gemini-1.5-flash:", e.message);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent("test");
      console.log("Success with gemini-2.0-flash");
    } catch (e2: any) {
      console.error("Failed with gemini-2.0-flash:", e2.message);
    }
  }
}

listModels();
