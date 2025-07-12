import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StylePreferencesForm.css';

const STYLE_MAP = {
  'Casual chic': 'Casual',
  'Classic': 'Classic',
  'Minimalist': 'Minimalist',
  'Bohemian': 'Bohemian',
  'Sporty': 'Sporty',
  'Formal': 'Formal',
  'Streetwear': 'Streetwear',
  'Trendy': 'Trendy',
  'Business': 'Business',
  // adaugă aici alte variante dacă ai nevoie
};

const COLOR_MAP = {
  'lavender': 'Pastels',
  'beige': 'Earth Tones',
  'neon': 'Bright Colors',
  'black & white': 'Black & White',
  'neutrals': 'Neutrals',
  // adaugă aici alte variante dacă ai nevoie
};

const normalizePreferences = (prefs = {}) => {
  // Define valid options for outfit_feel to filter out old/invalid values
  const validOutfitFeelOptions = ['Loose', 'Slim-fit', 'Oversized', 'Comfort-focused', 'Flexible'];

  // Helper pentru orice multi-select: forțează array din orice input (array, string, null, undefined), curăță spații, elimină duplicate și normalizează la lowercase pentru comparație corectă
  const forceArray = (val) => {
    if (Array.isArray(val)) return Array.from(new Set(val.map(s => (s || '').toString().trim().toLowerCase()).filter(Boolean)));
    if (typeof val === 'string' && val.length > 0) return Array.from(new Set(val.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)));
    return [];
  };

  // Helper pentru a pune prima literă mare (ex: "jeans" -> "Jeans")
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const result = {
    ...prefs,
    style_preference: forceArray(prefs.style_preference).map(val => STYLE_MAP[val] || capitalize(val)),
    favorite_colors: forceArray(prefs.favorite_colors).map(val => COLOR_MAP[val] || capitalize(val)),
    outfit_feel: forceArray(prefs.outfit_feel).filter(val => validOutfitFeelOptions.map(v => v.toLowerCase()).includes(val)).map(capitalize),
    frequent_events: forceArray(prefs.frequent_events).map(capitalize),
    favorite_items: forceArray(prefs.favorite_items).map(capitalize),
    preferred_materials: forceArray(prefs.preferred_materials).map(capitalize),
    preferred_accessories: forceArray(prefs.preferred_accessories).map(capitalize),
    dislikes: prefs.dislikes || '',
    inspirations: prefs.inspirations || '',
    sex_gender: prefs.sex_gender || '',
    body_shape: prefs.body_shape || '',
    height: prefs.height || '',
    weight: prefs.weight || ''
  };

  console.log('normalizePreferences result:', result);

  return result;
};

const StylePreferencesForm = ({ initialPreferences, onSave, onCancel }) => {
  console.log('initialPreferences', initialPreferences);
  const [preferences, setPreferences] = useState(
    initialPreferences ? normalizePreferences(initialPreferences) : {
      sex_gender: '',
      style_preference: [],
      favorite_colors: [],
      outfit_feel: [],
      frequent_events: [],
      favorite_items: [],
      preferred_materials: [],
      preferred_accessories: [],
      dislikes: '',
      inspirations: '',
      body_shape: '',
      height: '',
      weight: ''
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Folosesc un ref ca să mă asigur că initialPreferences e folosit doar la montare
  const didInit = React.useRef(false);
  useEffect(() => {
    if (!didInit.current && initialPreferences) {
      console.log('RESET FORM STATE din useEffect (doar la montare!)', initialPreferences);
      setPreferences(normalizePreferences(initialPreferences));
      didInit.current = true;
    }
  }, [initialPreferences]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleMultiSelect = (name, value, limit) => {
    setPreferences((prev) => {
      let selected = prev[name];
      // Forțez array pentru orice caz
      if (!Array.isArray(selected)) {
        if (typeof selected === 'string' && selected.length > 0) {
          selected = selected.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          selected = [];
        }
      }
      console.log(`handleMultiSelect - ${name}:`, { selected, value, limit, isArray: Array.isArray(selected) });

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
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (onSave) onSave();
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
                checked={preferences.style_preference.map(s => s.toLowerCase()).includes(style.toLowerCase())}
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
                checked={preferences.favorite_colors.map(c => c.toLowerCase()).includes(palette.toLowerCase())}
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
                checked={preferences.outfit_feel.map(f => f.toLowerCase()).includes(option.toLowerCase())}
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
                checked={preferences.frequent_events.map(e => e.toLowerCase()).includes(event.toLowerCase())}
                onChange={() => handleMultiSelect('frequent_events', event, 3)}
              /> {event}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Favorite Items (max 3)</label>
          {['Jeans', 'Dresses', 'T-shirts', 'Sneakers', 'Jackets', 'Sweaters', 'Shirts', 'Skirts'].map(item => (
            <div key={item}>
              <input
                type="checkbox"
                checked={preferences.favorite_items.map(i => i.toLowerCase()).includes(item.toLowerCase())}
                onChange={() => handleMultiSelect('favorite_items', item, 3)}
              /> {item}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Materials (max 3)</label>
          {['Cotton', 'Denim', 'Leather', 'Silk', 'Wool', 'Polyester', 'Linen', 'Suede'].map(material => (
            <div key={material}>
              <input
                type="checkbox"
                checked={preferences.preferred_materials.map(m => m.toLowerCase()).includes(material.toLowerCase())}
                onChange={() => handleMultiSelect('preferred_materials', material, 3)}
              /> {material}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Accessories (max 3)</label>
          {['Watches', 'Necklaces', 'Bracelets', 'Earrings', 'Belts', 'Scarves', 'Hats', 'Bags'].map(accessory => (
            <div key={accessory}>
              <input
                type="checkbox"
                checked={preferences.preferred_accessories.map(a => a.toLowerCase()).includes(accessory.toLowerCase())}
                onChange={() => handleMultiSelect('preferred_accessories', accessory, 3)}
              /> {accessory}
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

        <div className="d-flex justify-content-center gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StylePreferencesForm;
