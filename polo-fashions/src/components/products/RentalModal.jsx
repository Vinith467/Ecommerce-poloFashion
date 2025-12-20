import React, { useState } from "react";
import {
  Modal,
  Button,
  Alert,
  Row,
  Col,
  Typography,
  Radio,
  Select,
  InputNumber,
  Divider,
  Space,
} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

const { Title, Text, Paragraph } = Typography;

export default function RentalModal({
  show,
  onHide,
  selectedProduct,
  currentUser,
  addOrder,
}) {
  const navigate = useNavigate();

  const [rentalMode, setRentalMode] = useState("rent");
  const [rentalDays, setRentalDays] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const rentalCost = () =>
    selectedProduct ? rentalDays * Number(selectedProduct.price_per_day) : 0;

  const rentalDeposit = () => Number(selectedProduct?.deposit_amount || 0);

  const rentalPayNow = () => rentalCost() + rentalDeposit();

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

    try {
      setPlacing(true);

      if (rentalMode === "rent") {
        if (!selectedSize) {
          setOrderError("Please select a size");
          setPlacing(false);
          return;
        }

        // ✅ FIX: Use rentalItemId instead of productId
        const orderData = {
          rentalItemId: selectedProduct.id, // ✅ Changed from productId
          productName: selectedProduct.name,
          orderType: "rental",
          rentalMode: "rent",
          size: selectedSize,
          rentalDays,
          rentalPricePerDay: selectedProduct.price_per_day,
          rentalDeposit: rentalDeposit(),
          quantity: 1,
          totalPrice: rentalPayNow(),
        };

        const result = await addOrder(orderData);
        if (result.success) {
          setOrderSuccess("Rental order placed successfully!");
          setTimeout(() => {
            onHide();
            navigate("/dashboard");
          }, 1200);
        } else {
          setOrderError(result.message);
        }
      }

      if (rentalMode === "buy") {
        // ✅ FIX: Use rentalItemId for buy mode too
        const orderData = {
          rentalItemId: selectedProduct.id, // ✅ Changed from productId
          productName: selectedProduct.name,
          orderType: "rental_buy",
          size: selectedSize || null,
          quantity: 1,
          rentalDays: 0, // ✅ No rental days for buy
          totalPrice: selectedProduct.buy_price,
        };

        const result = await addOrder(orderData);
        if (result.success) {
          setOrderSuccess("Product purchased successfully!");
          setTimeout(() => {
            onHide();
            navigate("/dashboard");
          }, 1200);
        } else {
          setOrderError(result.message);
        }
      }
    } catch (err) {
      console.error("Order error:", err);
      setOrderError("Failed to place order");
    } finally {
      setPlacing(false);
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
      {orderSuccess && <Alert type="success" message={orderSuccess} showIcon />}
      {orderError && <Alert type="error" message={orderError} showIcon />}

      {selectedProduct && (
        <Row gutter={24}>
          <Col span={10}>
            <ProductImageGallery product={selectedProduct} />
            <Divider />
            <Text strong>
              Price:{" "}
              <Text type="primary">
                {rentalMode === "rent"
                  ? `₹${selectedProduct.price_per_day} / day`
                  : `₹${selectedProduct.buy_price}`}
              </Text>
            </Text>
            <Paragraph type="secondary">
              {selectedProduct.description}
            </Paragraph>
          </Col>

          <Col span={14}>
            <Title level={5}>Rental Options</Title>

            <Radio.Group
              value={rentalMode}
              onChange={(e) => setRentalMode(e.target.value)}
              style={{ marginBottom: 16 }}
            >
              <Radio.Button value="rent">Rent</Radio.Button>
              <Radio.Button value="buy">Buy</Radio.Button>
            </Radio.Group>

            <div style={{ marginBottom: 16 }}>
              <Text>Select Size</Text>
              <Select
                style={{ width: "100%" }}
                value={selectedSize}
                onChange={setSelectedSize}
                placeholder="Select size"
              >
                {selectedProduct.sizes?.map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {rentalMode === "rent" && (
              <>
                <Text>Number of Days</Text>
                <InputNumber
                  min={1}
                  value={rentalDays}
                  onChange={setRentalDays}
                  style={{ width: "100%", marginBottom: 16 }}
                />

                <Divider />

                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text>Rent: ₹{rentalCost()}</Text>
                  <Text>Deposit: ₹{rentalDeposit()}</Text>
                  <Text strong type="primary">
                    Pay Now: ₹{rentalPayNow()}
                  </Text>
                </Space>
              </>
            )}

            {rentalMode === "buy" && (
              <Text strong type="primary">
                Buy Price: ₹{selectedProduct.buy_price}
              </Text>
            )}
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
          disabled={rentalMode === "rent" && !selectedSize}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Space>
    </Modal>
  );
}
