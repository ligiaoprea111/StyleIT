import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user-router.mjs";  // Asigură-te că ai importat corect router-ul

console.log("User router loaded:", userRouter); // Verifică dacă router-ul este importat corect

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);  // Folosește router-ul pentru /api/users

app.get("/", (req, res) => {
  res.send("Serverul rulează!");
});

app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
