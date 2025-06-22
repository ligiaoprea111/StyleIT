import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { FaEdit, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import Layout from '../Layout/Layout';
import StylePreferencesForm from '../StylePreferencesForm/StylePreferencesForm';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingStyle, setIsEditingStyle] = useState(false);

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
            // Optionally set an error message for the user
            // setError('Authentication token missing. Cannot load style preferences.');
          } else {
            const preferencesResponse = await axios.get(`/api/style-preferences`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setStylePreferences(preferencesResponse.data);
          }
        } catch (prefError) {
            if (prefError.response && prefError.response.status === 404) {
                console.log('Profile: Style preferences not found for user ', currentUserId);
                setStylePreferences(null);
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
      let dataToSend;
      let config = {};
      // Dacă poza de profil e un fișier, trimite FormData
      if (editedProfile.profilePicture instanceof File) {
        dataToSend = new FormData();
        dataToSend.append('description', editedProfile.description || '');
        dataToSend.append('location', editedProfile.location || '');
        dataToSend.append('birthday', editedProfile.birthday || '');
        dataToSend.append('profilePicture', editedProfile.profilePicture);
        dataToSend.append('email', editedProfile.email || '');
        dataToSend.append('name', editedProfile.name || '');
        config.headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        dataToSend = {
          description: editedProfile.description,
          location: editedProfile.location,
          birthday: editedProfile.birthday,
          profilePicture: editedProfile.profilePicture,
          email: editedProfile.email,
          name: editedProfile.name
        };
      }
      await axios.put(`/api/profile/${id}`, dataToSend, config);
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
        <Row className="justify-content-center g-4">
          <Col md={10}>
            {/* CARD 1: Informații de bază */}
            <Card className="profile-card mb-4">
              <Card.Body>
                <div className="profile-header-new">
                  <div className="profile-main-info">
                    {isEditing ? (
                      <>
                        <Form.Group className="mb-2">
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" name="name" value={editedProfile.name || ''} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" name="email" value={editedProfile.email || ''} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Location</Form.Label>
                          <Form.Control type="text" name="location" value={editedProfile.location || ''} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Birthday</Form.Label>
                          <Form.Control type="date" name="birthday" value={editedProfile.birthday || ''} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Description</Form.Label>
                          <Form.Control as="textarea" rows={2} name="description" value={editedProfile.description || ''} onChange={handleInputChange} />
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <h2>{user.name}</h2>
                        <p className="text-muted">{user.email}</p>
                        <div className="detail-item" style={{ justifyContent: 'center' }}><FaMapMarkerAlt className="me-2" />{profile.location || 'Location not specified'}</div>
                        <div className="detail-item" style={{ justifyContent: 'center' }}><FaBirthdayCake className="me-2" />{profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Birthday not specified'}</div>
                        <div className="description mt-2">{profile.description || 'No description provided.'}</div>
                      </>
                    )}
                    <div className="d-flex gap-2 mt-3 justify-content-center">
                      {isEditing ? (
                        <>
                          <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
                          <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel</Button>
                        </>
                      ) : (
                        <Button variant="outline-primary" size="sm" onClick={handleEdit}><FaEdit className="me-2" />Edit Profile</Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* CARD 2: Preferințe de stil */}
            <Card className="style-preferences-card">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="mb-0">Style Preferences</h4>
                  {!isEditingStyle ? (
                    <Button variant="outline-primary" size="sm" onClick={() => setIsEditingStyle(true)}><FaEdit className="me-2" />Edit</Button>
                  ) : (
                    <div className="d-flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => setIsEditingStyle(false)}>Save</Button>
                      <Button variant="secondary" size="sm" onClick={() => setIsEditingStyle(false)}>Cancel</Button>
                    </div>
                  )}
                </div>
                {isEditingStyle ? (
                  <StylePreferencesForm key={isEditingStyle ? JSON.stringify(stylePreferences) : 'view'} initialPreferences={stylePreferences} />
                ) : (
                  <Row>
                    <Col md={6}>
                      <div className="preference-item"><strong>Style Preference:</strong><p>{stylePreferences?.style_preference || 'Not specified'}</p></div>
                      <div className="preference-item"><strong>Outfit Feel:</strong><p>{stylePreferences?.outfit_feel || 'Not specified'}</p></div>
                      <div className="preference-item"><strong>Body Shape:</strong><p>{stylePreferences?.body_shape || 'Not specified'}</p></div>
                      <div className="preference-item"><strong>Favorite Items:</strong><p>{stylePreferences?.favorite_items || 'Not specified'}</p></div>
                      <div className="preference-item"><strong>Favorite Colors:</strong><p>{stylePreferences?.favorite_colors || 'Not specified'}</p></div>
                    </Col>
                    <Col md={6}>
                      <div className="preference-item"><strong>Preferred Materials:</strong><p>{stylePreferences?.preferred_materials || 'Not specified'}</p></div>
                      <div className="preference-item"><strong>Frequent Events:</strong><p>{stylePreferences?.frequent_events || 'Not specified'}</p></div>
                      <div className="preference-item"><strong>Preferred Accessories:</strong><p>{stylePreferences?.preferred_accessories || 'Not specified'}</p></div>
                      <div className="preference-item"><strong>Avoided Outfits:</strong><p>{stylePreferences?.avoided_outfits || 'Not specified'}</p></div>
                    </Col>
                  </Row>
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