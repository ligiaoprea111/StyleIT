import React, { useState } from "react";
import axios from "axios";
import './LoginForm.css'; // Importă stilurile pentru formularul de login

const LoginForm = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Salvează token-ul și redirecționează utilizatorul (pentru exemplu, nu folosim aici navigare, o putem adăuga mai târziu)
      localStorage.setItem("token", response.data.token);
      closeModal(); // Închide modalul după ce utilizatorul s-a autentificat
    } catch (err) {
      setError("Email sau parolă incorecte");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
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
