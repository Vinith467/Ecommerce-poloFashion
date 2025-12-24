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
import "../products/ProductModals.css"; 


const { Title, Text, Paragraph } = Typography;

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

    // ✅ FIXED: Use correct ID field based on category
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

    console.log("Submitting order:", orderData); // ✅ Debug log

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
          <Col span={10}>
            <ProductImageGallery
              product={selectedProduct}
              key={selectedProduct.id}
            />

            <Divider />

            <Text strong>
              Price: <Text type="primary">₹{selectedProduct.price}</Text>
            </Text>

            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              {selectedProduct.description}
            </Paragraph>
          </Col>

          <Col span={14}>
            {isInnerwear && selectedProduct.sizes && (
              <div style={{ marginBottom: 16 }}>
                <Text>Select Size</Text>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Choose size"
                  value={selectedSize}
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
              direction="horizontal"
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
          disabled={!selectedProduct || (isInnerwear && !selectedSize)}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Space>
    </Modal>
  );
}
