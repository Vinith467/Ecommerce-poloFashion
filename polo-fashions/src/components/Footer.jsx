import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Polo Fashions</h5>
            <p className="text-light opacity-75">
              Your trusted partner for custom tailoring and premium ready-made traditional wear.
            </p>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Contact Info</h5>
            <div className="d-flex align-items-start mb-2">
              <MapPin size={18} className="me-2 mt-1 flex-shrink-0" />
              <span className="text-light opacity-75">
                123 Fashion Street, Bangalore, Karnataka 560001
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Phone size={18} className="me-2" />
              <span className="text-light opacity-75">+91 98765 43210</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Mail size={18} className="me-2" />
              <span className="text-light opacity-75">info@polofashions.com</span>
            </div>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Business Hours</h5>
            <div className="d-flex align-items-start mb-2">
              <Clock size={18} className="me-2 mt-1 flex-shrink-0" />
              <div className="text-light opacity-75">
                <div>Monday - Saturday: 10:00 AM - 8:00 PM</div>
                <div>Sunday: 11:00 AM - 6:00 PM</div>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4 bg-light opacity-25" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-light opacity-75">
              © {new Date().getFullYear()} Polo Fashions. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}