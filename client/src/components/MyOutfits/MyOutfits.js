import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import axios from 'axios';
import { Card, Col, Row, Container, Alert, Button } from 'react-bootstrap';
import { FaFolderOpen } from 'react-icons/fa';
import './MyOutfits.css';
import { useNavigate } from 'react-router-dom';
import OutfitViewModal from '../OutfitViewModal/OutfitViewModal';

const MyOutfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingOutfit, setViewingOutfit] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutfits = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/outfits', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOutfits(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching outfits:', err);
        setError(err.response?.data?.error || 'Failed to fetch outfits.');
        setLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  const handleCardClick = (outfit) => {
    setViewingOutfit(outfit);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingOutfit(null);
  };

  const handleDeleteOutfit = async (outfitId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not logged in.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this outfit?')) {
      try {
        await axios.delete(`/api/outfits/${outfitId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== outfitId));
        if (viewingOutfit && viewingOutfit.id === outfitId) {
          handleCloseViewModal();
        }
      } catch (err) {
        console.error('Error deleting outfit:', err);
        setError(err.response?.data?.error || 'Failed to delete outfit.');
      }
    }
  };

  const handleEditOutfit = (outfit) => {
    navigate(`/wardrobe?editOutfitId=${outfit.id}`);
    if (showViewModal) {
        handleCloseViewModal();
    }
  };

  return (
    <Layout>
      <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
          <FaFolderOpen size={36} className="me-2" />
          <h2 className="mb-0">My Outfits</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div>Loading outfits...</div>
        ) : outfits.length === 0 ? (
          <Alert variant="info" className="mt-4">
            You haven't saved any outfits yet. Head to your Wardrobe to create one!
          </Alert>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {outfits.map(outfit => (
              <Col key={outfit.id}>
                <Card style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{outfit.name}</Card.Title>
                    {outfit.date && <Card.Subtitle className="mb-2 text-muted">Date: {new Date(outfit.date).toLocaleDateString()}</Card.Subtitle>}
                    
                    <Button variant="primary" size="sm" className="mt-3" onClick={() => handleCardClick(outfit)}>
                        View Details
                    </Button>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <OutfitViewModal
        show={showViewModal}
        handleClose={handleCloseViewModal}
        outfit={viewingOutfit}
        handleEdit={handleEditOutfit}
        handleDelete={handleDeleteOutfit}
      />
    </Layout>
  );
};

export default MyOutfits; 