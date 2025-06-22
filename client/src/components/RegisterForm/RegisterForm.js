import React, { useState } from "react";
import axios from "axios";
import './RegisterForm.css';

const RegisterForm = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setSuccessMessage("");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password
      });
      setSuccessMessage("Registration successful! You can now sign in.");
      setError("");
      setTimeout(() => {
        closeModal();
      }, 2500);
    } catch (err) {
      setError("Email is already in use or another error occurred.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="register-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="button-container">
          <button type="submit" className="sign-in-button">Sign Up</button>
          <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
