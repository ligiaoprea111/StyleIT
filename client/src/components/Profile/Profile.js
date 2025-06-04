import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { FaUser, FaEdit, FaPalette, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import Layout from '../Layout/Layout';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem('userId');

  const currentUserId = id || storedUserId;

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stylePreferences, setStylePreferences] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [styleCategory, setStyleCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Profile: Fetching user data...');
      console.log('Profile: useParams ID:', id);
      console.log('Profile: localStorage userId:', storedUserId);
      console.log('Profile: currentUserId being used for fetch:', currentUserId);

      if (!currentUserId || isNaN(currentUserId)) {
        console.error('Profile: Invalid or missing User ID. Aborting fetch.', { id, storedUserId, currentUserId });
        setError('User information not available. Please log in again.');
        setLoading(false);
        // We might want to redirect to login here if currentUserId is consistently invalid
        // navigate('/');
        return;
      }

      try {
        console.log(`Profile: Attempting to fetch user with ID: ${currentUserId} at /api/users/${currentUserId}`);
        const userResponse = await axios.get(`/api/users/${currentUserId}`);
        setUser(userResponse.data);

        console.log(`Profile: Attempting to fetch profile with ID: ${currentUserId} at /api/profile/${currentUserId}`);
        const profileResponse = await axios.get(`/api/profile/${currentUserId}`);
        setProfile(profileResponse.data);
        setEditedProfile(profileResponse.data);

        try {
          console.log(`Profile: Attempting to fetch style preferences for user ID: ${currentUserId} at /api/style-preferences`);
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Profile: JWT token not found for fetching style preferences.');
            setStylePreferences(null);
            setStyleCategory('Not specified');
            // Optionally set an error message for the user
            // setError('Authentication token missing. Cannot load style preferences.');
          } else {
            const preferencesResponse = await axios.get(`/api/style-preferences`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setStylePreferences(preferencesResponse.data);
            determineStyleCategory(preferencesResponse.data);
          }
        } catch (prefError) {
            if (prefError.response && prefError.response.status === 404) {
                console.log('Profile: Style preferences not found for user ', currentUserId);
                setStylePreferences(null);
                setStyleCategory('Not specified');
            } else {
                 console.error(`Profile: Error fetching style preferences for user ${currentUserId}:`, prefError);
                 setError('Failed to fetch style preferences.');
            }
        }

        setLoading(false);

      } catch (err) {
        console.error(`Profile: Error fetching user or profile data for user ${currentUserId}:`, err);
        // Check if the error is due to the specific /api/profiles/2/1 pattern
         if (err.config && err.config.url && err.config.url.includes('/api/profiles/') && err.config.url.endsWith('/1')) {
            console.error('Profile: Detected potential incorrect profile endpoint pattern.');
            // Provide a specific error message or handle differently
             setError('There was an issue loading your profile due to an incorrect address.');
         } else {
            setError('Failed to fetch user or profile data.');
         }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUserId, navigate, id, storedUserId]);

  const determineStyleCategory = (preferences) => {
    if (!preferences) {
        setStyleCategory('Not specified');
        return;
    }

    const stylePref = preferences.style_preference?.toLowerCase();
    const outfitFeel = preferences.outfit_feel?.toLowerCase();

    if (stylePref?.includes('minimal') || outfitFeel?.includes('minimal')) {
      setStyleCategory('Minimalist');
    } else if (stylePref?.includes('classic') || outfitFeel?.includes('elegant')) {
      setStyleCategory('Classic');
    } else if (stylePref?.includes('casual') || outfitFeel?.includes('comfortable')) {
      setStyleCategory('Casual');
    } else if (stylePref?.includes('bohemian') || outfitFeel?.includes('free')) {
      setStyleCategory('Bohemian');
    } else {
      setStyleCategory('Eclectic');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!id) {
        console.error('Profile: User ID not available from URL for saving profile.', { id, storedUserId });
        setError('Cannot save profile: User ID is missing from URL.');
        return;
    }

    try {
      console.log(`Profile: Attempting to update profile for user with ID: ${id} at /api/profile/${id}`);
      await axios.put(`/api/profile/${id}`, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error(`Profile: Error updating profile for user ${id}:`, error);
      setError('Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
      return <Layout><Container className="profile-container"><div>Loading profile...</div></Container></Layout>;
  }

  if (error) {
      return <Layout><Container className="profile-container"><Alert variant="danger">{error}</Alert></Container></Layout>;
  }

  if (!user || !profile) {
      return <Layout><Container className="profile-container"><Alert variant="info">Profile data not available.</Alert></Container></Layout>;
  }

  return (
    <Layout>
      <Container className="profile-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="profile-card">
              <Card.Body>
                <div className="profile-header">
                  <div className="profile-avatar">
                    {profile.profilePicture ? (
                      <img src={profile.profilePicture} alt="Profile" />
                    ) : (
                      <FaUser size={64} />
                    )}
                  </div>
                  <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p className="text-muted">{user.email}</p>
                    <div className="style-category">
                      <FaPalette className="me-2" />
                      <span>Style Category: {styleCategory}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-details mt-4">
                  <Row>
                    <Col md={6}>
                      <div className="detail-item">
                        <FaMapMarkerAlt className="me-2" />
                        <span>Location: {profile.location || 'Not specified'}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <FaBirthdayCake className="me-2" />
                        <span>Birthday: {profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not specified'}</span>
                      </div>
                    </Col>
                  </Row>

                  {isEditing ? (
                    <Form className="mt-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={editedProfile.description || ''}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={editedProfile.location || ''}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Birthday</Form.Label>
                        <Form.Control
                          type="date"
                          name="birthday"
                          value={editedProfile.birthday || ''}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <div className="description mt-4">
                        <h4>About Me</h4>
                        <p>{profile.description || 'No description provided.'}</p>
                      </div>
                      <Button variant="outline-primary" className="mt-3" onClick={handleEdit}>
                        <FaEdit className="me-2" />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>

                {stylePreferences && (
                  <div className="style-preferences mt-4">
                    <h4>Style Preferences</h4>
                    <Row>
                      <Col md={6}>
                        <div className="preference-item">
                          <strong>Style Preference:</strong>
                          <p>{stylePreferences.style_preference || 'Not specified'}</p>
                        </div>
                         <div className="preference-item">
                          <strong>Outfit Feel:</strong>
                          <p>{stylePreferences.outfit_feel || 'Not specified'}</p>
                        </div>
                         <div className="preference-item">
                          <strong>Body Shape:</strong>
                          <p>{stylePreferences.body_shape || 'Not specified'}</p>
                        </div>
                         <div className="preference-item">
                          <strong>Favorite Items:</strong>
                          <p>{stylePreferences.favorite_items || 'Not specified'}</p>
                        </div>
                         <div className="preference-item">
                          <strong>Favorite Colors:</strong>
                          <p>{stylePreferences.favorite_colors || 'Not specified'}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="preference-item">
                          <strong>Preferred Materials:</strong>
                          <p>{stylePreferences.preferred_materials || 'Not specified'}</p>
                        </div>
                        <div className="preference-item">
                          <strong>Frequent Events:</strong>
                          <p>{stylePreferences.frequent_events || 'Not specified'}</p>
                        </div>
                        <div className="preference-item">
                          <strong>Preferred Accessories:</strong>
                          <p>{stylePreferences.preferred_accessories || 'Not specified'}</p>
                        </div>
                         <div className="preference-item">
                          <strong>Avoided Outfits:</strong>
                          <p>{stylePreferences.avoided_outfits || 'Not specified'}</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                 {!stylePreferences && !isEditing && user && profile && (
                    <div className="style-preferences mt-4">
                       <h4>Style Preferences</h4>
                       <Alert variant="info">Please complete your style preferences form to see this section and get a style category.</Alert>
                    </div>
                 )}

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Profile;