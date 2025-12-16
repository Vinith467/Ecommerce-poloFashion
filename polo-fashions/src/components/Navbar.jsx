import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Scissors, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function NavigationBar({ currentPage, setCurrentPage }) {
  const { currentUser, bookings, logout } = useAuth();
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
    setCurrentPage("home");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand
          href="#"
          onClick={() => setCurrentPage("home")}
          className="d-flex align-items-center"
        >
          <Scissors className="me-2" size={28} />
          Polo Fashions
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              onClick={() => setCurrentPage("home")}
              active={currentPage === "home"}
            >
              Home
            </Nav.Link>

            <Nav.Link
              onClick={() => setCurrentPage("products")}
              active={currentPage === "products"}
            >
              Products
            </Nav.Link>

            {!currentUser && (
              <>
                <Nav.Link
                  onClick={() => setCurrentPage("login")}
                  active={currentPage === "login"}
                >
                  Login
                </Nav.Link>
                <Button
                  variant="primary"
                  size="sm"
                  className="ms-2"
                  onClick={() => setCurrentPage("register")}
                >
                  Register
                </Button>
              </>
            )}

            {currentUser && (
              <>
                {showBookAppointment && (
                  <Nav.Link
                    onClick={() => setCurrentPage("booking")}
                    active={currentPage === "booking"}
                  >
                    Book Appointment
                  </Nav.Link>
                )}

                <Nav.Link
                  onClick={() =>
                    setCurrentPage(
                      currentUser.role === "admin" ? "admin" : "dashboard"
                    )
                  }
                  active={
                    currentPage === "dashboard" || currentPage === "admin"
                  }
                >
                  <User size={18} className="me-1" />
                  {currentUser.role === "admin" ? "Admin Panel" : "My Account"}
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
