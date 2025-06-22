import db from "../models/index.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const { Profile } = db;

// Configurare multer pentru upload imagine profil
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'server', 'public', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadProfilePic = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('profilePicture');

// Obține un profil după userId
export const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Creează un profil nou
export const createProfile = async (req, res) => {
  const { userId, description, profilePicture, location, birthday } = req.body;
  try {
    const newProfile = await Profile.create({ userId, description, profilePicture, location, birthday });
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: "Failed to create profile", error });
  }
};

// Actualizează un profil existent
export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  let { description, profilePicture, location, birthday } = req.body;

  // Dacă există fișier uploadat, folosește calea lui
  if (req.file) {
    profilePicture = `/images/${req.file.filename}`;
  }

  try {
    let profile = await Profile.findOne({ where: { userId: parseInt(userId) } });

    if (!profile) {
      profile = await Profile.create({
        userId: parseInt(userId),
        description,
        profilePicture,
        location,
        birthday
      });
      return res.status(201).json(profile);
    }

    profile.description = description;
    profile.profilePicture = profilePicture;
    profile.location = location;
    profile.birthday = birthday;

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

