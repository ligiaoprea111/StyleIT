import bcrypt from "bcryptjs";
import User from "../models/user.js"; 

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Salvează parola criptată anterior
      role
    });

    res.status(201).json(newUser); // Trimite utilizatorul creat ca răspuns
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};
