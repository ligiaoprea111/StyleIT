import GeminiService from '../services/geminiService.js';
import db from '../models/index.js';

class GeminiController {
    // Generate outfit recommendation
    static async generateOutfitRecommendation(req, res) {
        try {
            const { occasion, style, weather } = req.body;
            
            if (!occasion || !style || !weather) {
                return res.status(400).json({ 
                    error: 'Occasion, style, and weather are required' 
                });
            }

            const recommendation = await GeminiService.generateOutfitRecommendation(
                occasion,
                style,
                weather
            );
            
            res.json({ recommendation });
        } catch (error) {
            console.error('Error in generateOutfitRecommendation controller:', error);
            res.status(500).json({ error: 'Failed to generate outfit recommendation' });
        }
    }

    // Generate style advice
    static async generateStyleAdvice(req, res) {
        try {
            const { question } = req.body;
            const userId = req.user.userId; // Get userId from authenticated user

            if (!question) {
                return res.status(400).json({ error: 'Question is required' });
            }

            // Fetch user's wardrobe
            const wardrobe = await db.ClothingItem.findAll({ where: { userId } });
            const wardrobeList = wardrobe.map(item =>
                `- ${item.name} (${item.category}${item.subCategory ? ", " + item.subCategory : ""}, color: ${item.color || "unknown"}, material: ${item.material || "unknown"}, season: ${item.season || "unknown"}, tags: ${item.tags || "none"})`
            ).join("\n");

            // TODO: Fetch user preferences if you have a preferences model
            const userPreferences = "No specific style preferences provided yet."; // Replace with actual fetch

            const prompt = `As a fashion expert, please provide advice on the following question, addressing the user directly using "you": ${question}

Consider your wardrobe:
${wardrobeList}

And your style preferences:
${userPreferences}

Provide practical tips and explain why your suggestions would work well, referencing items from your wardrobe where relevant. If recommending new items, suggest types of clothing or styles, but do not invent specific item names or image URLs.`;

            const advice = await GeminiService.generateText(prompt);
            res.json({ advice });
        } catch (error) {
            console.error('Error in generateStyleAdvice controller:', error);
            res.status(500).json({ error: 'Failed to generate style advice' });
        }
    }
}

export default GeminiController; 