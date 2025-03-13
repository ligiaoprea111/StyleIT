import express from "express";
import { loginUser } from "../controllers/auth-controller.mjs";  // Importă funcția de login din controller

const router = express.Router();

// Ruta pentru autentificare
router.post("/login", loginUser);

export default router;
