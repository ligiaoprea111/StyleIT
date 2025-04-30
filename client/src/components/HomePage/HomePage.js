import React, { useState, useEffect } from "react";
import LoginForm from "../LoginForm/LoginForm"; // Importă componenta LoginForm pentru formularul de login
import RegisterForm from "../RegisterForm/RegisterForm"; // Importă formularul de înregistrare
import './HomePage.css'; // Asigură-te că ai stilurile pentru această pagină


const HomePage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State pentru a controla vizibilitatea modalului
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State pentru a controla vizibilitatea modalului de register

  const openLoginModal = () => {
    console.log("Login!");
    setIsLoginModalOpen(true);
    //console.log(isLoginModalOpen); // Deschide modalul
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
   // console.log(isLoginModalOpen); // Închide modalul
  };

  const openRegisterModal = () => {
    console.log("Sign up!");
    setIsRegisterModalOpen(true); // Deschide modalul de register
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false); // Închide modalul de register
  };

  // useEffect pentru a urmări modificarea stării modalului
  useEffect(() => {
    console.log("isLoginModalOpen:", isLoginModalOpen); // Verifică starea actuală a modalului
  }, [isLoginModalOpen]); // Aceasta se va apela de fiecare dată când se schimbă valoarea isLoginModalOpen

  return (
    <div className="homepage-container">
      <div className="background-image">
        <div className="content">
          <div className="buttons">
            <button className="sign-in-button" type="submit" onClick={openLoginModal}>Sign In</button>
            <button className="sign-up-button" type="submit"onClick={openRegisterModal}>Sign Up</button> {/* Adaugă funcționalitate pentru acest buton dacă vrei */}
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

      {/* Modalul de register */}
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
