import express from "express";
import { getClothingItemsByUser } from "../controllers/clothing-controller.js";

const router = express.Router();

router.get("/clothing-items", getClothingItemsByUser);

export default router;
