import express from "express";
import { getUsers, createUser } from "../controllers/user-controller.mjs";  // Asigură-te că ai importat corect

const router = express.Router();

// Ruta pentru obținerea utilizatorilor
router.get("/", getUsers);

// Ruta pentru crearea unui utilizator
router.post("/", createUser);

export default router;
