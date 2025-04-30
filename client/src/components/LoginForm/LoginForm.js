import React, { useState } from "react";
import axios from "axios";
import './LoginForm.css'; // Importă stilurile pentru formularul de login
import { useNavigate } from "react-router-dom";

const LoginForm = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Verifică ce primești în răspuns
    console.log("Token received:", response.data.token);

      // Salvează token-ul și redirecționează utilizatorul (pentru exemplu, nu folosim aici navigare, o putem adăuga mai târziu)
      await localStorage.setItem("token", response.data.token);
      //closeModal(); // Închide modalul după ce utilizatorul s-a autentificat
     // navigate("/dashboard"); // Redirecționează utilizatorul la dashboard
     setTimeout(() => {
      closeModal(); // Închide modalul după un mic delay
      navigate("/dashboard"); // Redirecționează utilizatorul la dashboard
    }, 500); // Întârziere de 500 ms pentru a permite UI-ului să proceseze acțiunile
    } catch (err) {
      setError("Email sau parolă incorecte");
    }
  };

  return (
    <div className="login-form">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-container">
          <button type="submit" className="sign-in-button">Sign In</button>
          <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
