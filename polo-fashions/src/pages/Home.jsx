import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Scissors, Calendar, Package, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <h1>Welcome to Polo Fashions</h1>
          <p>Where Traditional Craftsmanship Meets Modern Convenience</p>
          <Button
            variant="light"
            size="lg"
            onClick={() => navigate("/products")}
          >
            Explore Our Collection
          </Button>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Why Choose Polo Fashions?</h2>
        <Row className="g-4">
          <Col md={3}>
            <Card className="feature-card text-center p-4">
              <div className="feature-icon">
                <Scissors size={30} />
              </div>
              <Card.Body>
                <Card.Title>Custom Tailoring</Card.Title>
                <Card.Text>
                  Perfectly tailored clothes made to your exact measurements
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="feature-card text-center p-4">
              <div className="feature-icon">
                <Ruler size={30} />
              </div>
              <Card.Body>
                <Card.Title>One-Time Measurement</Card.Title>
                <Card.Text>
                  Visit us once for measurements, then shop online anytime
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="feature-card text-center p-4">
              <div className="feature-icon">
                <Package size={30} />
              </div>
              <Card.Body>
                <Card.Title>Premium Brands</Card.Title>
                <Card.Text>
                  Ready-made traditional wear from Ramraj, DSP, and more
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="feature-card text-center p-4">
              <div className="feature-icon">
                <Calendar size={30} />
              </div>
              <Card.Body>
                <Card.Title>Easy Booking</Card.Title>
                <Card.Text>
                  Book your measurement appointment online in seconds
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How It Works Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div className="display-4 text-primary fw-bold mb-3">1</div>
                <h4>Register & Book</h4>
                <p className="text-muted">
                  Create an account and book an appointment for measurements
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="display-4 text-primary fw-bold mb-3">2</div>
                <h4>Visit Our Shop</h4>
                <p className="text-muted">
                  Come to our store once for professional measurements
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="display-4 text-primary fw-bold mb-3">3</div>
                <h4>Shop Online</h4>
                <p className="text-muted">
                  Browse fabrics and order custom-tailored clothes online
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="py-5 text-center">
        <h2 className="mb-4">Ready to Get Started?</h2>
        <p className="lead text-muted mb-4">
          Join hundreds of satisfied customers who trust Polo Fashions for their
          tailoring needs
        </p>
        <Button
          variant="primary"
          size="lg"
          className="me-3"
          onClick={() => navigate("/register")}
        >
          Register Now
        </Button>
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => navigate("/booking")}
        >
          Book Appointment
        </Button>
      </Container>
    </div>
  );
}
