import React from "react";
import './HomePage.css';  // Vom adăuga stilurile în acest fișier CSS

const HomePage = () => {
  return (
    <div className="homepage-container">
      
      <div className="background-image">
        {/* Butoanele vor fi poziționate în această zonă */}
        <div className="buttons">
          <button className="sign-in">Sign In</button>
          <button className="sign-up">Sign Up</button>
        </div>
      </div>
    </div>
  );
};


export default HomePage;
