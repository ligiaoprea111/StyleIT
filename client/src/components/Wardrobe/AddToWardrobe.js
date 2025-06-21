import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import './AddToWardrobe.css';

const AddToWardrobe = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    color: '',
    material: '',
    season: '',
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { name: 'Clothing', subcategories: [
      'T-Shirts', 'Shirts', 'Blouses', 'Cardigans', 'Dresses', 'Skirts', 
      'Pants', 'Jeans', 'Shorts', 'Sweaters', 'Blazers', 'Jackets and coats', 'Sports'
    ]},
    { name: 'Accessories', subcategories: [
      'Belts', 'Jewelry', 'Bags', 'Sunglasses', 'Wallets', 'Scarves', 
      'Watches', 'Hats', 'Gloves'
    ]},
    { name: 'Shoes', subcategories: [
      'Sneakers', 'Sandals', 'Heels', 'Boots', 'Flats', 'Loafers', 'Mules'
    ]}
  ];

  const seasons = [
    'Spring',
    'Summer',
    'Fall',
    'Winter',
    'Spring-Summer',
    'All Seasons'
  ];

  const materials = [
    'Cotton',
    'Denim',
    'Wool',
    'Wool Blend',
    'Silk',
    'Polyester',
    'Polyester Blend',
    'Leather',
    'Linen',
    'Cotton Blend'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setErrorMessage('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (!formData.name || !formData.category || !formData.subCategory || !formData.color) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Please select an image');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subCategory', formData.subCategory);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('material', formData.material);
      formDataToSend.append('season', formData.season);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('isUserUploaded', 'true');
      formDataToSend.append('userId', localStorage.getItem('userId'));

      const response = await fetch('http://localhost:5000/api/wardrobe', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccessMessage('Item added successfully to your wardrobe!');
        setFormData({
          name: '',
          category: '',
          subCategory: '',
          color: '',
          material: '',
          season: '',
          description: '',
          tags: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Redirect to wardrobe page after 5 seconds
        setTimeout(() => {
          navigate('/wardrobe');
        }, 5000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Failed to add item to wardrobe');
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the item');
      console.error('Error adding item:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0">Add Item to Wardrobe</h2>
              </div>
              <div className="card-body">
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Item Image *</label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        required
                      />
                      {previewUrl && (
                        <div className="image-preview mt-3">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="img-preview"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Item Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category *</label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subCategory" className="form-label">Subcategory *</label>
                    <select
                      className="form-select"
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subcategory</option>
                      {formData.category && categories
                        .find(cat => cat.name === formData.category)
                        ?.subcategories.map(sub => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="color" className="form-label">Color *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="material" className="form-label">Material</label>
                    <select
                      className="form-select"
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                    >
                      <option value="">Select a material</option>
                      {materials.map(material => (
                        <option key={material} value={material}>
                          {material}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="season" className="form-label">Season</label>
                    <select
                      className="form-select"
                      id="season"
                      name="season"
                      value={formData.season}
                      onChange={handleChange}
                    >
                      <option value="">Select a season</option>
                      {seasons.map(season => (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="Enter tags separated by commas"
                    />
                    <small className="form-text text-muted">
                      Example: casual, summer, cotton
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Adding Item...' : 'Add to Wardrobe'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/wardrobe')}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddToWardrobe; 