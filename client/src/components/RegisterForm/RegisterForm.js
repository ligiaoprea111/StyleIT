import React, { useState } from "react";
import axios from "axios";
import './RegisterForm.css';

const RegisterForm = ({ closeModal }) => {
  const [name, setName] = useState(""); // Pentru numele utilizatorului
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("fashion_explorer"); // Setează rolul implicit
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State pentru mesajul de succes

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Parolele nu corespund!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      // Setează mesajul de succes
      setSuccessMessage("Inregistrare efectuata cu succes!");
      setError(""); // Resetează eroarea, dacă există
      // Poți închide modalul după succes, dacă vrei
      setTimeout(() => {
        closeModal();
      }, 3000); // Închide modalul după 3 secunde (timp pentru a vedea mesajul)
    } catch (err) {
      setError("Email-ul este deja folosit sau altă eroare");
      setSuccessMessage(""); // Resetează mesajul de succes în caz de eroare
    }
  };

  return (
    <div className="register-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Câmpul pentru rolul utilizatorului */}
        <div>
          <label className="label">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="fashion_explorer">Fashion Explorer</option>
            <option value="fashion_advisor">Fashion Advisor</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Afișează mesajul de succes */}
        <button type="submit" className="sign-up-button">Sign Up</button>
      </form>
      <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
    </div>
  );
};

export default RegisterForm;
