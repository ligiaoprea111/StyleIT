
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
      dislikes,
      sex_gender, // <-- adaugă sex_gender la salvare
      inspirations,
      height,
      weight
    } = req.body;

    // Convert arrays to comma-separated strings for DB
    const toStringOrNull = v => Array.isArray(v) ? v.join(',') : (v || null);
    const dataToSave = {
      style_preference: toStringOrNull(style_preference),
      favorite_colors: toStringOrNull(favorite_colors),
      avoided_colors: toStringOrNull(avoided_colors),
      outfit_feel: toStringOrNull(outfit_feel),
      frequent_events: toStringOrNull(frequent_events),
      preferred_accessories: toStringOrNull(preferred_accessories),
      body_shape,
      favorite_items: toStringOrNull(favorite_items),
      preferred_materials: toStringOrNull(preferred_materials),
      dislikes: toStringOrNull(dislikes),
      sex_gender,
      inspirations,
      height,
      weight
    };

    let preferences = await StylePreference.findOne({ where: { id_user } });
    if (preferences) {
      await preferences.update(dataToSave);
      res.json(preferences);
    } else {
      preferences = await StylePreference.create({
        id_user,
        ...dataToSave
      });
    res.status(201).json(preferences);
    }
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Server error while saving preferences." });
  }
};
