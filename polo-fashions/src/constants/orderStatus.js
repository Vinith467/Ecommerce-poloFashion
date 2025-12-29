// src/constants/orderStatus.js
import {
  ShoppingOutlined,
  SyncOutlined,
  ScissorOutlined,
  ToolOutlined,
  FireOutlined,
  ShopOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

/**
 * Normalize backend status safely
 */
export const normalizeStatus = (status = "") =>
  status.toLowerCase().trim();

/**
 * Central order status config (NO JSX HERE ❌)
 */
export const ORDER_STATUS_CONFIG = {
  placed: {
    label: "Order Placed",
    color: "#1677ff",
    icon: ShoppingOutlined,
  },

  processing: {
    label: "Processing",
    color: "#1890ff",
    icon: SyncOutlined,
    className: "rotate",
  },

  stitching: {
    label: "Stitching",
    color: "#722ed1",
    icon: ScissorOutlined,
    className: "scissor", // ✂️ cutting motion
  },

  buttoning: {
    label: "Buttoning",
    color: "#13c2c2",
    icon: ToolOutlined,
    className: "tool", // 🔧 wobble
  },

  ironing: {
    label: "Ironing",
    color: "#faad14",
    icon: FireOutlined,
    className: "fire", // 🔥 flicker
  },

  ready_for_pickup: {
    label: "Ready for Pickup",
    color: "#fa8c16",
    icon: ShopOutlined,
    className: "bounce", // 🏪 bounce
  },

  picked_up: {
    label: "Picked Up",
    color: "#52c41a",
    icon: CheckCircleFilled,
    className: "pulse", // ✅ success pulse
  },
};
