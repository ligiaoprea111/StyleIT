import db from "../models/index.js";
const { Profile } = db;

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
  const { description, profilePicture, location, birthday } = req.body;

  try {
    let profile = await Profile.findOne({ where: { userId: parseInt(userId) } });

    // Dacă nu există, creează-l
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

    // Altfel, îl actualizezi
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

