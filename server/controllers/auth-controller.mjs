import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.mjs";  // Importă modelul User

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

    // Trimite token-ul ca răspuns
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
