import React from "react";
import { Card, Typography, Badge } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function FabricCard({ fabric, isSelected, onClick }) {
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
            objectPosition:"center"
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
      <Title level={5} style={{ marginBottom: 8 }}>
        {fabric.name}
      </Title>

      <div style={{ marginBottom: 6 }}>
        <Text type="secondary">Type: </Text>
        <Text strong>{fabric.type}</Text>
      </div>

      <div style={{ marginBottom: 10 }}>
        <Text type="secondary">Color: </Text>
        <Text strong>{fabric.color}</Text>
      </div>

      <Title level={5} style={{ color: "#1677ff", margin: 0 }}>
        ₹{fabric.price}
      </Title>
    </Card>
  );
}
