import { describe, it, expect } from '@jest/globals';
import { GeminiService } from '../services/gemini.service.js';

describe('GeminiService', () => {
  it('should generate content successfully', async () => {
    const testPrompt = "Write a short poem about programming.";
    
    try {
      const result = await GeminiService.generateRecipe(testPrompt);
      
      // Basic validation
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.name).toBeDefined();
      
      console.log('Generated recipe:', result);
    } catch (error) {
      console.error('Test failed with error:', error);
      throw error;
    }
  }, 30000); // Increased timeout for API call
}); 