import React, { useState } from "react";
import LoginForm from "../LoginForm/LoginForm"; // Importă componenta LoginForm pentru formularul de login
import './HomePage.css'; // Asigură-te că ai stilurile pentru această pagină

const HomePage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State pentru a controla vizibilitatea modalului

  const openLoginModal = () => {
    setIsLoginModalOpen(true); // Deschide modalul
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false); // Închide modalul
  };

  return (
    <div className="homepage-container">
      <div className="background-image">
        <div className="content">
          <div className="buttons">
            <button className="sign-in-button" type="submit" onClick={openLoginModal}>Sign In</button>
            <button className="sign-up-button" type="submit">Sign Up</button> {/* Adaugă funcționalitate pentru acest buton dacă vrei */}
          </div>
        </div>
      </div>

      {/* Modalul de login */}
      {isLoginModalOpen && (
        <div className="modal">
          <div className="modal-overlay" onClick={closeLoginModal}></div>
          <div className="modal-content">
            <LoginForm closeModal={closeLoginModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
