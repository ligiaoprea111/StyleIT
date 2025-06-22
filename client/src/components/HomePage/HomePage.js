import React, { useState } from 'react';
import './HomePage.css';
import RegisterForm from '../RegisterForm/RegisterForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleHomepageLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      navigate("/dashboard");
    } catch (err) {
      setLoginError("Incorrect email or password");
    }
  };

  return (
    <div className="homepage-bg">
      <div className="glass-card single">
        <div className="glass-left full">
          <div className="glass-title gradient-text">StyleIT</div>
          <div className="glass-subtext" style={{ color: '#e80459', fontWeight: 700, fontSize: 20, marginBottom: 32 }}>
            Your interactive digital wardrobe
          </div>
          <form className="glass-form" onSubmit={handleHomepageLogin}>
            <label htmlFor="username">Email</label>
            <input id="username" type="email" placeholder="Email" required autoComplete="username" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Password" required autoComplete="current-password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            {loginError && <div className="error-message" style={{marginBottom:8}}>{loginError}</div>}
            <button type="submit">Sign In</button>
          </form>
          <div className="glass-subtext">
            Don't have an account?{' '}
            <span style={{ color: '#e80459', cursor: 'pointer', fontWeight: 600 }} onClick={openRegisterModal}>
              Create account
            </span>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="register-modal">
          <div className="modal-overlay" onClick={closeRegisterModal}></div>
          <div className="modal-content">
            <RegisterForm closeModal={closeRegisterModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
