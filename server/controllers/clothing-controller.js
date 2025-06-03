import db from "../models/index.js";
import multer from "multer";
import path from "path";
import fs from "fs";

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
