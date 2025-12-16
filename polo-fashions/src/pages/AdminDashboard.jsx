import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  Users,
  Calendar,
  Package,
  Settings,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const {
    users,
    bookings,
    orders,
    updateBookingStatus,
    updateUserMeasurement,
  } = useAuth();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [measurements, setMeasurements] = useState(null); // Changed from object to null
  const [successMessage, setSuccessMessage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const customerUsers = users.filter((u) => u.role === "customer");
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const processingOrders = orders.filter((o) => o.status === "processing");

  const handleOpenMeasurementModal = (user) => {
    setSelectedUser(user);
    if (user.measurement_photo) {
      setMeasurements(user.measurement_photo);
    } else {
      setMeasurements(null);
    }
    setShowMeasurementModal(true);
    setSuccessMessage("");
  };

  const handleSaveMeasurements = async () => {
    if (!measurements) return;

    const formData = new FormData();
    formData.append("measurement_photo", measurements); // field name MUST match backend

    await updateUserMeasurement(selectedUser.id, formData);

    setSuccessMessage("Measurements updated successfully!");
    setTimeout(() => {
      setShowMeasurementModal(false);
      setSuccessMessage("");
    }, 1500);
  };

  const handleUpdateBookingStatus = (bookingId, status) => {
    updateBookingStatus(bookingId, status);
  };
  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setShowImageModal(false);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">
        <Settings size={32} className="me-2" />
        Admin Dashboard
      </h2>

      {/* Stats Section */}
      <div className="admin-stats mb-4">
        <Row className="g-3">
          <Col md={3}>
            <div className="stat-card text-center">
              <Users size={32} className="mb-2" />
              <h3 className="mb-0">{customerUsers.length}</h3>
              <div>Total Customers</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card text-center">
              <Calendar size={32} className="mb-2" />
              <h3 className="mb-0">{pendingBookings.length}</h3>
              <div>Pending Bookings</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card text-center">
              <Package size={32} className="mb-2" />
              <h3 className="mb-0">{processingOrders.length}</h3>
              <div>Processing Orders</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card text-center">
              <Package size={32} className="mb-2" />
              <h3 className="mb-0">{orders.length}</h3>
              <div>Total Orders</div>
            </div>
          </Col>
        </Row>
      </div>

      <Tabs defaultActiveKey="bookings" className="mb-4">
        {/* Bookings Tab */}
        <Tab eventKey="bookings" title={`Bookings (${bookings.length})`}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="mb-3">
                <Calendar size={20} className="me-2" />
                Appointment Bookings
              </h5>

              {bookings.length === 0 ? (
                <Alert variant="info">No bookings yet.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>#{booking.id}</td>
                          <td>{booking.customer_name}</td>
                          <td>{booking.email}</td>
                          <td>{booking.phone}</td>
                          <td>{booking.date}</td>
                          <td>{booking.time}</td>
                          <td>
                            <Badge
                              bg={
                                booking.status === "completed"
                                  ? "success"
                                  : booking.status === "confirmed"
                                  ? "info"
                                  : "warning"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </td>
                          <td>
                            {booking.status === "pending" && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "confirmed"
                                    )
                                  }
                                >
                                  Confirm
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "completed"
                                    )
                                  }
                                >
                                  Complete
                                </Button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "completed"
                                  )
                                }
                              >
                                Complete
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Customers Tab */}
        <Tab eventKey="customers" title={`Customers (${customerUsers.length})`}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="mb-3">
                <Users size={20} className="me-2" />
                Customer Management
              </h5>

              {customerUsers.length === 0 ? (
                <Alert variant="info">No customers yet.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Measurement Status</th>
                        <th>Measurement Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {customerUsers.map((user) => (
                        <tr key={user.id}>
                          <td>#{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>
                            {user.measurement_status === "completed" ? (
                              <Badge bg="success">
                                <CheckCircle size={14} className="me-1" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge bg="warning">Pending</Badge>
                            )}
                          </td>
                          <td>
                            {user.measurement_photo ? (
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() =>
                                  openImageModal(
                                    user.measurement_photo.startsWith("http")
                                      ? user.measurement_photo
                                      : `http://127.0.0.1:8000${user.measurement_photo}`
                                  )
                                }
                              >
                                View
                              </Button>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>

                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleOpenMeasurementModal(user)}
                            >
                              {user.measurement_status === "completed"
                                ? "Update"
                                : "Add"}{" "}
                              Measurements
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Orders Tab */}
        <Tab eventKey="orders" title={`Orders (${orders.length})`}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="mb-3">
                <Package size={20} className="me-2" />
                Order Management
              </h5>

              {orders.length === 0 ? (
                <Alert variant="info">No orders yet.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customer_name}</td>
                          <td>
                            <div>{order.product_name}</div>
                            {order.fabric_name && (
                              <small className="text-muted">
                                Fabric: {order.fabric_name}
                              </small>
                            )}
                            {order.size && (
                              <small className="text-muted">
                                Size: {order.size}
                              </small>
                            )}
                          </td>
                          <td>
                            <Badge
                              bg={
                                order.stitch_type === "custom"
                                  ? "primary"
                                  : "success"
                              }
                            >
                              {order.stitch_type}
                            </Badge>
                          </td>
                          <td>{order.quantity}</td>
                          <td className="text-primary fw-bold">
                            ₹{order.total_price}
                          </td>
                          <td>{order.order_date}</td>
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
        </Tab>
      </Tabs>
      {/* Measurement Modal */}
      <Modal
        show={showMeasurementModal}
        onHide={() => setShowMeasurementModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Upload Measurement Photo - {selectedUser?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Alert variant="info">
            <strong>Instructions:</strong> Take a clear photo of the measurement
            page from your physical book and upload it here. The customer will
            NOT be able to view this photo - they will only see that
            measurements are completed.
          </Alert>

          {selectedUser?.measurement_photo && (
            <div className="mb-3">
              <h6>Current Measurement Photo:</h6>
              <img
                src={selectedUser.measurement_photo}
                alt="Current measurements"
                className="img-fluid rounded border"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Upload Measurement Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setMeasurements(file); // ✅ store File object
                }
              }}
            />
            <Form.Text className="text-muted">
              Accepted formats: JPG, PNG, HEIC. Maximum size: 5MB
            </Form.Text>
          </Form.Group>
          {measurements instanceof File && (
            <div className="mt-3">
              <h6>Preview:</h6>
              <img
                src={URL.createObjectURL(measurements)}
                alt="Preview"
                className="img-fluid rounded border"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowMeasurementModal(false)}
          >
            <X size={18} className="me-1" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveMeasurements}
            disabled={!measurements}
          >
            <CheckCircle size={18} className="me-1" />
            Save Measurement Photo
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Full Screen Measurement Image Modal */}
      <Modal show={showImageModal} onHide={closeImageModal} fullscreen>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Measurement Image</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-dark d-flex justify-content-center align-items-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Measurement"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
