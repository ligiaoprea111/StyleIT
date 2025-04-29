import express from 'express';
import { savePreferences } from '../controllers/stylepref-controller.js';
import verifyToken from '../middleware/verifyToken.js';
import db from '../models/index.js'; // Importă obiectul db care conține toate modelele

const router = express.Router();

// POST pentru adăugarea preferințelor
router.post('/style-preferences', verifyToken, savePreferences);

// GET pentru obținerea preferințelor
router.get('/style-preferences', verifyToken, async (req, res) => {
  try {
    // Folosește db.StylePreference pentru a accesa modelul
    const preferences = await db.StylePreference.findOne({
      where: { id_user: req.user.userId }  // Găsește preferințele pentru utilizatorul logat
    });

    if (preferences) {
      res.json(preferences);  // Returnează preferințele găsite
    } else {
      res.status(404).json({ message: "No preferences found." });
    }
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Server error while fetching preferences." });
  }
});

export default router;
