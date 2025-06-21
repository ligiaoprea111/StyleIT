import express from "express";
import { getUsers, createUser } from "../controllers/user-controller.mjs";  
import { loginUser } from "../controllers/auth-controller.mjs"; 
import db from "../models/index.js";

const router = express.Router();
const { User } = db;

// Ruta pentru obținerea utilizatorilor
router.get("/", getUsers);

// Ruta pentru crearea unui utilizator
router.post("/", createUser);

// Ruta pentru autentificare
router.post("/login", loginUser);

// GET user by ID
router.get("/:id", async (req, res) => {
    try {

        console.log("GET /api/users/:id - primit cu ID =", req.params.id);
        console.log("User model definit?", typeof User);
      const user = await User.findByPk(req.params.id, {
        attributes: ["id", "name", "email"] 
      });
  
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  });

export default router;
