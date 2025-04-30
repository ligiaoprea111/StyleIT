import express from "express";
import { getProfile, createProfile, updateProfile } from "../controllers/profile-controller.js";

const router = express.Router();

// GET profilul unui utilizator
router.get("/profile/:userId", getProfile);

// POST crează un profil
router.post("/profile", createProfile);

// PUT actualizează un profil
router.put("/profile/:userId", updateProfile);

export default router;
