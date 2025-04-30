import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Importă modelul User

// Funcție pentru autentificare
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifică dacă utilizatorul există
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compară parola introdusă cu parola criptată din baza de date
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generează un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY, // Cheia secretă pentru token
      { expiresIn: '1h' } // Expiră după 1 oră
    );

    // token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h' });
//console.log("Generated JWT Token:", token);


    // Trimite token-ul ca răspuns
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Funcție pentru înregistrare
export const registerUser = async (req, res) => {
  const { email, password, role, name } = req.body;

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
      role,  // rolul utilizatorului (ex. 'user', 'admin', 'fashion_advisor')
      name,  // numele utilizatorului
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
