
import db from '../models/index.js';
const { StylePreference } = db;

export const savePreferences = async (req, res) => {
  try {
    const id_user = req.user.userId;
    console.log("User ID:", req.user.userId);  // Adaugă un log pentru a verifica id-ul utilizatorului

    const {
      style_preference,
      favorite_colors,
      avoided_colors,
      outfit_feel,
      frequent_events,
      preferred_accessories,
      body_shape,
      favorite_items,
      preferred_materials,
      avoided_outfits
    } = req.body;

    const preferences = await StylePreference.create({
      id_user,
      style_preference,
      favorite_colors,
      avoided_colors,
      outfit_feel,
      frequent_events,
      preferred_accessories,
      body_shape,
      favorite_items,
      preferred_materials,
      avoided_outfits
    });

    res.status(201).json(preferences);
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Server error while saving preferences." });
  }
};
