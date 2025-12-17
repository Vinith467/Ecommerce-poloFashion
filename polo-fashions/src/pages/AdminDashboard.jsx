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
  Skeleton,
  Empty,
  Space,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { TabPane } = Tabs;

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
  const [successMessage, setSuccessMessage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const customerUsers = users.filter((u) => u.role === "customer");
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const processingOrders = orders.filter((o) => o.status === "processing");

  const handleOpenMeasurementModal = (user) => {
    setSelectedUser(user);
    setMeasurements(null);
    setSuccessMessage("");
    setShowMeasurementModal(true);
  };

  const handleSaveMeasurements = async () => {
    if (!measurements) return;
    const formData = new FormData();
    formData.append("measurement_photo", measurements);
    await updateUserMeasurement(selectedUser.id, formData);
    setSuccessMessage("Measurements updated successfully!");
    setTimeout(() => setShowMeasurementModal(false), 1500);
  };

  /* ===================== TABLE COLUMNS ===================== */

  const bookingColumns = [
    { title: "ID", dataIndex: "id", render: (id) => `#${id}` },
    { title: "Customer", dataIndex: "customer_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Date", dataIndex: "date" },
    { title: "Time", dataIndex: "time" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "confirmed"
              ? "blue"
              : "orange"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, booking) => (
        <Space>
          {booking.status === "pending" && (
            <>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  updateBookingStatus(booking.id, "confirmed")
                }
              >
                Confirm
              </Button>
              <Button
                size="small"
                onClick={() =>
                  updateBookingStatus(booking.id, "completed")
                }
              >
                Complete
              </Button>
            </>
          )}
          {booking.status === "confirmed" && (
            <Button
              size="small"
              onClick={() =>
                updateBookingStatus(booking.id, "completed")
              }
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const customerColumns = [
    { title: "ID", dataIndex: "id", render: (id) => `#${id}` },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Measurement",
      render: (_, user) =>
        user.measurement_status === "completed" ? (
          <Tag color="green">Completed</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: "Image",
      render: (_, user) =>
        user.measurement_photo ? (
          <Button
            size="small"
            onClick={() => {
              setSelectedImage(
                user.measurement_photo.startsWith("http")
                  ? user.measurement_photo
                  : `http://127.0.0.1:8000${user.measurement_photo}`
              );
              setShowImageModal(true);
            }}
          >
            View
          </Button>
        ) : (
          "—"
        ),
    },
    {
      title: "Actions",
      render: (_, user) => (
        <Button
          size="small"
          type="primary"
          onClick={() => handleOpenMeasurementModal(user)}
        >
          {user.measurement_status === "completed" ? "Update" : "Add"}
        </Button>
      ),
    },
  ];

  const orderColumns = [
    { title: "Order ID", dataIndex: "id", render: (id) => `#${id}` },
    { title: "Customer", dataIndex: "customer_name" },
    { title: "Product", dataIndex: "product_name" },
    { title: "Qty", dataIndex: "quantity" },
    {
      title: "Total",
      dataIndex: "total_price",
      render: (v) => <b>₹{v}</b>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color="blue">{s}</Tag>,
    },
  ];

  /* ===================== UI ===================== */

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>
        <SettingOutlined /> Admin Dashboard
      </h2>

      {/* STATS */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Customers" value={customerUsers.length} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Pending Bookings" value={pendingBookings.length} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Processing Orders" value={processingOrders.length} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Orders" value={orders.length} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* TABS */}
      <Card style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab={`Bookings (${bookings.length})`} key="1">
            {bookings.length === 0 ? (
              <Empty description="No bookings yet" />
            ) : (
              <Table rowKey="id" columns={bookingColumns} dataSource={bookings} />
            )}
          </TabPane>

          <TabPane tab={`Customers (${customerUsers.length})`} key="2">
            {customerUsers.length === 0 ? (
              <Empty description="No customers yet" />
            ) : (
              <Table rowKey="id" columns={customerColumns} dataSource={customerUsers} />
            )}
          </TabPane>

          <TabPane tab={`Orders (${orders.length})`} key="3">
            {orders.length === 0 ? (
              <Empty description="No orders yet" />
            ) : (
              <Table rowKey="id" columns={orderColumns} dataSource={orders} />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* MEASUREMENT MODAL */}
      <Modal
        title={`Upload Measurement - ${selectedUser?.name}`}
        open={showMeasurementModal}
        onCancel={() => setShowMeasurementModal(false)}
        onOk={handleSaveMeasurements}
        okButtonProps={{ disabled: !measurements }}
      >
        {successMessage && <Alert type="success" message={successMessage} />}

        <Upload
          beforeUpload={(file) => {
            setMeasurements(file);
            return false;
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload Photo</Button>
        </Upload>
      </Modal>

      {/* IMAGE VIEW */}
      <Modal
        open={showImageModal}
        footer={null}
        onCancel={() => setShowImageModal(false)}
        width="80%"
      >
        <Image src={selectedImage} />
      </Modal>
    </div>
  );
}
