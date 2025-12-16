import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Scissors, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavigationBar() {
  const { currentUser, bookings, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Filter only this user's bookings
  const userBookings =
    bookings?.filter((b) => b.user === currentUser?.id) || [];

  // Determine latest booking (if any)
  const latestBooking =
    userBookings.length > 0 ? userBookings[userBookings.length - 1] : null;

  // Show Book Appointment ONLY if no booking or latest is cancelled
  const showBookAppointment =
    !latestBooking || latestBooking.status === "cancelled";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
        >
          <Scissors className="me-2" size={28} />
          Polo Fashions
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" active={isActive("/")}>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/products" active={isActive("/products")}>
              Products
            </Nav.Link>

            {!currentUser && (
              <>
                <Nav.Link as={Link} to="/login" active={isActive("/login")}>
                  Login
                </Nav.Link>

                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="ms-2"
                >
                  Register
                </Button>
              </>
            )}

            {currentUser && (
              <>
                {showBookAppointment && (
                  <Nav.Link
                    as={Link}
                    to="/booking"
                    active={isActive("/booking")}
                  >
                    Book Appointment
                  </Nav.Link>
                )}

                <Nav.Link
                  as={Link}
                  to={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  active={
                    isActive("/dashboard") || isActive("/admin")
                  }
                >
                  <User size={18} className="me-1" />
                  {currentUser.role === "admin"
                    ? "Admin Panel"
                    : "My Account"}
                </Nav.Link>

                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-1" />
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
