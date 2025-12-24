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
  Card,
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

        const orderData = {
          rentalItemId: selectedProduct.id,
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
        const orderData = {
          rentalItemId: selectedProduct.id,
          productName: selectedProduct.name,
          orderType: "rental_buy",
          size: selectedSize || null,
          quantity: 1,
          rentalDays: 0,
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
            <ProductImageGallery product={selectedProduct} />
            <Divider style={{ margin: '16px 0' }} />
            <Text strong style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
              Price:{" "}
              <Text type="primary" style={{ fontSize: 'clamp(16px, 3.5vw, 18px)' }}>
                {rentalMode === "rent"
                  ? `₹${selectedProduct.price_per_day} / day`
                  : `₹${selectedProduct.buy_price}`}
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
            <Title level={5} style={{ fontSize: 'clamp(16px, 3.5vw, 18px)' }}>
              Rental Options
            </Title>

            {/* ✅ Rent/Buy Toggle - Mobile */}
            <Radio.Group
              value={rentalMode}
              onChange={(e) => setRentalMode(e.target.value)}
              style={{ marginBottom: 16, width: '100%' }}
              size="large"
            >
              <Radio.Button 
                value="rent"
                style={{ 
                  width: '50%',
                  textAlign: 'center',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}
              >
                Rent
              </Radio.Button>
              <Radio.Button 
                value="buy"
                style={{ 
                  width: '50%',
                  textAlign: 'center',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}
              >
                Buy
              </Radio.Button>
            </Radio.Group>

            {/* ✅ Size Selector - Mobile */}
            <div style={{ marginBottom: 16 }}>
              <Text 
                strong
                style={{ 
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 'clamp(14px, 3vw, 16px)',
                }}
              >
                Select Size
              </Text>
              <Select
                style={{ width: "100%" }}
                value={selectedSize}
                onChange={setSelectedSize}
                placeholder="Select size"
                size="large"
                options={selectedProduct.sizes?.map((size) => ({
                  label: size,
                  value: size,
                }))}
              />
            </div>

            {/* ✅ Rental Days - Mobile */}
            {rentalMode === "rent" && (
              <>
                <Text 
                  strong
                  style={{ 
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 'clamp(14px, 3vw, 16px)',
                  }}
                >
                  Number of Days
                </Text>
                <InputNumber
                  min={1}
                  value={rentalDays}
                  onChange={setRentalDays}
                  style={{ width: "100%", marginBottom: 16 }}
                  size="large"
                  controls={{
                    upIcon: <span style={{ fontSize: 20 }}>+</span>,
                    downIcon: <span style={{ fontSize: 20 }}>−</span>,
                  }}
                />

                {/* ✅ Mobile Description */}
                <div className="mobile-only" style={{ marginBottom: 16 }}>
                  <Divider style={{ margin: '12px 0' }} />
                  <Paragraph type="secondary">
                    {selectedProduct.description}
                  </Paragraph>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                {/* ✅ Rental Breakdown - Mobile Card */}
                <Card
                  style={{
                    background: '#f5f5f5',
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: 'clamp(12px, 3vw, 16px)' }}
                >
                  <Space direction="vertical" style={{ width: "100%" }} size={8}>
                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 'clamp(13px, 2.8vw, 15px)' }}>
                        Rent ({rentalDays} days)
                      </Text>
                      <Text style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                        ₹{rentalCost()}
                      </Text>
                    </Space>

                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 'clamp(13px, 2.8vw, 15px)' }}>
                        Deposit (refundable)
                      </Text>
                      <Text style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                        ₹{rentalDeposit()}
                      </Text>
                    </Space>

                    <Divider style={{ margin: "8px 0" }} />

                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                      <Text strong style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                        Pay Now
                      </Text>
                      <Text 
                        strong 
                        type="primary" 
                        style={{ fontSize: 'clamp(16px, 3.5vw, 18px)' }}
                      >
                        ₹{rentalPayNow()}
                      </Text>
                    </Space>
                  </Space>
                </Card>
              </>
            )}

            {/* ✅ Buy Mode - Mobile */}
            {rentalMode === "buy" && (
              <>
                <div className="mobile-only" style={{ marginBottom: 16 }}>
                  <Divider style={{ margin: '12px 0' }} />
                  <Paragraph type="secondary">
                    {selectedProduct.description}
                  </Paragraph>
                </div>

                <Card
                  style={{
                    background: '#f5f5f5',
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: 'clamp(12px, 3vw, 16px)' }}
                >
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Text strong style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                      Buy Price
                    </Text>
                    <Text 
                      strong 
                      type="primary" 
                      style={{ fontSize: 'clamp(16px, 3.5vw, 18px)' }}
                    >
                      ₹{selectedProduct.buy_price}
                    </Text>
                  </Space>
                </Card>
              </>
            )}
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
          disabled={rentalMode === "rent" && !selectedSize}
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