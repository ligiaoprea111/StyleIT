import React, { useState, useEffect } from 'react';
import './CalendarPlanner.css';
import Layout from '../Layout/Layout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Alert, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CalendarPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [userOutfits, setUserOutfits] = useState([]);
  const [scheduledOutfit, setScheduledOutfit] = useState(null);
  const [loadingScheduledOutfit, setLoadingScheduledOutfit] = useState(false);
  const [scheduledOutfitError, setScheduledOutfitError] = useState(null);

  const [showOutfitSelectModal, setShowOutfitSelectModal] = useState(false);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [schedulingError, setSchedulingError] = useState(null);

  useEffect(() => {
    const fetchUserOutfits = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId) {
        console.error('User ID not found in local storage.');
        return;
      }
      if (!token) {
        console.error('JWT token not found in local storage.');
        return;
      }
      try {
        const response = await axios.get('/api/outfits', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserOutfits(response.data);
      } catch (error) {
        console.error('Error fetching user outfits:', error);
      }
    };
    fetchUserOutfits();
  }, []);

  useEffect(() => {
    const fetchScheduledOutfit = async () => {
      if (!selectedDate) {
        setScheduledOutfit(null);
        setScheduledOutfitError(null);
        return;
      }
      setLoadingScheduledOutfit(true);
      setScheduledOutfit(null);
      setScheduledOutfitError(null);

      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId) {
        console.error('User ID not found for fetching scheduled outfit.');
        setScheduledOutfitError('User not logged in.');
        setLoadingScheduledOutfit(false);
        return;
      }
      if (!token) {
        console.error('JWT token not found for fetching scheduled outfit.');
        setScheduledOutfitError('User not authenticated.');
        setLoadingScheduledOutfit(false);
        return;
      }

      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      try {
        console.log(`Fetching scheduled outfit for user ${userId} on ${formattedDate} at /api/scheduled-outfits/${userId}/${formattedDate}`);
        const response = await axios.get(`/api/scheduled-outfits/${userId}/${formattedDate}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setScheduledOutfit(response.data);
      } catch (error) {
        console.error(`Error fetching scheduled outfit for ${formattedDate}:`, error);
        if (error.response && error.response.status === 404) {
          setScheduledOutfit(null);
        } else {
          setScheduledOutfitError('Failed to fetch scheduled outfit.');
        }
      } finally {
        setLoadingScheduledOutfit(false);
      }
    };

    fetchScheduledOutfit();
  }, [selectedDate]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleShowOutfitSelectModal = () => setShowOutfitSelectModal(true);
  const handleCloseOutfitSelectModal = () => {
    setShowOutfitSelectModal(false);
    setSchedulingError(null);
  };

  const handleOutfitSelectAndSchedule = async (outfitId) => {
    if (!selectedDate || !outfitId) {
      console.error('Date or Outfit ID missing for scheduling.');
      setSchedulingError('Could not schedule outfit: missing information.');
      return;
    }
    setSchedulingLoading(true);
    setSchedulingError(null);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!token) {
       console.error('JWT token not found for scheduling.');
       setSchedulingError('Authentication token missing. Please log in.');
       setSchedulingLoading(false);
       return;
    }

    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      console.log(`Attempting to schedule outfit ${outfitId} for user ${userId} on ${formattedDate}`);
      await axios.post('/api/scheduled-outfits', {
        id_user: userId,
        id_outfit: outfitId,
        scheduled_date: formattedDate,
      }, {
         headers: {
           'Authorization': `Bearer ${token}`
         }
      });
      console.log('Outfit scheduled successfully.');
      handleCloseOutfitSelectModal();
      setSelectedDate(new Date(selectedDate.getTime()));
    } catch (error) {
      console.error('Error scheduling outfit:', error);
      setSchedulingError(error.response?.data?.message || 'Failed to schedule outfit.');
    } finally {
      setSchedulingLoading(false);
    }
  };

  return (
    <Layout>
      <div className="calendar-planner-container">
        <h2 className="calendar-planner-title">Calendar Planner</h2>
        <p className="calendar-planner-desc">Click a day to see your scheduled outfit or schedule one!</p>
        
        <div className="calendar-wrapper">
          <Calendar
            onClickDay={handleDayClick}
            value={selectedDate}
          />
        </div>

        {selectedDate && (
            <div className="scheduled-outfit-section mt-4">
                <h4>Outfit for {selectedDate.toLocaleDateString()}</h4>

                {loadingScheduledOutfit && <p>Loading outfit...</p>}
                {scheduledOutfitError && <Alert variant="danger">{scheduledOutfitError}</Alert>}

                {!loadingScheduledOutfit && !scheduledOutfitError && (
                    scheduledOutfit ? (
                        <div>
                            <p><strong>Outfit:</strong> {scheduledOutfit.name || `Outfit ${scheduledOutfit.id}`}</p>
                            {scheduledOutfit.image_url && (
                                <img src={scheduledOutfit.image_url} alt={scheduledOutfit.name || 'Scheduled Outfit'} style={{ maxWidth: '200px', height: 'auto' }} />
                            )}
                            {scheduledOutfit.ClothingItems && scheduledOutfit.ClothingItems.length > 0 && (
                                <div className="mt-3">
                                    <h6>Items:</h6>
                                    <div className="d-flex flex-wrap">
                                        {scheduledOutfit.ClothingItems.map(item => (
                                            <div key={item.id} className="me-2 mb-2 outfit-item-display">
                                                {item.imageUrl && (
                                                    <img src={item.imageUrl} alt={item.name || 'Item'} style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                                )}
                                                <p className="text-center" style={{ fontSize: '0.8em' }}>{item.name || 'Item'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p>No outfit set for this day.</p>
                            <div>
                                <Link to="/create-outfit" className="btn btn-primary me-2">Create New Outfit for this Date</Link>
                                <Button variant="secondary" onClick={handleShowOutfitSelectModal} disabled={userOutfits.length === 0 || !userOutfits}>
                                    {userOutfits && userOutfits.length === 0 ? 'No Outfits Available' : 'Select Existing Outfit'}
                                </Button>
                                {!userOutfits && <p className="text-danger">Could not load outfits for selection.</p>}
                            </div>
                        </div>
                    )
                )}
            </div>
        )}

        <Modal show={showOutfitSelectModal} onHide={handleCloseOutfitSelectModal} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select an Outfit to Schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {schedulingLoading && <p>Scheduling outfit...</p>}
                {schedulingError && <Alert variant="danger">{schedulingError}</Alert>}
                 {!schedulingLoading && !schedulingError && userOutfits && userOutfits.length > 0 && (
                     <div>
                         <p>Select an outfit from your wardrobe to schedule for {selectedDate && selectedDate.toLocaleDateString()}.</p>
                         <div className="outfit-selection-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {userOutfits.map(outfit => (
                                <div key={outfit.id} className="outfit-item d-flex align-items-center mb-3 p-2 border rounded">
                                    {outfit.image_url && (
                                        <img src={outfit.image_url} alt={outfit.name || 'Outfit'} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                                    )}
                                    <span>{outfit.name || `Outfit ${outfit.id}`}</span>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="ms-auto" 
                                        onClick={() => handleOutfitSelectAndSchedule(outfit.id)}
                                        disabled={schedulingLoading}
                                    >
                                        Select
                                    </Button>
                                </div>
                            ))}
                         </div>
                     </div>
                 )}
                 {!schedulingLoading && !schedulingError && userOutfits && userOutfits.length === 0 && (
                     <Alert variant="info">You don't have any outfits in your wardrobe yet. Create one first!</Alert>
                 )}
                  {!schedulingLoading && !schedulingError && !userOutfits && (
                     <Alert variant="warning">Could not load your outfit list. Please try again later.</Alert>
                 )}
            </Modal.Body>
             <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseOutfitSelectModal} disabled={schedulingLoading}>Cancel</Button>
            </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default CalendarPlanner; 