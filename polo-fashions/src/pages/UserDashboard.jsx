import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Alert,
  Button,
} from "react-bootstrap";
import {
  User,
  Ruler,
  Calendar,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard({ setCurrentPage }) {
  const { currentUser, bookings = [], orders = [] } = useAuth();

  // -----------------------------
  // FIXED FILTERING (REAL FIX)
  // -----------------------------
  const userBookings = bookings.filter((b) => b.user === currentUser?.id);
  const userOrders = orders.filter((o) => o.user === currentUser?.id);

  // Helper function for formatting dates
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 d-flex align-items-center">
        <User size={32} className="me-2" />
        My Dashboard
      </h2>

      <Row className="g-4 mb-4">
        {/* PROFILE CARD */}
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center">
                <User size={20} className="me-2" />
                Profile Information
              </h5>

              <div className="mb-2">
                <strong>Name:</strong> {currentUser?.username}
              </div>
              <div className="mb-2">
                <strong>Email:</strong> {currentUser?.email}
              </div>
              <div className="mb-2">
                <strong>Phone:</strong> {currentUser?.phone}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* MEASUREMENT STATUS CARD */}
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center">
                <Ruler size={20} className="me-2" />
                Measurement Status
              </h5>

              {currentUser?.measurement_status=== "completed" ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <CheckCircle size={24} className="text-success me-2" />
                    <span className="status-badge status-completed">
                      Completed
                    </span>
                  </div>
                  <p className="text-muted mb-0">
                    Your measurements are saved! You can order custom items.
                  </p>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <Clock size={24} className="text-warning me-2" />
                    <span className="status-badge status-pending">Pending</span>
                  </div>
                  <p className="text-muted mb-0">
                    Book a measurement appointment to get started.
                  </p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* QUICK STATS CARD */}
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Body>
              <h5 className="mb-3">Quick Stats</h5>

              <div className="mb-2">
                <Calendar size={18} className="me-2" />
                <strong>Bookings:</strong> {userBookings.length}
              </div>

              <div className="mb-2">
                <Package size={18} className="me-2" />
                <strong>Orders:</strong> {userOrders.length}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BOOKINGS SECTION */}
      <Card className="dashboard-card mb-4">
        <Card.Body>
          <h5 className="mb-3 d-flex align-items-center">
            <Calendar size={20} className="me-2" />
            My Appointments
          </h5>

          {!bookings || bookings.length === 0 ? (
            <Alert variant="info">Loading your appointments...</Alert>
          ) : userBookings.length === 0 ? (
            <Alert variant="info">
              No appointments yet. Book one to get started!
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {userBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{formatDate(booking.date)}</td>
                      <td>{booking.time}</td>
                      <td>
                        <Badge
                          bg={
                            booking.status === "completed"
                              ? "success"
                              : booking.status === "confirmed"
                              ? "primary"
                              : booking.status === "cancelled"
                              ? "danger"
                              : "warning"
                          }
                          className="text-capitalize d-flex align-items-center gap-1"
                        >
                          {booking.status === "completed" && (
                            <CheckCircle size={14} />
                          )}
                          {booking.status === "confirmed" && (
                            <CheckCircle size={14} />
                          )}
                          {booking.status === "pending" && <Clock size={14} />}
                          {booking.status === "cancelled" && <X size={14} />}
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ORDERS SECTION */}
      <Card className="dashboard-card">
        <Card.Body>
          <h5 className="mb-3 d-flex align-items-center">
            <Package size={20} className="me-2" />
            My Orders
          </h5>

          {userOrders.length === 0 ? (
            <Alert variant="info">
              No orders placed yet!
              <div className="mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentPage("products")}
                >
                  Browse Products
                </Button>
              </div>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {userOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.product_name}</td>
                      <td>
                        <Badge
                          bg={
                            order.product_type === "custom"
                              ? "primary"
                              : "success"
                          }
                        >
                          {order.product_type}
                        </Badge>
                      </td>
                      <td>{order.quantity}</td>
                      <td className="text-primary fw-bold">
                        ₹{order.total_price}
                      </td>
                      <td>{formatDate(order.order_date)}</td>
                      <td>
                        <Badge bg="info">{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
