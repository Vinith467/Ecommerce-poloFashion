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

    // ✅ FIXED: Determine if this is a Fabric or a Custom Product
    const isFabricItem = !selectedProduct.type || !selectedProduct.category;

    const orderData = {
      // ✅ Use fabricId for actual fabrics, productId for custom products
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

    console.log("🟢 Fabric Order:", orderData);

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
            <ProductImageGallery product={selectedProduct} />

            <Divider />

            <Text strong>
              Price:{" "}
              <Text type="primary">₹{selectedProduct.price} / meter</Text>
            </Text>

            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              {selectedProduct.description}
            </Paragraph>
          </Col>

          {/* RIGHT */}
          <Col span={14}>
            <Title level={5}>Stitching Options</Title>

            <Radio.Group
              value={wantStitching}
              onChange={(e) => {
                setWantStitching(e.target.value);
                if (!e.target.value) {
                  setStitchType("");
                  setMeters(1);
                }
              }}
              style={{ marginBottom: 16 }}
            >
              <Radio value={true}>Yes, stitch it</Radio>
              <Radio value={false}>No, just buy fabric</Radio>
            </Radio.Group>

            {wantStitching && (
              <Space wrap style={{ marginBottom: 16 }}>
                {Object.keys(STITCHING_CHARGES).map((type) => (
                  <Tag.CheckableTag
                    key={type}
                    checked={stitchType === type}
                    onChange={() => onSelectStitchType(type)}
                  >
                    {type.toUpperCase()} — ₹{STITCHING_CHARGES[type]}
                  </Tag.CheckableTag>
                ))}
              </Space>
            )}

            <Divider />

            <Text>Meters Required</Text>
            <InputNumber
              min={0.1}
              step={0.1}
              value={meters}
              onChange={(val) => setMeters(val)}
              style={{ width: "100%", marginBottom: 16 }}
            />

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
                  >
                    Complete measurement booking first
                  </Button>
                }
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Divider />

            <Space direction="vertical" style={{ width: "100%" }}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Text>Fabric ({meters} m)</Text>
                <Text>₹{calcFabricCost()}</Text>
              </Space>

              {wantStitching && (
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Stitching ({stitchType})</Text>
                  <Text>₹{calcStitchCharge()}</Text>
                </Space>
              )}

              <Divider style={{ margin: "8px 0" }} />

              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Text strong>Total</Text>
                <Text strong type="primary">
                  ₹{calcTotal()}
                </Text>
              </Space>
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
          disabled={!selectedProduct || !meters || Number(meters) <= 0}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Space>
    </Modal>
  );
}
