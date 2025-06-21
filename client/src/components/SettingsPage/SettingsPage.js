import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import './SettingsPage.css';

const SettingsPage = () => {
  return (
    <Layout>
      <Container className="py-4">
        <h2 className="text-center mb-4">Settings</h2>

        <Row className="justify-content-center">
          <Col md={8}>
            {/* General Settings Section */}
            <Card className="mb-4">
              <Card.Header as="h5">General Settings</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>App Theme</Form.Label>
                    <Form.Control type="text" placeholder="e.g., Light, Dark (Placeholder)" disabled />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Control type="text" placeholder="e.g., English (Placeholder)" disabled />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            {/* Account Settings Section */}
            <Card className="mb-4">
              <Card.Header as="h5">Account Settings</Card.Header>
              <Card.Body>
                 <p>Manage your account information.</p>
                 <Button variant="secondary" disabled>Change Password (Placeholder)</Button>
                 <Button variant="secondary" className="ms-2" disabled>Update Email (Placeholder)</Button>
              </Card.Body>
            </Card>

            {/* Notification Settings Section */}
            <Card className="mb-4">
              <Card.Header as="h5">Notification Settings</Card.Header>
              <Card.Body>
                 <Form>
                    <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Email Notifications (Placeholder)"
                        disabled
                    />
                     <Form.Check 
                        type="switch"
                        id="custom-switch2"
                        label="In-App Notifications (Placeholder)"
                        disabled
                        className="mt-2"
                    />
                 </Form>
              </Card.Body>
            </Card>

            {/* Placeholder for more settings */}
            <Card>
              <Card.Header as="h5">Advanced</Card.Header>
              <Card.Body>
                <p>Other settings options could go here. (Placeholder)</p>
                 <Button variant="outline-danger" disabled>Reset App Data (Placeholder)</Button>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default SettingsPage; 