import React from 'react';
import { Modal, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import icons
import './OutfitViewModal.css'; // We can add some custom styles later if needed

const OutfitViewModal = ({ show, handleClose, outfit, handleEdit, handleDelete }) => {
  if (!outfit) {
    return null; // Don't render the modal if no outfit data is provided
  }

  const handleEditClick = () => {
    handleEdit(outfit); // Call the passed-down edit handler
    handleClose(); // Close the modal after initiating edit
  };

  const handleDeleteClick = () => {
    handleDelete(outfit.id); // Call the passed-down delete handler with outfit ID
    // Modal will be closed by the handleDeleteOutfit function in MyOutfits.js if successful
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Outfit Details: {outfit.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {outfit.date && <p><strong>Date:</strong> {new Date(outfit.date).toLocaleDateString()}</p>}
        
        <h6>Items:</h6>
        {outfit.ClothingItems && outfit.ClothingItems.length > 0 ? (
          <Container>
            <Row xs={2} md={3} lg={4} className="g-3 outfit-view-items-grid">
              {outfit.ClothingItems.map(item => (
                <Col key={item.id} className="outfit-view-item">
                  <Image src={item.imageUrl} alt={item.name} thumbnail className="outfit-view-item-image" />
                  <div className="outfit-view-item-name">
                    {item.name}
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        ) : (
          <p>No items in this outfit.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* Add Edit and Delete buttons here */}
         <Button variant="outline-secondary" className="me-2" onClick={handleEditClick}>
            <FaEdit className="me-1" /> Edit
         </Button>
         <Button variant="outline-danger" onClick={handleDeleteClick}>
            <FaTrash className="me-1" /> Delete
         </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OutfitViewModal; 