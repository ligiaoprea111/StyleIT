import db from "../models/index.js";

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
