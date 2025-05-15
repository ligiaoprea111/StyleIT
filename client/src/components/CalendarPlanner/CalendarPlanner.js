import React, { useState } from 'react';
import './CalendarPlanner.css';
import Layout from '../Layout/Layout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';

const wardrobeCategories = [
  'T-Shirts', 'Shirts', 'Blouses', 'Cardigans', 'Dresses', 'Skirts', 'Pants', 'Jeans', 'Shorts', 'Sweaters', 'Blazers',
  'Belts', 'Jewelry', 'Bags', 'Sunglasses', 'Wallets', 'Scarves', 'Watches', 'Hats', 'Gloves',
  'Sneakers', 'Sandals', 'Heels', 'Boots', 'Flats'
];

const styleTypes = ['Casual', 'Formal', 'Sporty', 'Business', 'Party', 'Other'];
const eventTypes = ['Meeting', 'Party', 'Date', 'Work', 'Other'];

const CalendarPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState('');
  const [styleType, setStyleType] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [events, setEvents] = useState([]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
    setEventTime('');
    setEventType('');
    setStyleType('');
    setSelectedCategories([]);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(cat => cat !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents([...events, {
      date: selectedDate,
      time: eventTime,
      eventType,
      styleType,
      categories: selectedCategories
    }]);
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="calendar-planner-container">
        <h2 className="calendar-planner-title">Calendar Planner</h2>
        <p className="calendar-planner-desc">Click a day to schedule an outfit for a specific event!</p>
        <div className="calendar-wrapper">
          <Calendar onClickDay={handleDayClick} />
        </div>

        {/* Event Creation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Schedule Outfit for {selectedDate && selectedDate.toLocaleDateString()}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Control type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type of Event</Form.Label>
                <Form.Select value={eventType} onChange={e => setEventType(e.target.value)} required>
                  <option value="">Select event type</option>
                  {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type of Style</Form.Label>
                <Form.Select value={styleType} onChange={e => setStyleType(e.target.value)} required>
                  <option value="">Select style type</option>
                  {styleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Wardrobe Categories</Form.Label>
                <div className="categories-list">
                  {wardrobeCategories.map(cat => (
                    <Form.Check
                      key={cat}
                      type="checkbox"
                      label={cat}
                      value={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={handleCategoryChange}
                    />
                  ))}
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Event
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Display scheduled events (for demo) */}
        {events.length > 0 && (
          <div className="scheduled-events mt-4">
            <h4>Scheduled Outfits</h4>
            <ul>
              {events.map((ev, idx) => (
                <li key={idx}>
                  <strong>{ev.date.toLocaleDateString()} {ev.time}</strong>: {ev.eventType}, {ev.styleType}, Categories: {ev.categories.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CalendarPlanner; 