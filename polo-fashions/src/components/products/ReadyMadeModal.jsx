import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Alert,
  Row,
  Col,
  Typography,
  Select,
  InputNumber,
  Divider,
  Space,
} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

const { Text, Paragraph } = Typography;

export default function ReadyMadeModal({
  show,
  onHide,
  selectedProduct,
  currentUser,
  addOrder,
}) {
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  // ✅ RESET STATE when modal opens/closes or product changes
  useEffect(() => {
    if (show && selectedProduct) {
      setSelectedSize("");
      setQuantity(1);
      setOrderError("");
      setOrderSuccess("");
      setPlacing(false);
    }
  }, [show, selectedProduct]);

  const handlePlaceOrder = async () => {
    setOrderError("");
    setOrderSuccess("");

    if (!currentUser) {
      setOrderError("Please login to place an order");
      return;
    }

    if (!selectedProduct) {
      setOrderError("No product selected");
      return;
    }

    if (!selectedSize) {
      setOrderError("Please select a size");
      return;
    }

    // ✅ FIXED: Ensure orderType is included
    const orderData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      orderType: "readymade", // ✅ CRITICAL
      quantity,
      size: selectedSize,
      totalPrice: selectedProduct.price * quantity,
    };

    console.log("📦 Ready-made order data:", orderData);

    try {
      setPlacing(true);
      const result = await addOrder(orderData);
      setPlacing(false);

      if (result.success) {
        setOrderSuccess("Order placed successfully!");
        setTimeout(() => {
          onHide();
          navigate("/dashboard");
        }, 1200);
      } else {
        setOrderError(result.message || "Failed to place order");
      }
    } catch (error) {
      setPlacing(false);
      console.error("❌ Order error:", error);
      setOrderError(error?.response?.data?.detail || "Failed to place order");
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width="90vw" // ✅ Changed from 900
      style={{ maxWidth: 900 }} // ✅ Added max-width
      title={selectedProduct?.name}
      destroyOnClose={true}
    >
      {orderSuccess && (
        <Alert
          type="success"
          message={orderSuccess}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {orderError && (
        <Alert
          type="error"
          message={orderError}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {selectedProduct && (
        <Row gutter={24}>
          {/* LEFT */}
          <Col span={10}>
            <ProductImageGallery
              product={selectedProduct}
              key={selectedProduct.id} // ✅ Force re-render
            />

            <Divider />

            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: 18 }}>
                Price:{" "}
                <Text type="primary" style={{ fontSize: 20 }}>
                  ₹{selectedProduct.price}
                </Text>
              </Text>
            </div>

            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              {selectedProduct.description}
            </Paragraph>

            {selectedProduct.brand && (
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">Brand: </Text>
                <Text strong>{selectedProduct.brand}</Text>
              </div>
            )}
          </Col>

          {/* RIGHT */}
          <Col span={14}>
            {selectedProduct.sizes && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Select Size *</Text>
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  value={selectedSize}
                  placeholder="Choose size"
                  onChange={setSelectedSize}
                  size="large"
                >
                  {selectedProduct.sizes.map((size) => (
                    <Select.Option key={size} value={size}>
                      {size}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <Text strong>Quantity</Text>
              <InputNumber
                min={1}
                value={quantity}
                onChange={setQuantity}
                style={{ width: "100%", marginTop: 8 }}
                size="large"
              />
            </div>

            <Divider />

            <Space
              direction="horizontal"
              style={{
                width: "100%",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 16 }}>
                {quantity} × ₹{selectedProduct.price}
              </Text>
              <Text strong type="primary" style={{ fontSize: 20 }}>
                ₹{selectedProduct.price * quantity}
              </Text>
            </Space>
          </Col>
        </Row>
      )}

      <Divider />

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button onClick={onHide} size="large">
          Close
        </Button>
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          loading={placing}
          disabled={!selectedSize}
          onClick={handlePlaceOrder}
          size="large"
        >
          Place Order
        </Button>
      </Space>
    </Modal>
  );
}
