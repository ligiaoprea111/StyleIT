import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import './CreateOutfit.css';

const OCCASIONS = [
  'Stroll in the park',
  'Gym',
  'Party',
  'Date',
  'Work',
  'Casual',
  'Formal',
  'Other',
];

const STYLES = [
  'Casual',
  'Formal',
  'Sporty',
  'Trendy',
  'Classic',
  'Business',
  'Elegant',
  'Comfy',
  'Other',
];

const CreateOutfit = () => {
  const [occasion, setOccasion] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const [style, setStyle] = useState('');
  const [customStyle, setCustomStyle] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [avoidItems, setAvoidItems] = useState('');
  const [mustHave, setMustHave] = useState('');
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState(null);
  const [gptExplanation, setGptExplanation] = useState('');
  const [error, setError] = useState('');

  const handleOccasionChange = (e) => {
    setOccasion(e.target.value);
    if (e.target.value !== 'Other') setCustomOccasion('');
  };

  const handleStyleChange = (e) => {
    setStyle(e.target.value);
    if (e.target.value !== 'Other') setCustomStyle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOutfit(null);
    setGptExplanation('');
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const response = await fetch('/api/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId,
          occasion: occasion === 'Other' ? customOccasion : occasion,
          style: style === 'Other' ? customStyle : style,
          preferredColors,
          avoidItems,
          mustHave,
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || 'Failed to generate outfit');
        setGptExplanation(errData.raw || '');
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (data.items && data.explanation) {
        setOutfit(data.items);
        setGptExplanation(data.explanation);
      } else if (data.outfit && data.explanation) {
        setOutfit(data.outfit);
        setGptExplanation(data.explanation);
      } else {
        setOutfit(null);
        setGptExplanation(JSON.stringify(data));
      }
    } catch (err) {
      setError('Could not generate outfit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="create-outfit-container">
        <h2 className="create-outfit-title">Create Outfit with FashionGPT</h2>
        <form className="outfit-form" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="occasion">Occasion:</label>
            <select
              id="occasion"
              value={occasion}
              onChange={handleOccasionChange}
              required
              className="form-select"
            >
              <option value="">Select an occasion</option>
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            {occasion === 'Other' && (
              <input
                type="text"
                placeholder="Describe the occasion"
                value={customOccasion}
                onChange={e => setCustomOccasion(e.target.value)}
                required
                className="form-control mt-2"
              />
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="style">Preferred Style:</label>
            <select
              id="style"
              value={style}
              onChange={handleStyleChange}
              className="form-select"
            >
              <option value="">No preference</option>
              {STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {style === 'Other' && (
              <input
                type="text"
                placeholder="Describe your style"
                value={customStyle}
                onChange={e => setCustomStyle(e.target.value)}
                className="form-control mt-2"
              />
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="preferredColors">Preferred Colors:</label>
            <input
              type="text"
              id="preferredColors"
              value={preferredColors}
              onChange={e => setPreferredColors(e.target.value)}
              placeholder="e.g. blue, white, pastel"
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="avoidItems">Items to Avoid:</label>
            <input
              type="text"
              id="avoidItems"
              value={avoidItems}
              onChange={e => setAvoidItems(e.target.value)}
              placeholder="e.g. jeans, heels, hats"
              className="form-control"
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="mustHave">Must-have Item/Type:</label>
            <input
              type="text"
              id="mustHave"
              value={mustHave}
              onChange={e => setMustHave(e.target.value)}
              placeholder="e.g. dress, sneakers, scarf"
              className="form-control"
            />
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Outfit'}
            </button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {outfit && Array.isArray(outfit) && (
          <div className="outfit-list">
            <h5>Recommended Items:</h5>
            <ul>
              {outfit.map((item, idx) => (
                <li key={item.id || idx}>
                  <b>{item.name}</b> ({item.category}{item.subCategory ? `, ${item.subCategory}` : ''})
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{maxWidth:'50px',marginLeft:'8px'}} />}
                </li>
              ))}
            </ul>
          </div>
        )}
        {gptExplanation && (
          <div className="gpt-explanation">
            <b>Explanation:</b> {gptExplanation}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateOutfit; 