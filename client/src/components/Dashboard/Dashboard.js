import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTshirt, FaShoppingBag, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';
import Layout from '../Layout/Layout';
import article1 from '../../assets/images/article1.jpg';
import article2 from '../../assets/images/article2.jpg';
import article3 from '../../assets/images/article3.jpg';
import article4 from '../../assets/images/article4.jpg';
import article5 from '../../assets/images/article5.jpg';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [articles, setArticles] = useState([]);
  const userId = localStorage.getItem('userId');

  // Helper pentru ziua săptămânii
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Obține prognoza meteo
  useEffect(() => {
    const getWeather = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
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

  // Get fashion articles
  useEffect(() => {
    const getArticles = async () => {
      setArticles([
        {
          title: "Top 5 trends for spring 2025",
          description: "Discover which clothing pieces will dominate the warm season.",
          link: "https://www.vogue.co.uk/article/spring-summer-2025-fashion-trends",
          image: article1
        },
        {
          title: "How to create an elegant summer look",
          description: "Simple tricks for a light and sophisticated style.",
          link: "https://www.whowhatwear.com/fashion/summer/elegant-summer-style",
          image: article2
        },
        {
          title: "Pastel colors are making a comeback",
          description: "Learn how to integrate them into your everyday outfits.",
          link: "https://www.whowhatwear.com/fashion/outfit-ideas/how-to-wear-pastel-colors",
          image: article3
        },
        {
          title: "How to accessorize an evening outfit",
          description: "The right accessories can completely transform an outfit.",
          link: "https://www.jovani.com/blog/formal-events/how-to-accessorize-formal-evening-wear/",
          image: article4
        },
        {
          title: "Comfy outfits for work-from-home",
          description: "Style and comfort even on Zoom meeting days.",
          link: "https://www.c-and-a.com/eu/en/shop/working-from-home-outfit-tips",
          image: article5
        }        
      ]);
    };
    getArticles();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Welcome to StyleIT</h2>
        
        <Row className="g-4 mt-4">
          <Col md={4}>
            <Link to="/wardrobe" className="dashboard-link">
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="icon-container">
                      <FaTshirt size={24} />
                    </div>
                    <div className="ms-3">
                      <h3 className="card-title">Your Wardrobe</h3>
                      <p className="card-text">View and manage your clothing items</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={4}>
            <Link to="/wardrobe/add" className="dashboard-link">
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="icon-container">
                      <FaShoppingBag size={24} />
                    </div>
                    <div className="ms-3">
                      <h3 className="card-title">Add Items</h3>
                      <p className="card-text">Add new items to your wardrobe</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={4}>
            <Link to={`/profile/${userId}`} className="dashboard-link">
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="icon-container">
                      <FaUser size={24} />
                    </div>
                    <div className="ms-3">
                      <h3 className="card-title">Your Profile</h3>
                      <p className="card-text">Manage your account settings</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* Weather Section */}
        <section className="weather mt-5">
          <h3>Weather Forecast</h3>
          {weather ? (
            <div className="weather-widget">
              {weather.forecast.map((item, index) => (
                <div className="weather-day" key={index}>
                  <div className="day">{getDayName(item.dt_txt)}</div>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                  />
                  <div className="temp">{Math.round(item.main.temp - 273.15)}°C</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading weather...</p>
          )}
        </section>

        {/* Fashion Articles Section */}
        <section className="fashion-articles mt-5">
          <h3>New in Fashion</h3>
          <div className="articles-grid">
            {articles.map((article, index) => (
              <div className="article-card" key={index}>
                <img src={article.image} alt={article.title} />
                <div className="article-info">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
                  <p className="article-desc">{article.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
