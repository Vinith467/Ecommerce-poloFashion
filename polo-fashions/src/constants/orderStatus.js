import {
  ShoppingOutlined,
  SyncOutlined,
  ToolOutlined,
  ScissorOutlined,
  FireOutlined,
  ShoppingBagOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

/**
 * Normalize backend status safely
 */
export const normalizeStatus = (status = "") =>
  status.toLowerCase().trim();

/**
 * Central order status config
 */
export const ORDER_STATUS_CONFIG = {
  placed: {
    label: "Order Placed",
    color: "#1677ff",
    icon: <ShoppingOutlined />,
  },
  processing: {
    label: "Processing",
    color: "#1890ff",
    icon: <SyncOutlined spin />,
  },
  stitching: {
    label: "Stitching",
    color: "#722ed1",
    icon: <ScissorOutlined />,
  },
  buttoning: {
    label: "Buttoning",
    color: "#13c2c2",
    icon: <ToolOutlined />,
  },
  ironing: {
    label: "Ironing",
    color: "#faad14",
    icon: <FireOutlined />,
  },
  ready_for_pickup: {
    label: "Ready for Pickup",
    color: "#fa8c16",
    icon: <ShoppingBagOutlined />,
  },
  picked_up: {
    label: "Picked Up",
    color: "#52c41a",
    icon: <CheckCircleFilled />,
  },
};
