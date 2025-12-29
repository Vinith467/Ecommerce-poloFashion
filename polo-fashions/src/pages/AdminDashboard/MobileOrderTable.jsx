import React from "react";
import { Tag, Select, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

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
// src/pages/AdminDashboard/tableColumns.jsx

const getNextStatuses = (order) => {
  // Map backend order_type to our flow logic
  const orderType = order.order_type;

  // Rental orders
  if (order.rental_days > 0) {
    const RENTAL_FLOW = {
      placed: ["processing"],
      processing: ["ready_for_pickup"],
      ready_for_pickup: ["picked_up"],
      picked_up: ["returned"],
      returned: ["deposit_refunded"],
    };
    return RENTAL_FLOW[order.status] || [];
  }

  // Ready-made, accessory, innerwear
  if (["ready_made", "accessory", "innerwear"].includes(orderType)) {
    const READYMADE_FLOW = {
      placed: ["processing"],
      processing: ["ready_for_pickup"],
      ready_for_pickup: ["picked_up"],
    };
    return READYMADE_FLOW[order.status] || [];
  }

  // Custom/Fabric with stitching
  if (
    orderType === "fabric_with_stitching" ||
    (orderType === "traditional" && order.stitch_type)
  ) {
    const CUSTOM_FLOW = {
      placed: ["processing"],
      processing: ["stitching"],
      stitching: ["buttoning"],
      buttoning: ["ironing"],
      ironing: ["ready_for_pickup"],
      ready_for_pickup: ["picked_up"],
    };
    return CUSTOM_FLOW[order.status] || [];
  }

  // Fabric only (no stitching)
  if (orderType === "fabric_only") {
    const SIMPLE_FLOW = {
      placed: ["processing"],
      processing: ["ready_for_pickup"],
      ready_for_pickup: ["picked_up"],
    };
    return SIMPLE_FLOW[order.status] || [];
  }

  // Default fallback
  return [];
};
export default function MobileOrderTable({
  orders,
  onUpdateStatus,
  onNavigate,
}) {
  return (
    <div className="mobile-cards-view">
      {orders.map((order) => {
        const nextStatuses = getNextStatuses(order);

        return (
          <div key={order.id} className="mobile-order-card">
            {/* HEADER */}
            <div className="order-card-header">
              <span className="order-id-mobile">#{order.id}</span>
              <div className="order-product-info">
                <div className="order-product-name" title={order.product_name}>
                  {order.product_name}
                </div>
                <div className="order-customer-name">{order.customer_name}</div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="order-card-details">
              <div className="order-detail-row">
                <span className="order-detail-label">Quantity</span>
                <span className="order-detail-value">{order.quantity}</span>
              </div>

              <div className="order-detail-row">
                <span className="order-detail-label">Total</span>
                <span
                  className="order-detail-value"
                  style={{ color: "#1677ff" }}
                >
                  ₹{order.total_price}
                </span>
              </div>

              <div className="order-detail-row">
                <span className="order-detail-label">Date</span>
                <span className="order-detail-value">
                  {formatDate(order.order_date)}
                </span>
              </div>
            </div>

            {/* STATUS SECTION */}
            <div className="order-status-section">
              <div style={{ marginBottom: 8 }}>
                <span className="booking-label">Current Status</span>
              </div>
              <Tag
                color={ORDER_STATUS_COLORS[order.status]}
                style={{ marginBottom: nextStatuses.length > 0 ? 8 : 0 }}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </Tag>

              {nextStatuses.length > 0 && (
                <>
                  <div style={{ marginTop: 8, marginBottom: 8 }}>
                    <span className="booking-label">Update Status</span>
                  </div>
                  <Select
                    placeholder="Select new status"
                    style={{ width: "100%" }}
                    size="large"
                    onChange={(value) => onUpdateStatus(order.id, value)}
                    className="mobile-action-btn"
                  >
                    {nextStatuses.map((status) => (
                      <Select.Option key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </Select.Option>
                    ))}
                  </Select>
                </>
              )}
            </div>

            {/* VIEW DETAILS BUTTON */}
            <Button
              type="primary"
              icon={<EyeOutlined />}
              block
              size="large"
              onClick={() => onNavigate(`/admin/orders/${order.id}`)}
              className="mobile-action-btn"
              style={{
                marginTop: 12,
                background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
              }}
            >
              View Full Details
            </Button>
          </div>
        );
      })}
    </div>
  );
}
