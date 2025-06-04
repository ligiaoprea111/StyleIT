import express from "express";
import { getClothingItemsByUser, createClothingItem, generateOutfit } from "../controllers/clothing-controller.js";

const router = express.Router();

router.get("/clothing-items", getClothingItemsByUser);
router.post("/wardrobe", createClothingItem);
router.post("/generate-outfit", generateOutfit);

export default router;
