import GeminiService from '../services/geminiService.js';

class GeminiController {
    // Generate text response
    static async generateText(req, res) {
        try {
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({ error: 'Prompt is required' });
            }

            const response = await GeminiService.generateText(prompt);
            res.json({ response });
        } catch (error) {
            console.error('Error in generateText controller:', error);
            res.status(500).json({ error: 'Failed to generate text' });
        }
    }

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
            if (!question) {
                return res.status(400).json({ error: 'Question is required' });
            }

            const advice = await GeminiService.generateStyleAdvice(question);
            res.json({ advice });
        } catch (error) {
            console.error('Error in generateStyleAdvice controller:', error);
            res.status(500).json({ error: 'Failed to generate style advice' });
        }
    }
}

export default GeminiController; 