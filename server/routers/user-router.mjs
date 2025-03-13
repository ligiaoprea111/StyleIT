import express from "express";
import { getUsers, createUser } from "../controllers/user-controller.mjs";  // Asigură-te că ai importat corect
import { loginUser } from "../controllers/auth-controller.mjs";  // Importă loginUser din auth-controller.mjs

const router = express.Router();

// Ruta pentru obținerea utilizatorilor
router.get("/", getUsers);

// Ruta pentru crearea unui utilizator
router.post("/", createUser);

// Ruta pentru autentificare
router.post("/login", loginUser);

export default router;
