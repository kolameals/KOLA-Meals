import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGemini() {
  try {
    console.log("Testing Gemini API...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Explain how AI works in a few words",
    });

    console.log("\nGemini Response:");
    console.log(response.text);
    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("\nError testing Gemini:", error);
  }
}

// Run the test
testGemini(); 