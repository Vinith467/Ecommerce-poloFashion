import React from "react";
import { Card, Badge } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

export default function ProductCard({ product, onClick }) {
  return (
    <Card className="product-card h-100" onClick={() => onClick(product)}>
      <Carousel indicators={false} interval={2000}>
        {product.images && product.images.length > 0 ? (
          product.images.map((img) => (
            <Carousel.Item key={img.id}>
              <img
                className="d-block w-100"
                src={img.image}
                alt="product"
                style={{
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img
              src={product.image}
              className="d-block w-100"
              style={{ height: "220px", objectFit: "cover" }}
            />
          </Carousel.Item>
        )}
      </Carousel>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{product.name}</Card.Title>
          {product.type === "readymade" && (
            <Badge bg="success">Ready-made</Badge>
          )}
          {product.type === "custom" && <Badge bg="primary">Custom</Badge>}
        </div>

        <Card.Text className="text-muted">{product.description}</Card.Text>

        {product.brand && (
          <div className="mb-2">
            <small className="text-muted">Brand: </small>
            <strong>{product.brand}</strong>
          </div>
        )}

        {product.price && (
          <h5 className="text-primary mb-0">₹{product.price}</h5>
        )}

        {product.type === "custom" && (
          <small className="text-muted">Price varies by fabric selection</small>
        )}
      </Card.Body>
    </Card>
  );
}
