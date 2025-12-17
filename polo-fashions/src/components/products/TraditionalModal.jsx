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
      orderType: "traditional_custom",
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
            <Title level={5}>What’s inside the box</Title>

            {Array.isArray(selectedProduct.box_items) &&
            selectedProduct.box_items.length > 0 ? (
              <List
                size="small"
                bordered
                dataSource={selectedProduct.box_items}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                style={{ marginBottom: 16 }}
              />
            ) : (
              <Text type="secondary">
                Box contents will be revealed after order.
              </Text>
            )}

            <Divider />

            <Text strong>Do you want stitching?</Text>
            <Radio.Group
              value={wantStitching}
              onChange={(e) => {
                setWantStitching(e.target.value);
                if (!e.target.value) {
                  setStitchType("");
                  setSelectedSize("");
                }
              }}
              style={{ marginBottom: 16 }}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>

            {wantStitching && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Text>What do you want stitched?</Text>
                  <Select
                    style={{ width: "100%" }}
                    value={stitchType}
                    onChange={setStitchType}
                    placeholder="Select"
                  >
                    <Select.Option value="shirt">Shirt</Select.Option>
                    <Select.Option value="dhoti">Dhoti</Select.Option>
                    <Select.Option value="both">Both</Select.Option>
                  </Select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text>Select Size</Text>
                  <Select
                    style={{ width: "100%" }}
                    value={selectedSize}
                    onChange={setSelectedSize}
                    placeholder="Select size"
                  >
                    <Select.Option value="S">S</Select.Option>
                    <Select.Option value="M">M</Select.Option>
                    <Select.Option value="L">L</Select.Option>
                    <Select.Option value="XL">XL</Select.Option>
                    <Select.Option value="XXL">XXL</Select.Option>
                  </Select>
                </div>
              </>
            )}

            <Divider />

            <Space
              direction="vertical"
              style={{ width: "100%" }}
            >
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text>Traditional Set</Text>
                <Text>₹{selectedProduct.price}</Text>
              </Space>

              {wantStitching && (
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Stitching</Text>
                  <Text>₹{calcStitchCharge()}</Text>
                </Space>
              )}

              <Divider style={{ margin: "8px 0" }} />

              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text strong>Total</Text>
                <Text strong type="primary">
                  ₹
                  {Number(selectedProduct.price) +
                    (wantStitching ? calcStitchCharge() : 0)}
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
          disabled={!selectedProduct || (wantStitching && !selectedSize)}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Space>
    </Modal>
  );
}
