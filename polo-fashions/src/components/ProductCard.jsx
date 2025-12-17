import React from "react";
import { Card, Badge, Carousel, Typography, Space } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function ProductCard({ product, onClick }) {
  return (
    <Card
      hoverable
      onClick={() => onClick(product)}
      style={{
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
      }}
      cover={
        <Carousel autoplay dots={false}>
          {product.images && product.images.length > 0 ? (
            product.images.map((img) => (
              <div key={img.id}>
                <img
                  src={img.image}
                  alt="product"
                  style={{
                    height: 220,
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))
          ) : (
            <div>
              <img
                src={product.image}
                alt="product"
                style={{
                  height: 220,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </Carousel>
      }
    >
      {/* HEADER */}
      <Space
        align="start"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Title level={5} style={{ margin: 0 }}>
          {product.name}
        </Title>

        {product.type === "readymade" && (
          <Badge color="green" text="Ready-made" />
        )}
        {product.type === "custom" && (
          <Badge color="blue" text="Custom" />
        )}
      </Space>

      {/* DESCRIPTION */}
      <Paragraph
        type="secondary"
        ellipsis={{ rows: 2 }}
        style={{ marginTop: 8 }}
      >
        {product.description}
      </Paragraph>

      {/* BRAND */}
      {product.brand && (
        <Text type="secondary">
          Brand: <Text strong>{product.brand}</Text>
        </Text>
      )}

      {/* PRICE */}
      {product.price && (
        <Title level={5} style={{ marginTop: 12, color: "#1677ff" }}>
          ₹{product.price}
        </Title>
      )}

      {product.type === "custom" && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          Price varies by fabric selection
        </Text>
      )}
    </Card>
  );
}
