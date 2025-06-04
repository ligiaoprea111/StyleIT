import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();  // pentru a încărca variabilele din .env

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Preia tokenul

  console.log(process.env.JWT_SECRET);  // Verifică valoarea secretului
  console.log("Token Type:", token);  // Verifică token-ul generat

  if (!token) {
    return res.status(403).json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      console.log("JWT Error:", err); // Afișează eroarea completă
      return res.status(401).json({ message: "Unauthorized!" });
    }

    console.log("Decoded JWT:", decoded); // Verifică ce conține token-ul
    req.user = decoded; // Asigură-te că req.user este corect

    // Verifică că decoded conține 'userId'
    if (!req.user.userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    next();  // Continuă la următorul middleware sau controller
  });
};

export default verifyToken;
