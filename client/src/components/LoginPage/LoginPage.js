import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // pentru navigare

import './LoginPage.css'; // Importă stilurile

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // pentru navigare după logare

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Dacă login-ul este corect, salvează token-ul și navighează
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard"); // Schimbă pagina după logare (sau alta pagină protejată)
    } catch (err) {
      setError("Email sau parolă incorecte");
    }
  };

  return (
    <div className="login-container">
      <h2>Conectare</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Parolă:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Conectare</button>
      </form>
    </div>
  );
};

export default LoginPage;
