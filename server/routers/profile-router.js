import express from "express";
import { getProfile, createProfile, updateProfile, uploadProfilePic } from "../controllers/profile-controller.js";

const router = express.Router();

// GET profilul unui utilizator
router.get("/profile/:userId", getProfile);

// POST crează un profil
router.post("/profile", createProfile);

// PUT actualizează un profil cu upload imagine
router.put("/profile/:userId", uploadProfilePic, updateProfile);

export default router;
