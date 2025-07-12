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

    // Filter fashion articles using Gemini
    static async filterFashionArticles(articles) {
        try {
            const articlesText = articles.map((article, index) => 
                `${index + 1}. Title: ${article.title}
                 Description: ${article.description}
                 URL: ${article.url}
                 Source: ${article.source?.name || 'Unknown'}`
            ).join('\n\n');

            const prompt = `You are a fashion expert. I will provide you with a list of articles, and you need to filter and return only the ones that are truly about fashion trends, style, runway shows, fashion industry news, or clothing design.\n\nIMPORTANT CRITERIA:\n- INCLUDE: Fashion trends, style tips, runway shows, fashion industry news, clothing design, fashion technology, sustainable fashion\n- EXCLUDE: Celebrity gossip, personal life news, non-fashion related content, entertainment news that's not fashion-focused\n\nPlease analyze these articles and return ONLY the relevant fashion articles (maximum 4) in this exact JSON format (do NOT use code block markers or markdown, just pure JSON!):\n[\n  {\n    "title": "Article Title",\n    "description": "Article description",\n    "url": "Article URL",\n    "source": "Source name"\n  }\n]\n\nIf no articles are fashion-related, return an empty array [].\n\nArticles to analyze:\n${articlesText}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            // Remove code block delimiters if present
            text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            
            // Try to parse the JSON response
            try {
                const filteredArticles = JSON.parse(text);
                return Array.isArray(filteredArticles) ? filteredArticles : [];
            } catch (parseError) {
                console.error('Error parsing Gemini response:', parseError);
                console.log('Raw response:', text);
                return [];
            }
        } catch (error) {
            console.error('Error filtering fashion articles:', error);
            throw error;
        }
    }
}

export default GeminiService; 