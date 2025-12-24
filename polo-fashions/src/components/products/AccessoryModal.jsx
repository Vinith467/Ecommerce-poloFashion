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
  Card,
} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

const { Text, Paragraph } = Typography;

export default function AccessoryModal({
  show,
  onHide,
  selectedProduct,
  currentUser,
  addOrder,
  category,
}) {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const isInnerwear = category === "innerwear";

  // ✅ RESET STATE WHEN PRODUCT CHANGES
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setSelectedSize("");
      setOrderError("");
      setOrderSuccess("");
      setPlacing(false);
    }
  }, [selectedProduct]);

  // ✅ RESET STATE WHEN MODAL CLOSES
  useEffect(() => {
    if (!show) {
      setQuantity(1);
      setSelectedSize("");
      setOrderError("");
      setOrderSuccess("");
      setPlacing(false);
    }
  }, [show]);

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

    if (isInnerwear && !selectedSize) {
      setOrderError("Please select a size");
      return;
    }

    const orderData = {
      ...(isInnerwear
        ? { innerwearId: selectedProduct.id }
        : { accessoryId: selectedProduct.id }),
      productName: selectedProduct.name,
      orderType: isInnerwear ? "innerwear" : "accessory",
      quantity,
      size: isInnerwear ? selectedSize : null,
      totalPrice: selectedProduct.price * quantity,
    };

    console.log("Submitting order:", orderData);

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
      console.error("Order error:", error);
      setOrderError("Failed to place order");
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width="95vw"
      style={{ 
        maxWidth: 900,
        top: 20,
      }}
      title={
        <div style={{ 
          fontSize: 'clamp(16px, 4vw, 20px)',
          wordBreak: 'break-word',
          paddingRight: 24,
        }}>
          {selectedProduct?.name}
        </div>
      }
      destroyOnClose={true}
      styles={{
        body: {
          padding: 'clamp(12px, 3vw, 24px)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }
      }}
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
        <Row gutter={[16, 16]}>
          {/* LEFT - Image */}
          <Col xs={24} md={10}>
            <ProductImageGallery
              product={selectedProduct}
              key={selectedProduct.id}
            />

            <Divider style={{ margin: '16px 0' }} />

            <Text strong style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
              Price:{" "}
              <Text type="primary" style={{ fontSize: 'clamp(16px, 3.5vw, 18px)' }}>
                ₹{selectedProduct.price}
              </Text>
            </Text>

            <div className="desktop-only">
              <Paragraph type="secondary" style={{ marginTop: 8 }}>
                {selectedProduct.description}
              </Paragraph>
            </div>
          </Col>

          {/* RIGHT - Options */}
          <Col xs={24} md={14}>
            {/* ✅ Size Selector for Innerwear - Mobile */}
            {isInnerwear && selectedProduct.sizes && (
              <div style={{ marginBottom: 16 }}>
                <Text 
                  strong
                  style={{ 
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 'clamp(14px, 3vw, 16px)',
                  }}
                >
                  Select Size *
                </Text>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Choose size"
                  value={selectedSize}
                  onChange={setSelectedSize}
                  size="large"
                  options={selectedProduct.sizes.map((size) => ({
                    label: size,
                    value: size,
                  }))}
                />
              </div>
            )}

            {/* ✅ Quantity Selector - Mobile */}
            <div style={{ marginBottom: 16 }}>
              <Text 
                strong
                style={{ 
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}
              >
                Quantity
              </Text>
              <InputNumber
                min={1}
                value={quantity}
                onChange={setQuantity}
                style={{ width: "100%" }}
                size="large"
                controls={{
                  upIcon: <span style={{ fontSize: 20 }}>+</span>,
                  downIcon: <span style={{ fontSize: 20 }}>−</span>,
                }}
              />
            </div>

            {/* ✅ Mobile Description */}
            <div className="mobile-only" style={{ marginBottom: 16 }}>
              <Divider style={{ margin: '12px 0' }} />
              <Paragraph type="secondary">
                {selectedProduct.description}
              </Paragraph>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* ✅ Price Summary - Mobile Card */}
            <Card
              style={{
                background: '#f5f5f5',
                borderRadius: 8,
              }}
              bodyStyle={{ padding: 'clamp(12px, 3vw, 16px)' }}
            >
              <Space
                direction="horizontal"
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  {quantity} × ₹{selectedProduct.price}
                </Text>
                <Text 
                  strong 
                  type="primary" 
                  style={{ fontSize: 'clamp(18px, 4vw, 20px)' }}
                >
                  ₹{selectedProduct.price * quantity}
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      <Divider style={{ margin: '16px 0' }} />

      {/* ✅ Action Buttons */}
      <Space 
        style={{ 
          width: "100%", 
          justifyContent: "flex-end",
          flexWrap: 'wrap',
        }}
        size={[8, 8]}
      >
        <Button 
          onClick={onHide}
          size="large"
          style={{ minWidth: 'clamp(100px, 25vw, 120px)' }}
        >
          Close
        </Button>
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          loading={placing}
          disabled={!selectedProduct || (isInnerwear && !selectedSize)}
          onClick={handlePlaceOrder}
          size="large"
          style={{ minWidth: 'clamp(120px, 30vw, 150px)' }}
        >
          Place Order
        </Button>
      </Space>

      {/* ✅ Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }
          .mobile-only {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .desktop-only {
            display: block;
          }
          .mobile-only {
            display: none;
          }
        }
      `}</style>
    </Modal>
  );
}