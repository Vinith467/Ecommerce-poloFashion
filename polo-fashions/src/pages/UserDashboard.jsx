import React from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Statistic,
  Empty,
  Space,
  Image,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { currentUser, bookings = [], orders = [] } = useAuth();

  const userBookings = bookings.filter((b) => b.user === currentUser?.id);
  const userOrders = orders.filter((o) => o.user === currentUser?.id);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ FIXED: Enhanced helper with proper priority for multi-image arrays
  const getOrderImage = (order) => {
    let imageUrl = null;

    // ✅ Priority 1: Check multi-image arrays FIRST (ready-made, traditional, rentals)
    if (order.product_details?.images?.length > 0) {
      imageUrl = order.product_details.images[0].image;
    } else if (order.rental_item_details?.images?.length > 0) {
      imageUrl = order.rental_item_details.images[0].image;
    }
    
    // ✅ Priority 2: Single image fields (fabrics, accessories, innerwear)
    if (!imageUrl) {
      imageUrl = order.fabric_details?.image || 
                 order.rental_item_details?.image ||
                 order.accessory_details?.image ||
                 order.innerwear_details?.image ||
                 order.product_details?.image;
    }

    // ✅ Convert relative URLs to absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${API_BASE_URL}${imageUrl}`;
    }

    // Fallback
    return imageUrl || "https://via.placeholder.com/50?text=No+Image";
  };

  /* ===================== TABLE COLUMNS ===================== */

  const bookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      render: (id) => `#${id}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: formatDate,
    },
    { title: "Time", dataIndex: "time" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          icon={
            status === "completed" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )
          }
          color={
            status === "completed"
              ? "green"
              : status === "confirmed"
              ? "blue"
              : status === "cancelled"
              ? "red"
              : "orange"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const ORDER_TYPE_COLORS = {
    "ready-made": "green",
    custom: "blue",
    fabric: "gold",
    rental: "purple",
    traditional: "cyan",
    accessory: "magenta",
    innerwear: "volcano",
    other: "default",
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      render: (id) => `#${id}`,
    },
    {
      title: "Image",
      key: "image",
      render: (_, order) => (
        <Image
          src={getOrderImage(order)}
          alt={order.product_name}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="https://via.placeholder.com/50?text=No+Image"
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "product_name",
      render: (_, order) => (
        <Link to={`/orders/${order.id}`}>{order.product_name}</Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "product_type",
      render: (type) => {
        const color = ORDER_TYPE_COLORS[type] || "default";
        return <Tag color={color}>{type?.toUpperCase().replace("-", " ")}</Tag>;
      },
    },
    {
      title: "Qty",
      dataIndex: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total_price",
      render: (v) => <strong>₹{v}</strong>,
    },
    {
      title: "Date",
      dataIndex: "order_date",
      render: formatDate,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color="blue">{s.toUpperCase().replace("_", " ")}</Tag>,
    },
  ];

  /* ===================== UI ===================== */

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>
        <UserOutlined /> My Dashboard
      </h2>

      {/* TOP CARDS */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {/* PROFILE */}
        <Col xs={24} sm={24} md={8}>
          <Card title="Profile Information">
            <p>
              <strong>Name:</strong> {currentUser?.username}
            </p>
            <p>
              <strong>Email:</strong> {currentUser?.email}
            </p>
            <p>
              <strong>Phone:</strong> {currentUser?.phone}
            </p>
          </Card>
        </Col>

        {/* MEASUREMENT STATUS */}
       <Col xs={24} sm={12} md={8}>
          <Card title="Measurement Status">
            {currentUser?.measurement_status === "completed" ? (
              <Space direction="vertical">
                <Tag icon={<CheckCircleOutlined />} color="green">
                  Completed
                </Tag>
                <span>Your measurements are saved.</span>
              </Space>
            ) : (
              <Space direction="vertical">
                <Tag icon={<ClockCircleOutlined />} color="orange">
                  Pending
                </Tag>
                <span>Book a measurement appointment.</span>
              </Space>
            )}
          </Card>
        </Col>

        {/* QUICK STATS */}
        <Col xs={24} sm={12} md={8}>
          <Card title="Quick Stats">
            <Statistic
              title="Bookings"
              value={userBookings.length}
              prefix={<CalendarOutlined />}
            />
            <Statistic
              title="Orders"
              value={userOrders.length}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* BOOKINGS */}
      <Card title="My Appointments" style={{ marginBottom: 24 }}>
        {userBookings.length === 0 ? (
          <Empty description="No appointments yet" />
        ) : (
          <Table
            rowKey="id"
            columns={bookingColumns}
            dataSource={userBookings}
          />
        )}
      </Card>

      {/* ORDERS */}
      <Card title="My Orders">
        {userOrders.length === 0 ? (
          <Empty description="No orders placed yet">
            <Button type="primary" onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </Empty>
        ) : (
          <Table rowKey="id" columns={orderColumns} dataSource={userOrders} />
        )}
      </Card>
    </div>
  );
}