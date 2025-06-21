import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Layout from '../Layout/Layout';
import OutfitSaveModal from '../OutfitSaveModal/OutfitSaveModal';

const AIAssistant = () => {
    const [activeTab, setActiveTab] = useState('outfit');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [response, setResponse] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Outfit recommendation state
    const [outfitParams, setOutfitParams] = useState({
        occasion: '',
        style: '',
        weather: ''
    });

    // Style advice state
    const [styleQuestion, setStyleQuestion] = useState('');

    // General text generation state (Removed)
    // const [prompt, setPrompt] = useState('');

    // Get the auth token
    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const handleOutfitSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResponse('');
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }
            const requestBody = {
                userId: userId,
                ...outfitParams
            };
            const response = await axios.post('/api/generate-outfit', requestBody, getAuthHeader());
            console.log('Backend response data:', response.data);
            let data = response.data;
            let parsed = null;
            if (typeof data === 'string') {
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    // fallback: try to extract JSON
                    const match = data.match(/\{[\s\S]*\}/);
                    if (match) {
                        try {
                            parsed = JSON.parse(match[0]);
                        } catch (err) {
                            setError('Failed to parse AI response as JSON.');
                            setResponse(data);
                            setLoading(false);
                            return;
                        }
                    } else {
                        setError('Failed to parse AI response as JSON.');
                        setResponse(data);
                        setLoading(false);
                        return;
                    }
                }
            } else if (typeof data === 'object' && data.items) {
                parsed = data;
            }
            if (parsed) {
                setResponse(parsed);
            } else {
                setResponse(data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to get outfit recommendation');
            setResponse(err.response?.data?.raw || '');
        }
        setLoading(false);
    };

    const handleStyleAdviceSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/ai/style-advice', { question: styleQuestion }, getAuthHeader());
            setResponse(response.data.advice);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to get style advice');
        }
        setLoading(false);
    };

    const handleSaveOutfit = async (outfitName, outfitDate) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            setError('User not logged in.');
            return;
        }

        if (!response || !response.items || response.items.length === 0) {
            setError('No outfit items to save.');
            return;
        }

        const itemIds = response.items.map(item => item.id);

        try {
            // First, save the outfit to the general outfits list
            const saveOutfitResponse = await axios.post('/api/outfits', {
                name: outfitName,
                date: outfitDate || null,
                itemIds: itemIds
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Outfit saved successfully:', saveOutfitResponse.data);
            
            const savedOutfitId = saveOutfitResponse.data.id;

            let schedulingSuccessful = true;

            // If a date was provided, also schedule the outfit
            if (outfitDate) {
                try {
                    await axios.post('/api/scheduled-outfits', {
                        id_user: userId,
                        id_outfit: savedOutfitId,
                        scheduled_date: outfitDate
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log(`Outfit ${savedOutfitId} successfully scheduled for ${outfitDate}`);
                } catch (scheduleError) {
                    schedulingSuccessful = false;
                    console.error('Error scheduling outfit:', scheduleError);
                    setError('Outfit saved, but failed to schedule it for the selected date.');
                }
            }

            // Only show success message if scheduling was successful or no date was provided
            if (schedulingSuccessful) {
                 setSuccessMessage(outfitDate ? `Outfit saved and scheduled for ${outfitDate}!` : 'Outfit saved successfully!');
            }

            setShowSaveModal(false);

            // Clear messages after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
                setError(''); // Also clear error message after a delay
            }, 3000);

        } catch (err) {
            console.error('Error saving outfit:', err);
            setError(err.response?.data?.error || 'Failed to save outfit.');
        }
    };

    return (
        <Layout>
            <Container className="py-4">
                <h2 className="text-center mb-4">AI Style Assistant</h2>
                
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-center">
                            <Button 
                                variant={activeTab === 'outfit' ? 'primary' : 'outline-primary'} 
                                className="mx-2"
                                onClick={() => { setActiveTab('outfit'); setResponse(''); }}
                            >
                                Outfit Recommendation
                            </Button>
                            <Button 
                                variant={activeTab === 'advice' ? 'primary' : 'outline-primary'} 
                                className="mx-2"
                                onClick={() => { setActiveTab('advice'); setResponse(''); }}
                            >
                                Style Advice
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                {activeTab === 'outfit' && (
                                    <Form onSubmit={handleOutfitSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Occasion</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g., casual, formal, party"
                                                value={outfitParams.occasion}
                                                onChange={(e) => setOutfitParams({...outfitParams, occasion: e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Style</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g., modern, classic, bohemian"
                                                value={outfitParams.style}
                                                onChange={(e) => setOutfitParams({...outfitParams, style: e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Weather</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g., sunny, rainy, cold"
                                                value={outfitParams.weather}
                                                onChange={(e) => setOutfitParams({...outfitParams, weather: e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? 'Generating...' : 'Get Outfit Recommendation'}
                                        </Button>
                                    </Form>
                                )}

                                {activeTab === 'advice' && (
                                    <Form onSubmit={handleStyleAdviceSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Your Style Question</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Ask me how to find pieces that match your unique style, get recommendations based on your existing wardrobe, or even explore a new look!"
                                                value={styleQuestion}
                                                onChange={(e) => setStyleQuestion(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? 'Generating...' : 'Get Style Advice'}
                                        </Button>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h5 className="mb-3">Response</h5>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                                {activeTab === 'outfit' && response && typeof response === 'object' && response.items && response.explanation && (
                                    <div>
                                        <h6>Recommended Items:</h6>
                                        <ul>
                                            {response.items.map((item, idx) => (
                                                <li key={item.id || idx}>
                                                    <b>{item.name}</b> ({item.category}{item.subCategory ? `, ${item.subCategory}` : ''})
                                                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{maxWidth:'50px',marginLeft:'8px'}} />}
                                                </li>
                                            ))}
                                        </ul>
                                        <p><b>Explanation:</b> {response.explanation}</p>
                                        <Button 
                                            variant="success" 
                                            onClick={() => setShowSaveModal(true)}
                                            className="mt-3"
                                        >
                                            Save Outfit
                                        </Button>
                                    </div>
                                )}
                                
                                {activeTab === 'advice' && response ? (
                                    <div className="response-content">
                                        {typeof response === 'string' ? response.split('\n').map((line, i) => {
                                            // Simple markdown-like formatting for bolding
                                            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                            return <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                                        }) : JSON.stringify(response, null, 2) // Display non-string responses as JSON for debugging
                                        }
                                    </div>
                                ) : null}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <OutfitSaveModal
                show={showSaveModal}
                handleClose={() => setShowSaveModal(false)}
                handleSave={handleSaveOutfit}
                selectedItemsCount={response?.items?.length || 0}
            />
        </Layout>
    );
};

export default AIAssistant; 