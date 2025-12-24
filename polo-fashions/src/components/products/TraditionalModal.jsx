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
  Divider,
  Space,
  List,
  Card,
} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

const { Title, Text, Paragraph } = Typography;

const STITCHING_CHARGES = {
  shirt: 350,
  dhoti: 300,
  both: 550,
};

export default function TraditionalModal({
  show,
  onHide,
  selectedProduct,
  currentUser,
  addOrder,
}) {
  const navigate = useNavigate();

  const [wantStitching, setWantStitching] = useState(false);
  const [stitchType, setStitchType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const calcStitchCharge = () => {
    if (!wantStitching || !stitchType) return 0;
    return STITCHING_CHARGES[stitchType] || 0;
  };

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

    if (wantStitching && !selectedSize) {
      setOrderError("Please select size");
      return;
    }

    const orderData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      orderType: "traditional",
      quantity: 1,
      stitchType: wantStitching ? stitchType : null,
      size: wantStitching ? selectedSize : null,
      stitchingCharge: wantStitching ? calcStitchCharge() : 0,
      totalPrice:
        Number(selectedProduct.price) +
        (wantStitching ? calcStitchCharge() : 0),
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
            <Title level={5} style={{ fontSize: 'clamp(16px, 3.5vw, 18px)' }}>
              What's inside the box
            </Title>

            {/* ✅ Box Items - Mobile Optimized */}
            {Array.isArray(selectedProduct.box_items) &&
            selectedProduct.box_items.length > 0 ? (
              <List
                size="small"
                bordered
                dataSource={selectedProduct.box_items}
                renderItem={(item) => (
                  <List.Item style={{ fontSize: 'clamp(13px, 2.8vw, 15px)' }}>
                    {item}
                  </List.Item>
                )}
                style={{ marginBottom: 16 }}
              />
            ) : (
              <Text type="secondary" style={{ fontSize: 'clamp(13px, 2.8vw, 15px)' }}>
                Box contents will be revealed after order.
              </Text>
            )}

            <Divider style={{ margin: '16px 0' }} />

            {/* ✅ Stitching Question - Mobile */}
            <Text 
              strong
              style={{ 
                display: 'block',
                marginBottom: 8,
                fontSize: 'clamp(14px, 3vw, 16px)',
              }}
            >
              Do you want stitching?
            </Text>
            <Radio.Group
              value={wantStitching}
              onChange={(e) => {
                setWantStitching(e.target.value);
                if (!e.target.value) {
                  setStitchType("");
                  setSelectedSize("");
                }
              }}
              style={{ marginBottom: 16, width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value={true} style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  Yes
                </Radio>
                <Radio value={false} style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                  No
                </Radio>
              </Space>
            </Radio.Group>

            {/* ✅ Stitching Options - Mobile */}
            {wantStitching && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Text 
                    strong
                    style={{ 
                      display: 'block',
                      marginBottom: 8,
                      fontSize: 'clamp(14px, 3vw, 16px)',
                    }}
                  >
                    What do you want stitched?
                  </Text>
                  <Select
                    style={{ width: "100%" }}
                    value={stitchType}
                    onChange={setStitchType}
                    placeholder="Select"
                    size="large"
                    options={[
                      { label: "Shirt", value: "shirt" },
                      { label: "Dhoti", value: "dhoti" },
                      { label: "Both", value: "both" },
                    ]}
                  />
                </div>

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
                    options={[
                      { label: "S", value: "S" },
                      { label: "M", value: "M" },
                      { label: "L", value: "L" },
                      { label: "XL", value: "XL" },
                      { label: "XXL", value: "XXL" },
                    ]}
                  />
                </div>
              </>
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
                    Traditional Set
                  </Text>
                  <Text style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                    ₹{selectedProduct.price}
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
                      Stitching
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
                    ₹
                    {Number(selectedProduct.price) +
                      (wantStitching ? calcStitchCharge() : 0)}
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
          disabled={!selectedProduct || (wantStitching && !selectedSize)}
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