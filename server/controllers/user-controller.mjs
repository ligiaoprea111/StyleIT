import User from "../models/user.mjs";  // Asigură-te că importați modelul corect

// Funcție pentru a obține utilizatorii
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcție pentru a crea un utilizator
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await User.create({ name, email, password, role });
    res.status(201).json(newUser); // Returnează utilizatorul creat
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
