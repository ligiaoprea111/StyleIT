import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user-router.mjs";  //rutele pentru utilizatori
import authRouter from "./routers/auth-router.mjs";  // Rutele pentru autentificare
import stylePrefRoutes from './routers/stylepreferences-router.js';

console.log("User router loaded:", userRouter); // Verifică dacă router-ul este importat corect

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);  // Rutele pentru utilizatori
app.use("/api/auth", authRouter);  // Rutele pentru autentificare
app.use('/api', stylePrefRoutes);

app.get("/", (req, res) => {
  res.send("Serverul rulează!");
});

app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
