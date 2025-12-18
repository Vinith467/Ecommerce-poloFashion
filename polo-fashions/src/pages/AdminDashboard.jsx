import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Modal,
  Upload,
  Alert,
  Tabs,
  Statistic,
  Image,
  Empty,
  Space,
  message,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
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
  const [measurements, setMeasurements] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ FIX: Filter customer users safely
  const customerUsers = (users || []).filter((u) => u.role === "customer");
  const pendingBookings = (bookings || []).filter((b) => b.status === "pending");
  const processingOrders = (orders || []).filter((o) => o.status === "processing");

  const handleOpenMeasurementModal = (user) => {
    setSelectedUser(user);
    setMeasurements(null);
    setShowMeasurementModal(true);
  };

  const handleSaveMeasurements = async () => {
    if (!measurements) {
      message.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("measurement_photo", measurements);

    const result = await updateUserMeasurement(selectedUser.id, formData);
    setUploading(false);

    if (result.success) {
      message.success("Measurements updated successfully!");
      setShowMeasurementModal(false);
      setMeasurements(null);
    } else {
      message.error("Failed to update measurements");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.success) {
      message.success(`Booking ${newStatus}!`);
    } else {
      message.error("Failed to update booking");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  /* ===================== TABLE COLUMNS ===================== */

  const bookingColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
      width: 80,
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: formatDate,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          pending: { color: "orange", icon: <ClockCircleOutlined /> },
          confirmed: { color: "blue", icon: <CheckCircleOutlined /> },
          completed: { color: "green", icon: <CheckCircleOutlined /> },
          cancelled: { color: "red", icon: null },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Tag icon={config.icon} color={config.color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, booking) => (
        <Space>
          {booking.status === "pending" && (
            <>
              <Button
                size="small"
                type="primary"
                onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
              >
                Confirm
              </Button>
              <Button
                size="small"
                onClick={() => handleUpdateBookingStatus(booking.id, "completed")}
              >
                Complete
              </Button>
            </>
          )}
          {booking.status === "confirmed" && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleUpdateBookingStatus(booking.id, "completed")}
            >
              Complete
            </Button>
          )}
          {booking.status === "completed" && (
            <Tag color="green">Finished</Tag>
          )}
        </Space>
      ),
    },
  ];

  const customerColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
      width: 80,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "—",
    },
    {
      title: "Measurement",
      key: "measurement",
      render: (_, user) => {
        const isCompleted = user.measurement_status === "completed";
        return (
          <Tag
            icon={isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            color={isCompleted ? "green" : "orange"}
          >
            {isCompleted ? "Completed" : "Pending"}
          </Tag>
        );
      },
    },
    {
      title: "Image",
      key: "image",
      render: (_, user) =>
        user.measurement_photo ? (
          <Button
            size="small"
            onClick={() => {
              const imageUrl = user.measurement_photo.startsWith("http")
                ? user.measurement_photo
                : `http://127.0.0.1:8000${user.measurement_photo}`;
              setSelectedImage(imageUrl);
              setShowImageModal(true);
            }}
          >
            View
          </Button>
        ) : (
          <span style={{ color: "#999" }}>—</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <Button
          size="small"
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => handleOpenMeasurementModal(user)}
        >
          {user.measurement_status === "completed" ? "Update" : "Upload"}
        </Button>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
      width: 100,
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      render: (qty) => qty || 1,
    },
    {
      title: "Total",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => (
        <strong style={{ color: "#1677ff" }}>₹{price}</strong>
      ),
    },
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
      render: formatDate,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors = {
          processing: "blue",
          confirmed: "cyan",
          in_production: "purple",
          ready: "orange",
          completed: "green",
          cancelled: "red",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {status.toUpperCase().replace(/_/g, " ")}
          </Tag>
        );
      },
    },
  ];

  /* ===================== UI ===================== */

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          <SettingOutlined style={{ marginRight: 12 }} />
          Admin Dashboard
        </h1>
        <p style={{ color: "#666", marginTop: 8 }}>
          Manage customers, bookings, and orders
        </p>
      </div>

      {/* STATS */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={customerUsers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Bookings"
              value={pendingBookings.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Processing Orders"
              value={processingOrders.length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={(orders || []).length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* TABS */}
      <Card>
        <Tabs
          defaultActiveKey="bookings"
          items={[
            {
              key: "bookings",
              label: `📅 Bookings (${(bookings || []).length})`,
              children:
                bookings.length === 0 ? (
                  <Empty
                    description="No bookings yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <Table
                    rowKey="id"
                    columns={bookingColumns}
                    dataSource={bookings}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1000 }}
                  />
                ),
            },
            {
              key: "customers",
              label: `👥 Customers (${customerUsers.length})`,
              children:
                customerUsers.length === 0 ? (
                  <Empty
                    description="No customers yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <Table
                    rowKey="id"
                    columns={customerColumns}
                    dataSource={customerUsers}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1000 }}
                  />
                ),
            },
            {
              key: "orders",
              label: `🛍️ Orders (${(orders || []).length})`,
              children:
                orders.length === 0 ? (
                  <Empty
                    description="No orders yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <Table
                    rowKey="id"
                    columns={orderColumns}
                    dataSource={orders}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1200 }}
                  />
                ),
            },
          ]}
        />
      </Card>

      {/* MEASUREMENT UPLOAD MODAL */}
      <Modal
        title={
          <Space>
            <UploadOutlined />
            <span>Upload Measurement - {selectedUser?.username}</span>
          </Space>
        }
        open={showMeasurementModal}
        onCancel={() => {
          setShowMeasurementModal(false);
          setMeasurements(null);
        }}
        onOk={handleSaveMeasurements}
        confirmLoading={uploading}
        okText="Upload"
        okButtonProps={{ disabled: !measurements }}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "#666", marginBottom: 12 }}>
            Upload customer measurement photo for future custom orders.
          </p>

          {selectedUser?.measurement_photo && (
            <Alert
              type="info"
              message="Current measurement photo exists"
              description="Uploading a new photo will replace the existing one."
              showIcon
              style={{ marginBottom: 12 }}
            />
          )}
        </div>

        <Upload
          beforeUpload={(file) => {
            // Validate file type
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              message.error("You can only upload image files!");
              return false;
            }

            // Validate file size (max 5MB)
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
              message.error("Image must be smaller than 5MB!");
              return false;
            }

            setMeasurements(file);
            return false; // Prevent auto upload
          }}
          onRemove={() => setMeasurements(null)}
          maxCount={1}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} block>
            Select Image File
          </Button>
        </Upload>

        {measurements && (
          <Alert
            type="success"
            message={`Selected: ${measurements.name}`}
            style={{ marginTop: 12 }}
          />
        )}
      </Modal>

      {/* IMAGE VIEWER MODAL */}
      <Modal
        open={showImageModal}
        footer={null}
        onCancel={() => {
          setShowImageModal(false);
          setSelectedImage(null);
        }}
        width="80%"
        centered
      >
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Measurement"
            style={{ width: "100%" }}
            preview={false}
          />
        )}
      </Modal>
    </div>
  );
}