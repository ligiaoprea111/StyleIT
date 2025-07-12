import bcrypt from "bcryptjs";
import db from "../models/index.js";
const { User } = db;

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

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error('Eroare la updateUser:', error);
    res.status(500).json({ message: "Error updating user", error });
  }
};
