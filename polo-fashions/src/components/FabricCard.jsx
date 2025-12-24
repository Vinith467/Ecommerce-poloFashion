import React from "react";
import { Card, Typography, Badge, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function FabricCard({ fabric, isSelected, onClick, activeCategory }) {
  return (
    <Card
      hoverable
      onClick={() => onClick(fabric)}
      style={{
        height: "100%",
        cursor: "pointer",
        borderRadius: 12,
        border: isSelected ? "2px solid #1677ff" : undefined,
        position: "relative",
      }}
      cover={
        <img
          src={fabric.image}
          alt={fabric.name}
          style={{
            height: 200,
            objectFit: "cover",
          }}
        />
      }
    >
      {/* SELECTED CHECK ICON */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#1677ff",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <CheckOutlined style={{ color: "#fff", fontSize: 18 }} />
        </div>
      )}

      {/* CONTENT */}
      <Space
        align="start"
        style={{ width: "100%", justifyContent: "space-between", marginBottom: 8 }}
      >
        <Title level={5} style={{ margin: 0 }}>
          {fabric.name}
        </Title>

        {/* ✅ BLUE DOT for Custom Fabrics */}
        {activeCategory?.toLowerCase() === "fabrics" && (
          <Space size={6} align="center">
            <Badge color="blue" />
            <Text style={{ fontSize: 14 }}>Custom</Text>
          </Space>
        )}
      </Space>
      

      {/* Additional Info */}
      {fabric.color && (
        <div style={{ marginBottom: 6 }}>
          <Text type="secondary">Color: </Text>
          <Text strong>{fabric.color}</Text>
        </div>
      )}

      {/* Description if available */}
      {fabric.description && (
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          {fabric.description}
        </Text>
      )}

      {/* Price */}
      <Title level={5} style={{ color: "#1677ff", margin: 0 }}>
        ₹{fabric.price}
      </Title>

      {/* Custom pricing note */}
      {activeCategory?.toLowerCase() === "fabrics" && (
        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
          Price varies by fabric selection
        </Text>
      )}
    </Card>
  );
}