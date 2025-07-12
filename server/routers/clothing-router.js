import express from "express";
import { getClothingItemsByUser, createClothingItem, generateOutfit, deleteClothingItem, updateClothingItem } from "../controllers/clothing-controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/clothing-items", getClothingItemsByUser);
router.post("/wardrobe", createClothingItem);
router.post("/generate-outfit", generateOutfit);

// New: delete and update clothing item
router.delete("/clothing-items/:id", verifyToken, deleteClothingItem);
router.put("/clothing-items/:id", verifyToken, updateClothingItem);

export default router;
