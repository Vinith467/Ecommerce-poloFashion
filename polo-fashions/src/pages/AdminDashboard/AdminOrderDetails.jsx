import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Descriptions,
  Image,
  Tag,
  Button,
  Spin,
  Alert,
  Divider,
  Space,
  Select,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  UserOutlined,
  ScissorOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";

const ORDER_STATUS_LABELS = {
  placed: "Placed",
  processing: "Processing",
  stitching: "Stitching",
  buttoning: "Buttoning",
  ironing: "Ironing",
  ready_for_pickup: "Ready for Pickup",
  picked_up: "Picked Up",
  returned: "Returned",
  deposit_refunded: "Deposit Refunded",
  cancelled: "Cancelled",
};

const ORDER_STATUS_COLORS = {
  placed: "default",
  processing: "blue",
  stitching: "purple",
  buttoning: "cyan",
  ironing: "gold",
  ready_for_pickup: "orange",
  picked_up: "green",
  returned: "volcano",
  deposit_refunded: "lime",
  cancelled: "red",
};

const ORDER_STATUS_FLOW = {
  placed: ["processing"],
  processing: ["stitching", "ready_for_pickup"],
  stitching: ["buttoning"],
  buttoning: ["ironing"],
  ironing: ["ready_for_pickup"],
  ready_for_pickup: ["picked_up"],
  picked_up: ["returned"],
  returned: ["deposit_refunded"],
};

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { updateOrderStatus } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      message.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      message.success("Order status updated successfully");
      fetchOrderDetails(); // Refresh data
    } catch (err) {
      message.error(
        err?.response?.data?.error || "Failed to update order status"
      );
    }
  };

  const getNextStatuses = (currentStatus) => {
    let next = ORDER_STATUS_FLOW[currentStatus] || [];

    // Rental-only protection
    if (!order?.rental_days || order.rental_days === 0) {
      next = next.filter((s) => s !== "returned" && s !== "deposit_refunded");
    }

    return next;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f0f2f5",
        }}
      >
        <Spin size="large" tip="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin")}
          style={{ marginBottom: 24 }}
        >
          Back to Dashboard
        </Button>
        <Alert
          message="Error"
          description={error || "Order not found"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const nextStatuses = getNextStatuses(order.status);

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin")}
          style={{ marginBottom: 16 }}
        >
          Back to Dashboard
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
              <ShoppingOutlined style={{ marginRight: 12 }} />
              Order #{order.id}
            </h1>
            <p style={{ color: "#666", marginTop: 8 }}>
              Complete order and tailoring information
            </p>
          </div>
          <div>
            <Tag
              color={ORDER_STATUS_COLORS[order.status]}
              style={{ fontSize: 16, padding: "8px 16px" }}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </Tag>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* 🧵 Order Details */}
          <Card
            title={
              <Space>
                <ShoppingOutlined />
                <span>Order Details</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Order ID" span={2}>
                <strong>#{order.id}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {order.customer_name || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {order.customer_phone || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Order Type">
                <Tag color="blue">{order.product_type?.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {formatDate(order.order_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                {order.quantity || 1}
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                <strong style={{ color: "#1677ff", fontSize: 18 }}>
                  ₹{order.total_price}
                </strong>
              </Descriptions.Item>
              {order.rental_days > 0 && (
                <>
                  <Descriptions.Item label="Rental Days">
                    {order.rental_days} days
                  </Descriptions.Item>
                  <Descriptions.Item label="Deposit Amount">
                    ₹{order.deposit_amount || 0}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Card>

          {/* 👕 Product Details */}
          <Card
            title={
              <Space>
                <ShoppingOutlined />
                <span>Product Details</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Row gutter={24}>
              {/* Product Image */}
              {order.product_details?.image && (
                <Col xs={24} md={8}>
                  <Image
                    src={order.product_details.image}
                    alt={order.product_name}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      border: "1px solid #d9d9d9",
                    }}
                  />
                </Col>
              )}

              {/* Product Info */}
              <Col xs={24} md={order.product_details?.image ? 16 : 24}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Product Name">
                    <strong>{order.product_name || "—"}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Category">
                    {order.product_details?.category || "—"}
                  </Descriptions.Item>
                  {order.product_details?.brand && (
                    <Descriptions.Item label="Brand">
                      {order.product_details.brand}
                    </Descriptions.Item>
                  )}
                  {order.product_details?.color && (
                    <Descriptions.Item label="Color">
                      {order.product_details.color}
                    </Descriptions.Item>
                  )}
                  {order.product_details?.description && (
                    <Descriptions.Item label="Description">
                      {order.product_details.description}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* 📏 Tailoring Details */}
          {(order.product_type === "traditional" ||
            order.fabric_details ||
            order.product_details?.size) && (
            <Card
              title={
                <Space>
                  <ScissorOutlined />
                  <span>Tailoring Details</span>
                </Space>
              }
            >
              <Descriptions column={2} bordered>
                {/* Ready-made Size */}
                {order.product_type === "ready_made" &&
                  order.product_details?.size && (
                    <Descriptions.Item label="Size" span={2}>
                      <Tag color="blue" style={{ fontSize: 16, padding: "4px 12px" }}>
                        {order.product_details.size}
                      </Tag>
                    </Descriptions.Item>
                  )}

                {/* Traditional/Custom Details */}
                {order.product_type === "traditional" && (
                  <>
                    {order.fabric_details?.name && (
                      <Descriptions.Item label="Fabric Name">
                        <strong>{order.fabric_details.name}</strong>
                      </Descriptions.Item>
                    )}
                    {order.fabric_details?.meters && (
                      <Descriptions.Item label="Meters Required">
                        {order.fabric_details.meters} meters
                      </Descriptions.Item>
                    )}
                    {order.fabric_details?.stitch_type && (
                      <Descriptions.Item label="Stitch Type" span={2}>
                        <Tag color="purple">
                          {order.fabric_details.stitch_type}
                        </Tag>
                      </Descriptions.Item>
                    )}
                  </>
                )}

                {/* Measurement Status */}
                <Descriptions.Item label="Measurement Status" span={2}>
                  {order.measurement_status === "completed" ? (
                    <Tag
                      icon={<CheckCircleOutlined />}
                      color="success"
                      style={{ fontSize: 14, padding: "4px 12px" }}
                    >
                      COMPLETED
                    </Tag>
                  ) : (
                    <Tag
                      icon={<ClockCircleOutlined />}
                      color="warning"
                      style={{ fontSize: 14, padding: "4px 12px" }}
                    >
                      PENDING
                    </Tag>
                  )}
                </Descriptions.Item>

                {/* Notes */}
                {order.notes && (
                  <Descriptions.Item label="Special Notes" span={2}>
                    <Alert
                      message={order.notes}
                      type="info"
                      showIcon
                      style={{ marginTop: 8 }}
                    />
                  </Descriptions.Item>
                )}
              </Descriptions>

              {/* Warning for Pending Measurements */}
              {order.measurement_status !== "completed" &&
                order.product_type === "traditional" && (
                  <Alert
                    message="⚠️ Measurement Pending"
                    description="Customer measurements are not completed. Please complete measurements before starting tailoring to avoid mistakes."
                    type="warning"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
            </Card>
          )}
        </Col>

        {/* Right Column - Actions */}
        <Col xs={24} lg={8}>
          <Card title="Order Actions" style={{ position: "sticky", top: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {/* Status Update */}
              {nextStatuses.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: 12 }}>Update Status</h4>
                  <Select
                    placeholder="Select new status"
                    style={{ width: "100%" }}
                    size="large"
                    onChange={handleStatusUpdate}
                  >
                    {nextStatuses.map((status) => (
                      <Select.Option key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              <Divider />

              {/* Customer Info */}
              <div>
                <h4 style={{ marginBottom: 12 }}>
                  <UserOutlined /> Customer Info
                </h4>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Name">
                    {order.customer_name || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {order.customer_phone || "—"}
                  </Descriptions.Item>
                  {order.customer_email && (
                    <Descriptions.Item label="Email">
                      {order.customer_email}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>

              {/* Measurement Alert */}
              {order.product_type === "traditional" && (
                <>
                  <Divider />
                  <Alert
                    message="Tailoring Checklist"
                    description={
                      <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                        <li>Verify customer measurements</li>
                        <li>Check fabric availability</li>
                        <li>Confirm stitch type</li>
                        <li>Review special notes</li>
                      </ul>
                    }
                    type="info"
                    showIcon
                  />
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}