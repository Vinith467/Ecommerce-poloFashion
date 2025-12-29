// src/pages/UserDashboard.jsx
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
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import "./UserDashboard.css";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getOrderImage } from "../utils/imageUtils";

// ✅ SINGLE SOURCE OF TRUTH
import {
  ORDER_STATUS_CONFIG,
  normalizeStatus,
} from "../constants/orderStatus";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { currentUser, bookings = [], orders = [] } = useAuth();

  const userBookings = bookings.filter((b) => b.user === currentUser?.id);
  const userOrders = orders.filter((o) => o.user === currentUser?.id);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  /* ================= BOOKINGS ================= */
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

  /* ================= ORDERS ================= */
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
      render: (_, order) => (
        <Image
          src={getOrderImage(order)}
          alt={order.product_name}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="https://via.placeholder.com/50?text=No+Image"
          preview={false}
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
      render: (type) => (
        <Tag color={ORDER_TYPE_COLORS[type] || "default"}>
          {type?.toUpperCase().replace("-", " ")}
        </Tag>
      ),
    },
    { title: "Qty", dataIndex: "quantity" },
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
      render: (status) => {
        const normalized = normalizeStatus(status);
        const config = ORDER_STATUS_CONFIG[normalized];
        const Icon = config?.icon;

        return (
          <Tag
            color={config?.color || "blue"}
            icon={Icon ? <Icon /> : null}
          >
            {config?.label || status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>
        <UserOutlined /> My Dashboard
      </h2>

      {/* ================= TOP CARDS ================= */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
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

        <Col xs={24} md={8}>
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

        <Col xs={24} md={8}>
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

      {/* ================= BOOKINGS ================= */}
      <Card title="My Appointments" style={{ marginBottom: 24 }}>
        {userBookings.length === 0 ? (
          <Empty description="No appointments yet" />
        ) : (
          <Table
            rowKey="id"
            columns={bookingColumns}
            dataSource={userBookings}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>

      {/* ================= ORDERS ================= */}
      <Card title="My Orders">
        {userOrders.length === 0 ? (
          <Empty description="No orders placed yet">
            <Button type="primary" onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </Empty>
        ) : (
          <>
            {/* DESKTOP */}
            <div className="desktop-orders-table">
              <Table
                rowKey="id"
                columns={orderColumns}
                dataSource={userOrders}
                scroll={{ x: "max-content" }}
              />
            </div>

            {/* MOBILE */}
            <div className="mobile-orders-table">
              {userOrders.map((order) => {
                const normalized = normalizeStatus(order.status);
                const config = ORDER_STATUS_CONFIG[normalized];
                const Icon = config?.icon;

                return (
                  <div key={order.id} className="mobile-order-card">
                    <div className="mobile-order-row">
                      <div className="order-id-mobile">#{order.id}</div>

                      <Image
                        src={getOrderImage(order)}
                        alt={order.product_name}
                        className="order-image-mobile"
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 6 }}
                        fallback="https://via.placeholder.com/60?text=No+Image"
                        preview={false}
                      />

                      <div className="order-status-mobile">
                        <Tag
                          color={config?.color || "blue"}
                          icon={Icon ? <Icon /> : null}
                        >
                          {config?.label || order.status}
                        </Tag>
                      </div>
                    </div>

                    <button
                      className="view-order-btn-mobile"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <EyeOutlined /> View Order Summary
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
