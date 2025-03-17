import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import logo from '../../assets/images/logo.png'; // Asigură-te că ai logo-ul în directorul corespunzător

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [articles, setArticles] = useState([]);
  
  // Obține prognoza meteo
  useEffect(() => {
    const getWeather = async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Bucharest&appid=727eb2aa28801b429db6e543a3479fbc`
      );
      setWeather(response.data);
    };
    getWeather();
  }, []);

  // Obține articolele despre modă
  useEffect(() => {
    const getArticles = async () => {
      setArticles([
        { title: "Top 5 tendințe pentru primăvara 2025", link: "#" },
        { title: "Cum să îți creezi un look de vară elegant", link: "#" },
      ]);
    };
    getArticles();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Bara de sus */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <div className="welcome-message">
            Hello, user! Welcome to styleIT, your digital wardrobe!
          </div>
        </div>
      </header>

      {/* Meniul lateral */}
      <aside className="sidebar">
        <div className="icon-container">
          <div className="icon">👤</div>
          <span>My Profile</span>
        </div>
        <div className="icon-container">
          <div className="icon">👚</div>
          <span>My Wardrobe</span>
        </div>
      </aside>

      {/* Secțiunea meteo */}
      <section className="weather">
        <h3>You might want to take weather into account when planning your outfits</h3>
        {weather ? (
          <p>Weather in Bucuresti: {weather.list[0].weather[0].description}</p>
        ) : (
          <p>Loading weather...</p>
        )}
      </section>

      {/* Secțiunea articole de modă */}
      <section className="fashion-articles">
        <h3>New in Fashion</h3>
        <ul>
          {articles.map((article, index) => (
            <li key={index}><a href={article.link}>{article.title}</a></li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
