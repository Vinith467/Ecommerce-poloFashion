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
  showOrderStatusFilters,
  activeOrderStatus,
  onStatusSelect,
}) {
  const countByStatus = (status) =>
    (orders || []).filter((o) => o.status === status).length;

  const STATUS_CARDS = [
    { key: "placed", label: "Order Placed", icon: <CheckCircleOutlined /> },
    { key: "processing", label: "Processing", icon: <SyncOutlined spin /> },
    { key: "stitching", label: "Stitching", icon: <ScissorOutlined /> },
    { key: "buttoning", label: "Buttoning", icon: <ToolOutlined /> },
    { key: "ironing", label: "Ironing", icon: <FireOutlined /> },
    { key: "ready_for_pickup", label: "Ready for Pickup", icon: <ShopOutlined /> },
    { key: "picked_up", label: "Picked Up", icon: <CheckCircleOutlined /> },
  ];

  return (
    <>
      {/* ===== GENERAL STATS ===== */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic title="Total Customers" value={customerUsers.length} prefix={<UserOutlined />} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic title="Pending Bookings" value={pendingBookings.length} prefix={<CalendarOutlined />} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic title="Total Orders" value={(orders || []).length} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* ===== ORDER STATUS FILTERS (ONLY ON ORDERS TAB) ===== */}
      {showOrderStatusFilters && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {STATUS_CARDS.map((item) => (
            <Col xs={12} sm={8} md={6} lg={3} key={item.key}>
              <Card
                className={`stat-card clickable ${
                  activeOrderStatus === item.key ? "active" : ""
                }`}
                onClick={() =>
                  onStatusSelect(
                    activeOrderStatus === item.key ? "all" : item.key
                  )
                }
              >
                <Statistic
                  title={item.label}
                  value={countByStatus(item.key)}
                  prefix={item.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
