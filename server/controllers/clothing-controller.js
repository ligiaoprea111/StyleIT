import db from "../models/index.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import GeminiService from "../services/geminiService.js";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image');

export const getClothingItemsByUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }
    const items = await db.ClothingItem.findAll({ where: { userId } });
    res.json(items);
  } catch (error) {
    console.error("Error fetching clothing items:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createClothingItem = async (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ error: err.message });
    }

    try {
      const userId = req.body.userId || 1; // Default to user 1 if not provided
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;

      if (!imageUrl) {
        return res.status(400).json({ error: "Image is required" });
      }

      const clothingItem = await db.ClothingItem.create({
        userId,
        name: req.body.name,
        category: req.body.category,
        subCategory: req.body.subCategory,
        imageUrl,
        color: req.body.color,
        material: req.body.material,
        season: req.body.season,
        description: req.body.description,
        tags: req.body.tags,
        isUserUploaded: true,
        uploadDate: new Date()
      });

      res.status(201).json(clothingItem);
    } catch (error) {
      console.error("Error creating clothing item:", error);
      res.status(500).json({ error: "Failed to create clothing item" });
    }
  });
};

export const generateOutfit = async (req, res) => {
  try {
    const { userId, occasion, style, preferredColors, avoidItems, mustHave } = req.body;
    if (!userId || !occasion) {
      return res.status(400).json({ error: "Missing userId or occasion" });
    }

    // Fetch user's wardrobe
    const wardrobe = await db.ClothingItem.findAll({ where: { userId } });
    if (!wardrobe || wardrobe.length === 0) {
      return res.status(400).json({ error: "No wardrobe items found for user" });
    }

    // TODO: Fetch real weather data. For now, stub it.
    const weather = "20°C, sunny";

    // Filter wardrobe for relevance (e.g., by season, occasion, style, tags)
    let filteredWardrobe = wardrobe;
    // Simple filtering: if summer, exclude jackets/coats/sweaters
    if (occasion && occasion.toLowerCase().includes('summer')) {
      filteredWardrobe = filteredWardrobe.filter(item => {
        const lowerCat = (item.category || '').toLowerCase();
        const lowerSub = (item.subCategory || '').toLowerCase();
        return !(
          lowerCat.includes('jacket') ||
          lowerCat.includes('coat') ||
          lowerCat.includes('sweater') ||
          lowerSub.includes('jacket') ||
          lowerSub.includes('coat') ||
          lowerSub.includes('sweater')
        );
      });
    }
    // Optionally, filter by season field if present
    if (filteredWardrobe.length > 0 && filteredWardrobe[0].season) {
      filteredWardrobe = filteredWardrobe.filter(item => {
        if (!item.season) return true;
        if (occasion && occasion.toLowerCase().includes('summer')) {
          return item.season.toLowerCase().includes('summer');
        }
        if (occasion && occasion.toLowerCase().includes('winter')) {
          return item.season.toLowerCase().includes('winter');
        }
        return true;
      });
    }
    // Build prompt for Gemini with id and imageUrl
    const wardrobeList = filteredWardrobe.map(item =>
      `- id: ${item.id}, name: ${item.name}, category: ${item.category}${item.subCategory ? ", subCategory: " + item.subCategory : ""}, color: ${item.color || "unknown"}, material: ${item.material || "unknown"}, imageUrl: ${item.imageUrl || "none"}`
    ).join("\n");

    const prompt = `The user needs an outfit for: ${occasion}.
Weather: ${weather}.
Preferred style: ${style || "no preference"}.
Preferred colors: ${preferredColors || "no preference"}.
Items to avoid: ${avoidItems || "none"}.
Must-have item/type: ${mustHave || "none"}.

Here is the user's wardrobe. Each item has an id and imageUrl. Only select items from this list. Do NOT invent new items or images. Only use the provided imageUrl for each item. Do not use placeholder images. If the list is short, pick the best combination. If the list is long, pick the most relevant items for the occasion, weather, and preferences:
${wardrobeList}

Respond ONLY with valid JSON in this format:
{
  "items": [
    { "id": <id>, "name": <name>, "category": <category>, "subCategory": <subCategory>, "imageUrl": <imageUrl> },
    ...
  ],
  "explanation": "<why you chose these items>"
}`;

    const geminiResponse = await GeminiService.generateText(prompt);
    console.log('Gemini raw response:', geminiResponse);
    let parsed;
    try {
      parsed = JSON.parse(geminiResponse);
    } catch (e) {
      // fallback: try to extract JSON from Gemini response
      const match = geminiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (err) {
          console.error('Failed to parse extracted JSON:', match[0]);
          return res.status(500).json({ error: 'Failed to parse Gemini response as JSON', raw: geminiResponse });
        }
      } else {
        console.error('Failed to parse Gemini response:', geminiResponse);
        return res.status(500).json({ error: 'Failed to parse Gemini response as JSON', raw: geminiResponse });
      }
    }
    res.json(parsed);
  } catch (error) {
    console.error("Error generating outfit:", error);
    res.status(500).json({ error: "Failed to generate outfit" });
  }
};
