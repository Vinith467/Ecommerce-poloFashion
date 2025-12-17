import React, { useState } from "react";
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

    const orderData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      orderType: "readymade",
      quantity,
      size: selectedSize,
      totalPrice: selectedProduct.price * quantity, // 🔒 untouched
    };

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
    } catch {
      setPlacing(false);
      setOrderError("Failed to place order");
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width={900}
      title={selectedProduct?.name}
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
            <ProductImageGallery product={selectedProduct} />

            <Divider />

            <Text strong>
              Price:{" "}
              <Text type="primary">₹{selectedProduct.price}</Text>
            </Text>

            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              {selectedProduct.description}
            </Paragraph>
          </Col>

          {/* RIGHT */}
          <Col span={14}>
            {selectedProduct.sizes && (
              <div style={{ marginBottom: 16 }}>
                <Text>Select Size</Text>
                <Select
                  style={{ width: "100%" }}
                  value={selectedSize}
                  placeholder="Select size"
                  onChange={setSelectedSize}
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
              <Text>Quantity</Text>
              <InputNumber
                min={1}
                value={quantity}
                onChange={setQuantity}
                style={{ width: "100%" }}
              />
            </div>

            <Divider />

            <Space
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Text>
                {quantity} × ₹{selectedProduct.price}
              </Text>
              <Text strong type="primary">
                ₹{selectedProduct.price * quantity}
              </Text>
            </Space>
          </Col>
        </Row>
      )}

      <Divider />

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button onClick={onHide}>Close</Button>
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          loading={placing}
          disabled={!selectedSize}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Space>
    </Modal>
  );
}
