import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ScissorOutlined,
  ToolOutlined,
  FireOutlined,
  ShopOutlined,
} from "@ant-design/icons";

export default function StatsCards({
  customerUsers = [],
  pendingBookings = [],
  orders = [],
  showOrderStatusFilters,
  activeOrderStatus,
  onStatusSelect,
}) {
  const countByStatus = (status) =>
    orders.filter((o) => o.status === status).length;

  /* ================= ORDER STATUS CONFIG ================= */
  const STATUS_CARDS = [
    {
      key: "placed",
      label: "Order Placed",
      color: "#1677ff",
      icon: <CheckCircleOutlined />,
    },
    {
      key: "processing",
      label: "Processing",
      color: "#1890ff",
      icon: <SyncOutlined spin />,
    },
    {
      key: "stitching",
      label: "Stitching",
      color: "#722ed1",
      icon: <ScissorOutlined />,
    },
    {
      key: "buttoning",
      label: "Buttoning",
      color: "#13c2c2",
      icon: <ToolOutlined />,
    },
    {
      key: "ironing",
      label: "Ironing",
      color: "#faad14",
      icon: <FireOutlined />,
    },
    {
      key: "ready_for_pickup",
      label: "Ready for Pickup",
      color: "#fa8c16",
      icon: <ShopOutlined />,
    },
    {
      key: "picked_up",
      label: "Picked Up",
      color: "#52c41a",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <>
      {/* ================= GENERAL STATS ================= */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic
              title="Total Customers"
              value={customerUsers.length}
              prefix={<UserOutlined style={{ color: "#3f8600" }} />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic
              title="Pending Bookings"
              value={pendingBookings.length}
              prefix={<CalendarOutlined style={{ color: "#cf1322" }} />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic
              title="Total Orders"
              value={orders.length}
              prefix={<ShoppingOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* ================= ORDER STATUS FILTERS ================= */}
      {showOrderStatusFilters && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {STATUS_CARDS.map((item) => {
            const isActive = activeOrderStatus === item.key;

            return (
              <Col xs={12} sm={8} md={6} lg={3} key={item.key}>
                <Card
                  className={`stat-card clickable ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() =>
                    onStatusSelect(isActive ? "all" : item.key)
                  }
                >
                  <Statistic
                    title={item.label}
                    value={countByStatus(item.key)}
                    prefix={React.cloneElement(item.icon, {
                      style: { color: item.color },
                    })}
                    valueStyle={{ color: item.color }}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
}
