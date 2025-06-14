import { GeminiService } from './services/gemini.service';

async function main() {
  const prompt = "Create a simple pasta recipe";
  try {
    const result = await GeminiService.generateRecipe(prompt);
    console.log('Generated recipe:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 