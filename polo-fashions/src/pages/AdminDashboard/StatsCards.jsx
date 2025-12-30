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
  customerUsers,
  pendingBookings,
  orders,
  activeOrderStatus,
  onStatusSelect,
}) {
  // Count orders by status
  const countByStatus = (status) =>
    (orders || []).filter((o) => o.status === status).length;

  const STATUS_CARDS = [
    {
      key: "placed",
      label: "Order Placed",
      icon: <CheckCircleOutlined />,
      color: "#1677ff",
    },
    {
      key: "processing",
      label: "Processing",
      icon: <SyncOutlined spin />,
      color: "#1890ff",
    },
    {
      key: "stitching",
      label: "Stitching",
      icon: <ScissorOutlined />,
      color: "#722ed1",
    },
    {
      key: "buttoning",
      label: "Buttoning",
      icon: <ToolOutlined />,
      color: "#13c2c2",
    },
    {
      key: "ironing",
      label: "Ironing",
      icon: <FireOutlined />,
      color: "#faad14",
    },
    {
      key: "ready_for_pickup",
      label: "Ready for Pickup",
      icon: <ShopOutlined />,
      color: "#fa8c16",
    },
    {
      key: "picked_up",
      label: "Picked Up",
      icon: <CheckCircleOutlined />,
      color: "#52c41a",
    },
  ];

  return (
    <>
      {/* ================= MAIN STATS ================= */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Customers"
              value={customerUsers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Pending Bookings"
              value={pendingBookings.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
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

      {/* ================= ORDER STATUS FILTERS ================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {STATUS_CARDS.map((item) => {
          const isActive = activeOrderStatus === item.key;

          return (
            <Col xs={12} sm={8} md={6} lg={3} key={item.key}>
              <Card
                className={`status-card ${isActive ? "active" : ""}`}
                onClick={() =>
                  onStatusSelect(
                    isActive ? "all" : item.key
                  )
                }
                hoverable
              >
                <Statistic
                  title={item.label}
                  value={countByStatus(item.key)}
                  prefix={item.icon}
                  valueStyle={{ color: item.color }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
