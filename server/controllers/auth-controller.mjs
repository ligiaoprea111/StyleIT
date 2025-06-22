import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
const { User, Profile } = db;

export const loginUser = async (req, res) => { // Funcție pentru autentificare
  const { email, password } = req.body;

  try {     // Verifică dacă utilizatorul există
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);  // Compară parola introdusă cu parola criptată din baza de date

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(  // Generează un token JWT
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET, // Cheia secretă pentru token
      { expiresIn: '1h' } // Expiră după 1 oră
    );

    // Trimite token-ul ca răspuns
    res.json({ token, userId: user.id  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Funcție pentru înregistrare
export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Verifică dacă utilizatorul există deja
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Criptarea parolei
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crearea unui nou utilizator
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    
    // Crearea unui profil gol pentru noul utilizator
    await Profile.create({
      userId: newUser.id,
    });

    // Răspuns la cererea de înregistrare
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
