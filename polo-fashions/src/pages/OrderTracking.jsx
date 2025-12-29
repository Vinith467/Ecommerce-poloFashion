// src/pages/OrderTracking.jsx
import React from "react";
import {
  Steps,
  Card,
  Typography,
  Image,
  Descriptions,
  Divider,
  Tag,
  Button,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrderImage } from "../utils/imageUtils";
import {
  ORDER_STATUS_CONFIG,
  normalizeStatus,
} from "../constants/orderStatus";

const { Title, Text } = Typography;

/* ================== CONSTANTS ================== */
const ORDER_STEPS = [
  "placed",
  "processing",
  "stitching",
  "buttoning",
  "ironing",
  "ready_for_pickup",
  "picked_up",
];

const RENTAL_EXTRA_STEPS = ["returned", "deposit_refunded"];

const getCurrentStepIndex = (order) => {
  const steps = [
    ...ORDER_STEPS,
    ...(order.rental_days > 0 ? RENTAL_EXTRA_STEPS : []),
  ];
  return steps.indexOf(normalizeStatus(order.status));
};

/* ================== COMPONENT ================== */
export default function OrderTracking() {
  const { id } = useParams();
  const { orders } = useAuth();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === Number(id));
  if (!order) return <Text>Order not found</Text>;

  const steps = [
    ...ORDER_STEPS,
    ...(order.rental_days > 0 ? RENTAL_EXTRA_STEPS : []),
  ];

  const currentStep = getCurrentStepIndex(order);
  const normalizedStatus = normalizeStatus(order.status);
  const headerConfig = ORDER_STATUS_CONFIG[normalizedStatus];

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 800, margin: "auto" }}>
        {/* BACK */}
        <Button
          shape="circle"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Order #{order.id}
          </Title>

          <Tag
            color={headerConfig?.color}
            icon={headerConfig?.icon}
            style={{ fontSize: 14, padding: "4px 12px" }}
          >
            {headerConfig?.label}
          </Tag>
        </div>

        {/* PRODUCT INFO */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <Image
            width={120}
            src={getOrderImage(order)}
            alt={order.product_name}
            fallback="https://via.placeholder.com/120?text=No+Image"
          />
          <div>
            <Text strong>{order.product_name}</Text>
            <br />
            <Text>Qty: {order.quantity}</Text>
            <br />
            <Text>Total: ₹{order.total_price}</Text>
          </div>
        </div>

        {/* STATUS STEPS */}
        <Steps
          direction="vertical"
          current={currentStep}
          items={steps.map((status, index) => {
            const normalized = normalizeStatus(status);
            const config = ORDER_STATUS_CONFIG[normalized];
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return {
              title: config?.label,
              icon: (
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    backgroundColor:
                      isCompleted || isCurrent
                        ? config?.color
                        : "#f0f0f0",
                    color:
                      isCompleted || isCurrent ? "#fff" : "#999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: isCurrent
                      ? "0 0 0 5px rgba(0,0,0,0.06)"
                      : "none",
                  }}
                >
                  {isCompleted ? (
                    <CheckCircleFilled />
                  ) : (
                    config?.icon
                  )}
                </div>
              ),
              status: isCompleted
                ? "finish"
                : isCurrent
                ? "process"
                : "wait",
            };
          })}
        />

        <Divider />

        {/* ORDER DETAILS */}
        <Title level={4}>Order Details</Title>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Product">
            {order.product_name}
          </Descriptions.Item>
          <Descriptions.Item label="Quantity">
            {order.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {new Date(order.order_date).toLocaleDateString("en-IN")}
          </Descriptions.Item>
          <Descriptions.Item label="Total Price">
            <strong>₹{order.total_price}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
