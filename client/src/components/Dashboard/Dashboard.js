import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logoGood from '../../assets/images/logoGood.png';
import article1 from '../../assets/images/article1.jpg';
import article2 from '../../assets/images/article2.jpg';
import article3 from '../../assets/images/article3.jpg';
import article4 from '../../assets/images/article4.jpg';
import article5 from '../../assets/images/article5.jpg';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const handleGoToProfile = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      console.error("User is not logged in");
    }
  };  
  
  const handleGoToWardrobe = () => {
    navigate("/wardrobe");
  };
  
  // Obține prognoza meteo
  useEffect(() => {
    const getWeather = async () => {
      try {
        // 1. Obține locația utilizatorului
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
    
          // 2. Apelează OpenWeatherMap cu coordonatele
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=727eb2aa28801b429db6e543a3479fbc`
          );
    
          const dailyForecast = response.data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
          );
    
          setWeather({
            city: response.data.city,
            forecast: dailyForecast
          });
        }, 
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback: dacă nu permite accesul la locație → folosim Bucharest
          fallbackToBucharest();
        });
      } catch (error) {
        console.error("Eroare la preluarea vremii:", error);
      }
    };
    
    const fallbackToBucharest = async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Bucharest&appid=727eb2aa28801b429db6e543a3479fbc`
      );
      const dailyForecast = response.data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      );
      setWeather({
        city: response.data.city,
        forecast: dailyForecast
      });
    };
    
  
    getWeather();
  }, []);
  

  // Obține articolele despre modă
  useEffect(() => {
    const getArticles = async () => {
      setArticles([
        {
          title: "Top 5 trends for spring 2025",
          description: "Discover which clothing pieces will dominate the warm season.",
          link: "#",
          image: article1
        },
        {
          title: "How to create an elegant summer look",
          description: "Simple tricks for a light and sophisticated style.",
          link: "#",
          image: article2
        },
        {
          title: "Pastel colors are making a comeback",
          description: "Learn how to integrate them into your everyday outfits.",
          link: "#",
          image: article3
        },
        {
          title: "How to accessorize an evening outfit",
          description: "The right accessories can completely transform an outfit.",
          link: "#",
          image: article4
        },
        {
          title: "Comfy outfits for work-from-home",
          description: "Style and comfort even on Zoom meeting days.",
          link: "#",
          image: article5
        }        
      ]);
    };
    getArticles();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Bara de sus */}
      <header className="header">
  <div className="header-left">
  <Link to="/dashboard">
  <img src={logoGood} alt="styleIT logo" className="logo" />
</Link>
  </div>
  <div className="header-right">
  <button className="header-link" onClick={handleGoToProfile}>
  <i className="bi bi-person"></i> My Profile
</button>
<button className="header-link" onClick={handleGoToWardrobe}>
  <i className="bi bi-bag"></i> My Wardrobe
</button>

  </div>
</header>


      {/* Secțiunea meteo */}
      <section className="weather">
  <h3>You might want to take weather into account when planning your outfits</h3>
  {weather ? (
    <div className="weather-widget">
      {weather.forecast.map((item, index) => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString("en-US", { weekday: "short" }); // ex: Mon, Tue
        const icon = item.weather[0].icon; // ex: "04d"
        const temp = Math.round(item.main.temp - 273.15); // Celsius

        return (
          <div className="weather-day" key={index}>
            <div className="day">{day}</div>
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={item.weather[0].description}
            />
            <div className="temp">{temp}°C</div>
          </div>
        );
      })}
    </div>
  ) : (
    <p>Loading weather...</p>
  )}
</section>
<section className="fashion-articles">
  <h3>New in Fashion</h3>
  <div className="articles-grid">
    {articles.map((article, index) => (
      <div className="article-card" key={index}>
        <img src={article.image} alt={article.title} />
        <div className="article-info">
          <a href={article.link}>{article.title}</a>
          <p className="article-desc">{article.description}</p>
        </div>
      </div>
    ))}
  </div>
</section>
<section className="outfit-planner">
  <h3>Plan your outfits</h3>
  <div className="calendar-grid">
  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // duminica = prima zi

    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + idx);

    const isToday = currentDate.toDateString() === today.toDateString();

    const formattedDate = currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <div className={`calendar-card ${isToday ? 'today' : ''}`} key={idx}>
        <div className="calendar-day">
          {day} {isToday && <span className="today-badge">Today</span>}
        </div>
        <div className="calendar-date">{formattedDate}</div>
        <button className="calendar-add">
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
    );
  })}
</div>

</section>

    </div>
  );
};

export default Dashboard;
