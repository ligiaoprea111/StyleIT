import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StylePreferencesForm.css';  // Adaugă importul CSS


const StylePreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    style_preference: '',
    favorite_colors: '',
    avoided_colors: '',
    outfit_feel: '',
    frequent_events: '',
    preferred_accessories: '',
    body_shape: '',
    favorite_items: '',
    preferred_materials: '',
    avoided_outfits: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/api/style-preferences', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setPreferences(response.data);
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError('Failed to load preferences.');
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post('/api/style-preferences', preferences, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      alert('Preferences saved successfully!');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Style Preferences</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Style Preference</label>
          <input
            type="text"
            className="form-control"
            name="style_preference"
            value={preferences.style_preference}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Favorite Colors</label>
          <input
            type="text"
            className="form-control"
            name="favorite_colors"
            value={preferences.favorite_colors}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Avoided Colors</label>
          <input
            type="text"
            className="form-control"
            name="avoided_colors"
            value={preferences.avoided_colors}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Outfit Feel</label>
          <input
            type="text"
            className="form-control"
            name="outfit_feel"
            value={preferences.outfit_feel}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Frequent Events</label>
          <input
            type="text"
            className="form-control"
            name="frequent_events"
            value={preferences.frequent_events}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Accessories</label>
          <input
            type="text"
            className="form-control"
            name="preferred_accessories"
            value={preferences.preferred_accessories}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Body Shape</label>
          <input
            type="text"
            className="form-control"
            name="body_shape"
            value={preferences.body_shape}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Favorite Items</label>
          <input
            type="text"
            className="form-control"
            name="favorite_items"
            value={preferences.favorite_items}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Materials</label>
          <input
            type="text"
            className="form-control"
            name="preferred_materials"
            value={preferences.preferred_materials}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Avoided Outfits</label>
          <input
            type="text"
            className="form-control"
            name="avoided_outfits"
            value={preferences.avoided_outfits}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StylePreferencesForm;
