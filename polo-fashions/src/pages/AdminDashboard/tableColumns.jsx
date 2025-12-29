import React from "react";
import { Tag, Button, Space, Select } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { normalizeImageUrl } from "../../utils/imageUtils";

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

export const getBookingColumns = (handleUpdateBookingStatus) => [
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
        {booking.status === "completed" && <Tag color="green">Finished</Tag>}
      </Space>
    ),
  },
];

export const getCustomerColumns = (handleOpenMeasurementModal, onViewImage) => [
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
          onClick={() => onViewImage(user.measurement_photo)}
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

export const getOrderColumns = (handleOrderStatusUpdate, navigate) => [
  {
    title: "Order ID",
    dataIndex: "id",
    key: "id",
    render: (id) => (
      <a
        onClick={() => navigate(`/admin/orders/${id}`)}
        style={{ color: "#1677ff", cursor: "pointer", fontWeight: 500 }}
      >
        #{id}
      </a>
    ),
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
    render: (product_name, record) => (
      <a
        onClick={() => navigate(`/admin/orders/${record.id}`)}
        style={{ color: "#1677ff", cursor: "pointer" }}
      >
        {product_name}
      </a>
    ),
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
    render: (price) => <strong style={{ color: "#1677ff" }}>₹{price}</strong>,
  },
  {
    title: "Date",
    dataIndex: "order_date",
    key: "order_date",
    render: formatDate,
  },
  {
    title: "Status",
    key: "status",
    render: (_, order) => {
      const nextStatuses = getNextStatuses(order);

      return (
        <Space direction="vertical">
          <Tag color={ORDER_STATUS_COLORS[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Tag>

          {nextStatuses.length > 0 && (
            <Select
              size="small"
              placeholder="Update status"
              style={{ width: 180 }}
              onChange={(value) => handleOrderStatusUpdate(order.id, value)}
            >
              {nextStatuses.map((status) => (
                <Select.Option key={status} value={status}>
                  {ORDER_STATUS_LABELS[status]}
                </Select.Option>
              ))}
            </Select>
          )}
        </Space>
      );
    },
  },
];
