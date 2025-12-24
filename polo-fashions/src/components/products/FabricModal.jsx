import React, { useState } from "react";
import {
  Modal,
  Button,
  Alert,
  Row,
  Col,
  Typography,
  Radio,
  InputNumber,
  Divider,
  Space,
  Tag,
  Card,
} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

const { Text, Paragraph, Title } = Typography;

const STITCHING_CHARGES = {
  shirt: 350,
  pant: 450,
  kurta: 400,
};

const DEFAULT_METERS = {
  shirt: 2.3,
  pant: 1.6,
  kurta: 2.5,
};

export default function FabricModal({
  show,
  onHide,
  selectedProduct,
  currentUser,
  addOrder,
}) {
  const navigate = useNavigate();

  const [wantStitching, setWantStitching] = useState(false);
  const [stitchType, setStitchType] = useState("");
  const [meters, setMeters] = useState(1);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const measurementDone =
    (currentUser &&
      (currentUser.measurement_status === "completed" ||
        currentUser.measurementStatus === "completed")) ||
    false;

  const onSelectStitchType = (type) => {
    setStitchType(type);
    setWantStitching(true);
    const defaultMeter = DEFAULT_METERS[type] || 1;
    setMeters((prev) => (prev < defaultMeter ? defaultMeter : prev));
  };

  const calcFabricCost = () => {
    if (!selectedProduct) return 0;
    const pricePerMeter = Number(
      selectedProduct.price || selectedProduct.fabric_price || 0
    );
    return Number((pricePerMeter * Number(meters || 0)).toFixed(2));
  };

  const calcStitchCharge = () => {
    if (!wantStitching || !stitchType) return 0;
    return STITCHING_CHARGES[stitchType] || 0;
  };

  const calcTotal = () =>
    Number((calcFabricCost() + calcStitchCharge()).toFixed(2));

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

    if (!meters || Number(meters) <= 0) {
      setOrderError("Please enter a valid meter value");
      return;
    }

    if (wantStitching && !measurementDone) {
      setOrderError("Please complete your measurement booking first");
      return;
    }

    if (wantStitching && !stitchType) {
      setOrderError("Please select a stitching type");
      return;
    }

    const isFabricItem = !selectedProduct.type || !selectedProduct.category;

    const orderData = {
      ...(isFabricItem
        ? { fabricId: selectedProduct.id }
        : { productId: selectedProduct.id }),
      meters: Number(meters),
      stitchType: wantStitching ? stitchType : null,
      stitchingCharge: wantStitching ? calcStitchCharge() : 0,
      fabricPricePerMeter: Number(selectedProduct.price),
      totalPrice: calcTotal(),
      quantity: 1,
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
    } catch (error) {
      setPlacing(false);
      console.error("🔴 Fabric order error:", error);
      setOrderError(error?.response?.data?.detail || "Failed to place order");
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
                ₹{selectedProduct.price} / meter
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
              Stitching Options
            </Title>

            {/* ✅ Mobile Optimized Radio */}
            <Radio.Group
              value={wantStitching}
              onChange={(e) => {
                setWantStitching(e.target.value);
                if (!e.target.value) {
                  setStitchType("");
                  setMeters(1);
                }
              }}
              style={{ marginBottom: 16, width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value={true} style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Yes, stitch it
                </Radio>
                <Radio value={false} style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  No, just buy fabric
                </Radio>
              </Space>
            </Radio.Group>

            {/* ✅ Stitch Type Tags - Mobile Wrap */}
            {wantStitching && (
              <Space wrap style={{ marginBottom: 16 }}>
                {Object.keys(STITCHING_CHARGES).map((type) => (
                  <Tag.CheckableTag
                    key={type}
                    checked={stitchType === type}
                    onChange={() => onSelectStitchType(type)}
                    style={{
                      padding: '8px 16px',
                      fontSize: 'clamp(13px, 2.8vw, 15px)',
                      borderRadius: 6,
                    }}
                  >
                    {type.toUpperCase()} — ₹{STITCHING_CHARGES[type]}
                  </Tag.CheckableTag>
                ))}
              </Space>
            )}

            <Divider style={{ margin: '16px 0' }} />

            {/* ✅ Meters Input - Mobile Optimized */}
            <Text 
              strong
              style={{ 
                display: 'block',
                marginBottom: 8,
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}
            >
              Meters Required
            </Text>
            <InputNumber
              min={0.1}
              step={0.1}
              value={meters}
              onChange={(val) => setMeters(val)}
              style={{ width: "100%", marginBottom: 16 }}
              size="large"
              controls={{
                upIcon: <span style={{ fontSize: 20 }}>+</span>,
                downIcon: <span style={{ fontSize: 20 }}>−</span>,
              }}
            />

            {/* ✅ Measurement Warning - Mobile */}
            {wantStitching && !measurementDone && (
              <Alert
                type="warning"
                message="Measurement Required"
                description={
                  <Button
                    type="link"
                    onClick={() => {
                      onHide();
                      navigate("/booking");
                    }}
                    style={{ padding: 0 }}
                  >
                    Complete measurement booking first
                  </Button>
                }
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* ✅ Mobile Description */}
            <div className="mobile-only" style={{ marginBottom: 16 }}>
              <Divider style={{ margin: '12px 0' }} />
              <Paragraph type="secondary">
                {selectedProduct.description}
              </Paragraph>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* ✅ Price Breakdown - Mobile Card */}
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
                    Fabric ({meters} m)
                  </Text>
                  <Text style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    ₹{calcFabricCost()}
                  </Text>
                </Space>

                {wantStitching && (
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 'clamp(13px, 2.8vw, 15px)' }}>
                      Stitching ({stitchType})
                    </Text>
                    <Text style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                      ₹{calcStitchCharge()}
                    </Text>
                  </Space>
                )}

                <Divider style={{ margin: "8px 0" }} />

                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <Text strong style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    Total
                  </Text>
                  <Text 
                    strong 
                    type="primary" 
                    style={{ fontSize: 'clamp(16px, 3.5vw, 18px)' }}
                  >
                    ₹{calcTotal()}
                  </Text>
                </Space>
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
          disabled={!selectedProduct || !meters || Number(meters) <= 0}
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