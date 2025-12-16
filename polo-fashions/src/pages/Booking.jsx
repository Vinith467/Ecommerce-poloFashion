import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Booking() {
  const navigate = useNavigate();

  const { currentUser, addBooking } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.username || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    date: '',
    time: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!currentUser) {
      setError('Please login to book an appointment');
      return;
    }

    if (currentUser.measurementStatus === 'completed') {
      setError('You already have measurements on file. You can start shopping!');
      return;
    }

    const result = await addBooking(formData);
    if (result.success) {
      setSuccess(result.message);
      setFormData({ ...formData, date: '', time: '' });
      
      setTimeout(() => {
         navigate('/dashboard');
      }, 2000);
    }
  };

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="warning" className="text-center">
              <h4>Login Required</h4>
              <p>Please login to book an appointment for measurements</p>
              <Button variant="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <Calendar size={48} className="text-primary mb-3" />
                <h2>Book Measurement Appointment</h2>
                <p className="text-muted">
                  Schedule your visit to our shop for professional measurements
                </p>
              </div>

              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              {currentUser.measurementStatus === 'completed' ? (
                <Alert variant="info" className="text-center">
                  <h5>You're all set!</h5>
                  <p>Your measurements are already on file. You can start shopping for custom tailored clothes!</p>
                  <Button variant="primary" onClick={() => navigate('/products')}>
                    Browse Products
                  </Button>
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <User size={18} className="me-2" />
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          readOnly={!!currentUser}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Phone size={18} className="me-2" />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          readOnly={!!currentUser}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <Calendar size={18} className="me-2" />
                      Preferred Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <Clock size={18} className="me-2" />
                      Preferred Time Slot
                    </Form.Label>
                    <Form.Select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" size="lg">
                    Book Appointment
                  </Button>
                </Form>
              )}

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2">What to Expect:</h6>
                <ul className="mb-0 text-muted small">
                  <li>Appointment duration: 15-20 minutes</li>
                  <li>Professional measurements for perfect fit</li>
                  <li>One-time visit required</li>
                  <li>Shop online anytime after measurement</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}