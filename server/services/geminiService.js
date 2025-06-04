import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model - using gemini-1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class GeminiService {
    // Generate text response
    static async generateText(prompt) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating text:', error);
            throw error;
        }
    }

    // Generate outfit recommendations
    static async generateOutfitRecommendation(occasion, style, weather) {
        try {
            const prompt = `Given the following parameters, suggest a complete outfit:
            - Occasion: ${occasion}
            - Style: ${style}
            - Weather: ${weather}
            
            Please provide a detailed outfit recommendation including:
            1. Main clothing items
            2. Accessories
            3. Footwear
            4. Brief explanation of why these items work well together`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating outfit recommendation:', error);
            throw error;
        }
    }

    // Generate style advice
    static async generateStyleAdvice(question) {
        try {
            const prompt = `As a fashion expert, please provide advice on the following: ${question}
            Include practical tips and explain why your suggestions would work well.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating style advice:', error);
            throw error;
        }
    }
}

export default GeminiService; 