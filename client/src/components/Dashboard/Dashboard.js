import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Layout from '../Layout/Layout';
import article1 from '../../assets/images/article1.jpg';
import article2 from '../../assets/images/article2.jpg';
import article3 from '../../assets/images/article3.jpg';
import article4 from '../../assets/images/article4.jpg';
import article5 from '../../assets/images/article5.jpg';
import { FaUserCircle, FaTshirt, FaShoppingBag, FaUser, FaPalette } from 'react-icons/fa';
import { BsCalendarCheckFill } from 'react-icons/bs';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [articles, setArticles] = useState([]);
  const userId = localStorage.getItem('userId');
  const [userName, setUserName] = useState('');
  const [scheduledDates, setScheduledDates] = useState([]);

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
          const dailyForecast = processForecast(response.data.list);
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
      const dailyForecast = processForecast(response.data.list);
      setWeather({
        city: response.data.city,
        forecast: dailyForecast
      });
    };

    // Procesare prognoză: mereu include azi, alege cea mai apropiată oră de 12:00 pentru fiecare zi, 5 zile
    function processForecast(list) {
      const grouped = {};
      list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });
      // Pentru fiecare zi, alege forecast-ul cel mai apropiat de 12:00
      const getClosestToNoon = (arr) => {
        return arr.reduce((prev, curr) => {
          const prevDiff = Math.abs(parseInt(prev.dt_txt.split(' ')[1].split(':')[0], 10) - 12);
          const currDiff = Math.abs(parseInt(curr.dt_txt.split(' ')[1].split(':')[0], 10) - 12);
          return currDiff < prevDiff ? curr : prev;
        });
      };
      // Ordine cronologică, mereu începe cu azi
      const todayStr = new Date().toISOString().split('T')[0];
      const allDates = Object.keys(grouped).sort();
      // Găsește indexul pentru azi
      let todayIdx = allDates.indexOf(todayStr);
      if (todayIdx === -1) todayIdx = 0; // fallback dacă nu există azi
      // Selectează 5 zile, începând cu azi
      const selectedDates = allDates.slice(todayIdx, todayIdx + 5);
      // Dacă nu sunt suficiente, completează cu zile următoare
      while (selectedDates.length < 5 && allDates.length > 0) {
        const nextIdx = todayIdx + selectedDates.length;
        if (allDates[nextIdx]) selectedDates.push(allDates[nextIdx]);
        else break;
      }
      // Construiește lista finală
      return selectedDates.map(date => getClosestToNoon(grouped[date]));
    }

    getWeather();
  }, []);

  // Get fashion articles
  useEffect(() => {
    const getArticles = async () => {
      try {
        const res = await axios.get('/api/fashion-news');
        if (res.data && res.data.articles && res.data.articles.length > 0) {
          setArticles(res.data.articles);
        } else {
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
        }
      } catch (err) {
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
      }
    };
    getArticles();
  }, []);

  // Fetch user name
  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUserName(res.data.name || 'My Account');
      } catch {
        setUserName('My Account');
      }
    };
    fetchUserName();
  }, [userId]);

  // Fetch scheduled outfit dates
  useEffect(() => {
    if (!userId) return;
    const fetchScheduledDates = async () => {
      try {
        const res = await axios.get(`/api/scheduled-outfits/dates/${userId}`);
        setScheduledDates(res.data.map(date => date.split('T')[0])); // Normalize date format
      } catch (err) {
        setScheduledDates([]);
      }
    };
    fetchScheduledDates();
  }, [userId]);

  return (
    <Layout>
      <div className="dashboard-container" style={{position:'relative'}}>
        {/* User account button */}
        <Link to={`/profile/${userId}`} className="dashboard-user-btn">
          <FaUserCircle style={{fontSize:28,marginRight:8,color:'#2fbad1',verticalAlign:'middle'}}/>
          <span style={{fontWeight:600,color:'#33044a',fontSize:16,verticalAlign:'middle'}}>{userName}</span>
        </Link>
        <h2 className="dashboard-title">Welcome to your interactive digital wardrobe!</h2>
        
        {/* Weather Section, Fashion Articles, etc. vor rămâne */}
        {/* Am eliminat complet blocul dashboard-top-row și tot conținutul său */}

        {/* Secțiune cu 4 carduri simetrice, colorate, 2x2 */}
        <div className="dashboard-main-cards">
          <div className="dashboard-main-card wardrobe-card">
            <Link to="/wardrobe" className="dashboard-link">
              <div className="dashboard-main-icon"><FaTshirt size={28}/></div>
              <div>
                <div className="dashboard-main-title" style={{fontSize:'1.05rem'}}>Your Wardrobe</div>
                <div className="dashboard-main-desc" style={{fontSize:'0.95rem'}}>View and manage your clothing items</div>
              </div>
            </Link>
          </div>
          <div className="dashboard-main-card add-card">
            <Link to="/wardrobe/add" className="dashboard-link">
              <div className="dashboard-main-icon"><FaShoppingBag size={28}/></div>
              <div>
                <div className="dashboard-main-title" style={{fontSize:'1.05rem'}}>Add Items</div>
                <div className="dashboard-main-desc" style={{fontSize:'0.95rem'}}>Add new items to your wardrobe</div>
              </div>
            </Link>
          </div>
          {/* Card nou: Outfit Calendar */}
          <div className="dashboard-main-card calendar-card">
            <Link to="/calendar" className="dashboard-link">
              <div className="dashboard-main-icon"><FaUser size={28}/></div>
              <div>
                <div className="dashboard-main-title" style={{fontSize:'1.05rem'}}>Outfit Calendar</div>
                <div className="dashboard-main-desc" style={{fontSize:'0.95rem'}}>Plan your outfits for upcoming events</div>
              </div>
            </Link>
          </div>
          <div className="dashboard-main-card ai-card">
            <Link to="/ai-assistant" className="dashboard-link">
              <div className="dashboard-main-icon"><FaPalette size={28}/></div>
              <div>
                <div className="dashboard-main-title" style={{fontSize:'1.05rem'}}>StyleIT AI Assistant</div>
                <div className="dashboard-main-desc" style={{fontSize:'0.95rem'}}>Ask for outfit ideas, style tips, or wardrobe suggestions powered by AI.</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Weather Section */}
        <section className="weather mt-5">
          <h3>Always dress for the weather</h3>
          {weather ? (
            <div className="weather-widget">
              {weather.forecast.map((item, index) => {
                const isToday = new Date(item.dt_txt).toDateString() === new Date().toDateString();
                const dateStr = item.dt_txt.split('T')[0] || item.dt_txt.split(' ')[0];
                const hasOutfit = scheduledDates.includes(dateStr);
                return (
                  <div className={`weather-day${isToday ? ' today' : ''}${hasOutfit ? ' has-outfit' : ''}`} key={index}>
                    <div className="day" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}>
                      {getDayName(item.dt_txt)}
                      {hasOutfit && <BsCalendarCheckFill className="outfit-icon" title="Outfit scheduled" style={{color:'#2fbad1',marginLeft:4,fontSize:18}} />}
                    </div>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                    />
                    <div className="temp">{Math.round(item.main.temp - 273.15)}°C</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Loading weather...</p>
          )}
        </section>

        {/* Fashion Articles Section */}
        <section className="fashion-articles mt-5">
          <h3>The latest fashion articles to get you inspired</h3>
          <div className="articles-grid">
            {articles.map((article, index) => {
              const isInvalidImg = (src) =>
                !src || src === 'null' || src.trim() === '' || src.includes('via.placeholder.com');
              const imgSrc =
                (!isInvalidImg(article.image)) ? article.image :
                (!isInvalidImg(article.urlToImage)) ? article.urlToImage :
                article1;
              return (
                <a
                  className="article-card"
                  key={index}
                  href={article.url || article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={imgSrc}
                    alt={article.title}
                    className="article-image"
                  />
                  <h4>{article.title}</h4>
                  <p>{article.description}</p>
                  {article.source && (
                    <span className="news-source">
                      {typeof article.source === 'object' && article.source !== null ? article.source.name : article.source}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
