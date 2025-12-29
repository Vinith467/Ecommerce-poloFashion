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

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { getOrderImage } from "../utils/imageUtils";

const { Title, Text } = Typography;

/* ================== HELPERS ================== */
const normalizeStatus = (status) => (status ? status.toLowerCase() : "");

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

const STATUS_LABELS = {
  placed: "Order Placed",
  processing: "Processing",
  stitching: "Stitching",
  buttoning: "Buttoning",
  ironing: "Ironing",
  ready_for_pickup: "Ready for Pickup",
  picked_up: "Picked Up",
  returned: "Returned",
  deposit_refunded: "Deposit Refunded",
};

const STATUS_COLORS = {
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

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 800, margin: "auto" }}>
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
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Order #{order.id}
          </Title>

          <Tag
            color={STATUS_COLORS[normalizedStatus] || "blue"}
            style={{ fontSize: 13, padding: "4px 10px", fontWeight: 500 }}
          >
            {STATUS_LABELS[normalizedStatus] || order.status}
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
          items={steps.map((status, index) => ({
            title: STATUS_LABELS[status] || status,
            status:
              index < currentStep
                ? "finish"
                : index === currentStep
                ? "process"
                : "wait",
          }))}
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

          {Number(order.meters) > 0 && (
            <Descriptions.Item label="Meters">
              {order.meters} m
            </Descriptions.Item>
          )}

          {order.stitch_type && (
            <Descriptions.Item label="Stitch Type">
              {order.stitch_type.toUpperCase()}
            </Descriptions.Item>
          )}

          {Number(order.stitching_charge) > 0 && (
            <Descriptions.Item label="Stitching Charge">
              ₹{order.stitching_charge}
            </Descriptions.Item>
          )}

          {order.rental_days > 0 && (
            <>
              <Descriptions.Item label="Rental Days">
                {order.rental_days} days
              </Descriptions.Item>
              <Descriptions.Item label="Rental Deposit">
                ₹{order.rental_deposit}
              </Descriptions.Item>
            </>
          )}

          {order.notes && (
            <Descriptions.Item label="Notes">
              {order.notes}
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Total Price">
            <strong>₹{order.total_price}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
