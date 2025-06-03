import express from "express";
import { getClothingItemsByUser, createClothingItem } from "../controllers/clothing-controller.js";

const router = express.Router();

router.get("/clothing-items", getClothingItemsByUser);
router.post("/wardrobe", createClothingItem);

export default router;
