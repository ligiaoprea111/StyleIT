import express from "express";
import { loginUser, registerUser } from "../controllers/auth-controller.mjs"; // Importă funcția de login și de înregistrare din controller

const router = express.Router();

// Ruta pentru autentificare
router.post("/login", loginUser);

// Ruta pentru înregistrare
router.post("/register", registerUser); // Adăugăm ruta de înregistrare

export default router;
