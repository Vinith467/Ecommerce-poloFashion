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

const { Title, Text } = Typography;
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
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

const getCurrentStepIndex = (order) => {
  const steps = [
    ...ORDER_STEPS,
    ...(order.rental_days > 0 ? RENTAL_EXTRA_STEPS : []),
  ];

  return steps.indexOf(order.status);
};

export default function OrderTracking() {
  const { id } = useParams();
  const { orders } = useAuth();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === Number(id));

  if (!order) {
    return <Text>Order not found</Text>;
  }

  const steps = [
    ...ORDER_STEPS,
    ...(order.rental_days > 0 ? RENTAL_EXTRA_STEPS : []),
  ];

  const currentStep = getCurrentStepIndex(order);

  // ✅ FIXED: Enhanced helper with proper priority for multi-image arrays
  const getOrderImage = (order) => {
    let imageUrl = null;

    // ✅ Priority 1: Check multi-image arrays FIRST (ready-made, traditional, rentals)
    if (order.product_details?.images?.length > 0) {
      imageUrl = order.product_details.images[0].image;
    } else if (order.rental_item_details?.images?.length > 0) {
      imageUrl = order.rental_item_details.images[0].image;
    }
    
    // ✅ Priority 2: Single image fields (fabrics, accessories, innerwear)
    if (!imageUrl) {
      imageUrl = order.fabric_details?.image || 
                 order.rental_item_details?.image ||
                 order.accessory_details?.image ||
                 order.innerwear_details?.image ||
                 order.product_details?.image;
    }

    // ✅ Convert relative URLs to absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${API_BASE_URL}${imageUrl}`;
    }

    // Fallback
    return imageUrl || "https://via.placeholder.com/120?text=No+Image";
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 800, margin: "auto" }}>
        <Button
          shape="circle"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        />

        <Title level={3}>Order #{order.id}</Title>

        {/* Product Info */}
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

        {/* STATUS TRACKING */}
        <Steps
          direction="vertical"
          current={currentStep}
          items={steps.map((status, index) => ({
            title: STATUS_LABELS[status],
            status:
              index < currentStep
                ? "finish"
                : index === currentStep
                ? "process"
                : "wait",
          }))}
        />
        <Divider />

        <Title level={4}>Order Details</Title>

        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Product">
            {order.product_name}
          </Descriptions.Item>

          <Descriptions.Item label="Quantity">
            {order.quantity}
          </Descriptions.Item>

          <Descriptions.Item label="Order Date">
            {new Date(order.order_date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Descriptions.Item>

          {/* READY-MADE */}
          {order.size && (
            <Descriptions.Item label="Size">
              <Tag color="blue">{order.size}</Tag>
            </Descriptions.Item>
          )}

          {/* FABRIC */}
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

          {/* STITCHING */}
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

          {/* RENTAL */}
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

          {/* NOTES */}
          {order.notes && (
            <Descriptions.Item label="Notes">{order.notes}</Descriptions.Item>
          )}

          <Descriptions.Item label="Total Price">
            <strong>₹{order.total_price}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}