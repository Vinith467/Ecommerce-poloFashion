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
import { ordersAPI } from "../../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const normalizeImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/120?text=No+Image";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? url : "/" + url}`;
};

// ✅ Helper to get order image with proper priority
const getOrderImage = (order) => {
  if (!order) return "https://via.placeholder.com/120?text=No+Image";
  
  let imageUrl = null;

  // Priority 1: Multi-image arrays
  if (order.product_details?.images?.length > 0) {
    imageUrl = order.product_details.images[0].image;
  } else if (order.rental_item_details?.images?.length > 0) {
    imageUrl = order.rental_item_details.images[0].image;
  }

  // Priority 2: Single image fields
  if (!imageUrl) {
    imageUrl =
      order.fabric_details?.image ||
      order.rental_item_details?.image ||
      order.accessory_details?.image ||
      order.innerwear_details?.image ||
      order.product_details?.image;
  }

  return normalizeImageUrl(imageUrl);
};

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
      const data = await ordersAPI.getById(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch order:", err);
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
      fetchOrderDetails();
    } catch (err) {
      message.error(
        err?.response?.data?.error || "Failed to update order status"
      );
    }
  };

  const getNextStatuses = (currentStatus) => {
    let next = ORDER_STATUS_FLOW[currentStatus] || [];

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
        <Col xs={24} lg={16}>
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
              <Descriptions.Item label="Product Name">
                {order.product_name || "—"}
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
                    ₹{order.rental_deposit || 0}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Card>

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
              <Col xs={24} md={8}>
                <Image
                  src={getOrderImage(order)}
                  alt={order.product_name}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid #d9d9d9",
                  }}
                  fallback="https://via.placeholder.com/120?text=No+Image"
                />
              </Col>

              <Col xs={24} md={16}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Product Name">
                    <strong>{order.product_name || "—"}</strong>
                  </Descriptions.Item>
                  {order.size && (
                    <Descriptions.Item label="Size">
                      <Tag color="blue">{order.size}</Tag>
                    </Descriptions.Item>
                  )}
                  {order.fabric_name && (
                    <Descriptions.Item label="Fabric">
                      {order.fabric_name}
                    </Descriptions.Item>
                  )}
                  {order.meters && (
                    <Descriptions.Item label="Meters">
                      {order.meters} m
                    </Descriptions.Item>
                  )}
                  {order.stitch_type && (
                    <Descriptions.Item label="Stitch Type">
                      {order.stitch_type.toUpperCase()}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Order Actions" style={{ position: "sticky", top: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
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

              <div>
                <h4 style={{ marginBottom: 12 }}>
                  <UserOutlined /> Customer Info
                </h4>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Name">
                    {order.customer_name || "—"}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}