import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/index.js"; // 👈 import pentru sequelize + modele
import userRouter from "./routers/user-router.mjs";
import authRouter from "./routers/auth-router.mjs";
import stylePrefRoutes from "./routers/stylepreferences-router.js";
import profileRouter from "./routers/profile-router.js";
import clothingRouter from "./routers/clothing-router.js";


console.log("User router loaded:", userRouter);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api", stylePrefRoutes);
app.use("/api", profileRouter);
app.use("/api", clothingRouter);


app.get("/", (req, res) => {
  res.send("Serverul rulează!");
});

// 👇 pornim serverul după ce sincronizăm baza de date
const startServer = async () => {
  try {
    await db.sequelize.sync({ alter: true }); // creează tabela Profile dacă nu există
    app.listen(PORT, () => {
      console.log(`Serverul rulează pe portul ${PORT}`);
    });
  } catch (error) {
    console.error("Eroare la pornirea serverului:", error);
  }
};

startServer();
