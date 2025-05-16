import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StylePreferencesForm.css';

const StylePreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    sex_gender: '',
    style_preference: [],
    favorite_colors: [],
    outfit_feel: [],
    frequent_events: [],
    dislikes: '',
    inspirations: '',
    body_shape: '',
    height: '',
    weight: ''
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
    const { name, value, type } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleMultiSelect = (name, value, limit) => {
    setPreferences((prev) => {
      const selected = prev[name];
      if (selected.includes(value)) {
        return { ...prev, [name]: selected.filter((v) => v !== value) };
      }
      if (selected.length < limit) {
        return { ...prev, [name]: [...selected, value] };
      }
      return prev;
    });
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

        {/* SECTION 1: Identity */}
        <div className="mb-3">
          <label className="form-label">Sex / Gender</label>
          <select className="form-select" name="sex_gender" value={preferences.sex_gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* SECTION 2: Style & Color */}
        <div className="mb-3">
          <label className="form-label">Preferred Styles (max 2)</label>
          {['Casual', 'Formal', 'Sporty', 'Streetwear', 'Bohemian', 'Minimalist', 'Classic', 'Trendy', 'Business'].map(style => (
            <div key={style}>
              <input
                type="checkbox"
                checked={preferences.style_preference.includes(style)}
                onChange={() => handleMultiSelect('style_preference', style, 2)}
              /> {style}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Favorite Color Palettes (max 3)</label>
          {['Black & White', 'Pastels', 'Earth Tones', 'Bright Colors', 'Green & Red', 'Neutrals'].map(palette => (
            <div key={palette}>
              <input
                type="checkbox"
                checked={preferences.favorite_colors.includes(palette)}
                onChange={() => handleMultiSelect('favorite_colors', palette, 3)}
              /> {palette}
            </div>
          ))}
        </div>

        {/* SECTION 3: Comfort & Events */}
        <div className="mb-3">
          <label className="form-label">Fit & Comfort Preferences (max 3)</label>
          {['Loose', 'Slim-fit', 'Oversized', 'Comfort-focused', 'Flexible'].map(option => (
            <div key={option}>
              <input
                type="checkbox"
                checked={preferences.outfit_feel.includes(option)}
                onChange={() => handleMultiSelect('outfit_feel', option, 3)}
              /> {option}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Occasion Preferences (max 3)</label>
          {['Work', 'School', 'Parties', 'Gym', 'Travel'].map(event => (
            <div key={event}>
              <input
                type="checkbox"
                checked={preferences.frequent_events.includes(event)}
                onChange={() => handleMultiSelect('frequent_events', event, 3)}
              /> {event}
            </div>
          ))}
        </div>

        {/* SECTION 4: Personal Touches */}
        <div className="mb-3">
          <label className="form-label">Disliked Patterns / Combinations</label>
          <input
            type="text"
            className="form-control"
            name="dislikes"
            value={preferences.dislikes}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Style Inspirations (optional)</label>
          <input
            type="text"
            className="form-control"
            name="inspirations"
            value={preferences.inspirations}
            onChange={handleChange}
          />
        </div>

        {/* SECTION 5: Body Info */}
        <div className="mb-3">
          <label className="form-label">Body Shape</label>
          <select className="form-select" name="body_shape" value={preferences.body_shape} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Hourglass">Hourglass</option>
            <option value="Pear">Pear</option>
            <option value="Apple">Apple</option>
            <option value="Inverted Triangle">Inverted Triangle</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Height (cm/in)</label>
          <input
            type="number"
            className="form-control"
            name="height"
            value={preferences.height}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Weight (kg/lbs)</label>
          <input
            type="number"
            className="form-control"
            name="weight"
            value={preferences.weight}
            onChange={handleChange}
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
