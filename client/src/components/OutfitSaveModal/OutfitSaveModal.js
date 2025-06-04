import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const OutfitSaveModal = ({ show, handleClose, handleSave, selectedItemsCount, initialName, initialDate }) => {
  const [outfitName, setOutfitName] = useState('');
  const [outfitDate, setOutfitDate] = useState('');

  useEffect(() => {
    if (show) {
      setOutfitName(initialName || '');
      setOutfitDate(initialDate || '');
    } else {
      setOutfitName('');
      setOutfitDate('');
    }
  }, [show, initialName, initialDate]);

  const onSave = () => {
    handleSave(outfitName, outfitDate);
  };

  const onCancel = () => {
    handleClose();
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{initialName ? 'Edit Outfit' : 'Save Outfit'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="outfitName">
            <Form.Label>Outfit Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter outfit name"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="outfitDate">
            <Form.Label>Date (Optional)</Form.Label>
            <Form.Control
              type="date"
              value={outfitDate}
              onChange={(e) => setOutfitDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={!outfitName}>
          {initialName ? 'Update Outfit' : 'Save Outfit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OutfitSaveModal; 