// src/components/products/ReadyMadeModal.jsx - MOBILE OPTIMIZED
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Alert,
  Select,
  InputNumber,
  Space,
  Image,
} from "antd";
import { ShoppingOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../products/ProductModals.css"; // Import the new CSS

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    if (show && selectedProduct) {
      setSelectedSize("");
      setQuantity(1);
      setOrderError("");
      setOrderSuccess("");
      setPlacing(false);
      setSelectedImageIndex(0);
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

    const orderData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      orderType: "readymade",
      quantity,
      size: selectedSize,
      totalPrice: selectedProduct.price * quantity,
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
      setOrderError(error?.response?.data?.detail || "Failed to place order");
    }
  };

  // Get product images
  const getImages = () => {
    if (!selectedProduct) return [];
    if (selectedProduct.images?.length > 0) {
      return selectedProduct.images.map((img) => img.image);
    }
    if (selectedProduct.image) {
      return [selectedProduct.image];
    }
    return [];
  };

  const images = getImages();
  const currentImage = images[selectedImageIndex] || images[0];

  // Calculate total price
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width={isMobile ? "100%" : 900}
      style={isMobile ? { maxWidth: "calc(100vw - 32px)", margin: "16px auto" } : {}}
      title={isMobile ? null : selectedProduct?.name}
      closeIcon={<CloseOutlined />}
      destroyOnClose
      className={isMobile ? "product-modal-mobile" : ""}
    >
      {/* ALERTS */}
      {orderSuccess && (
        <Alert
          type="success"
          message={orderSuccess}
          showIcon
          className="mobile-modal-alert"
        />
      )}

      {orderError && (
        <Alert
          type="error"
          message={orderError}
          showIcon
          className="mobile-modal-alert"
        />
      )}

      {selectedProduct && (
        <>
          {/* MOBILE LAYOUT */}
          {isMobile ? (
            <div>
              {/* Product Title (Mobile Only) */}
              <div className="mobile-product-info">
                <h3 className="mobile-product-title">
                  {selectedProduct.name}
                </h3>
                <div className="mobile-product-price">
                  ₹{selectedProduct.price}
                </div>
              </div>

              {/* Image Gallery - Horizontal Scroll */}
              {images.length > 1 && (
                <div className="mobile-image-gallery">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`mobile-image-thumb ${
                        selectedImageIndex === index ? "active" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={img} alt={`View ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Main Product Image */}
              <div className="mobile-main-image">
                <img
                  src={currentImage}
                  alt={selectedProduct.name}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>

              {/* Size Selection */}
              {selectedProduct.sizes && (
                <div className="mobile-form-section">
                  <label className="mobile-form-label">
                    Select Size <span className="required">*</span>
                  </label>
                  <div className="mobile-size-selector">
                    <Select
                      value={selectedSize}
                      placeholder="Choose your size"
                      onChange={setSelectedSize}
                      size="large"
                      options={selectedProduct.sizes.map((size) => ({
                        label: size,
                        value: size,
                      }))}
                    />
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mobile-form-section">
                <label className="mobile-form-label">Quantity</label>
                <div className="mobile-quantity-input">
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={setQuantity}
                    size="large"
                  />
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="mobile-product-description">
                  {selectedProduct.description}
                </div>
              )}

              {/* Price Summary */}
              <div className="mobile-price-summary">
                <div className="mobile-price-row">
                  <span className="mobile-price-label">
                    Price ({quantity} × ₹{selectedProduct.price})
                  </span>
                  <span className="mobile-price-value">
                    ₹{selectedProduct.price * quantity}
                  </span>
                </div>

                <div className="mobile-price-row mobile-price-total">
                  <span className="mobile-price-label">Total Amount</span>
                  <span className="mobile-price-value">₹{totalPrice}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mobile-modal-actions">
                <Button
                  onClick={onHide}
                  size="large"
                  className="mobile-btn-close"
                >
                  Close
                </Button>
                <Button
                  type="primary"
                  icon={<ShoppingOutlined />}
                  loading={placing}
                  disabled={!selectedSize}
                  onClick={handlePlaceOrder}
                  size="large"
                  className="mobile-btn-order"
                >
                  Place Order
                </Button>
              </div>
            </div>
          ) : (
            /* DESKTOP LAYOUT (Original) */
            <div style={{ padding: "20px 0" }}>
              <div style={{ display: "flex", gap: 24 }}>
                {/* Left - Image */}
                <div style={{ flex: "0 0 40%" }}>
                  <Image
                    src={currentImage}
                    alt={selectedProduct.name}
                    style={{ width: "100%", borderRadius: 12 }}
                  />

                  {images.length > 1 && (
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 12,
                        overflowX: "auto",
                      }}
                    >
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          onClick={() => setSelectedImageIndex(idx)}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 6,
                            cursor: "pointer",
                            border:
                              selectedImageIndex === idx
                                ? "2px solid #1677ff"
                                : "1px solid #d9d9d9",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <h3 style={{ fontSize: 20, marginBottom: 8 }}>
                      ₹{selectedProduct.price}
                    </h3>
                    {selectedProduct.description && (
                      <p style={{ color: "#666", fontSize: 14 }}>
                        {selectedProduct.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right - Form */}
                <div style={{ flex: 1 }}>
                  {selectedProduct.sizes && (
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        Select Size <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        style={{ width: "100%" }}
                        value={selectedSize}
                        placeholder="Choose size"
                        onChange={setSelectedSize}
                        size="large"
                        options={selectedProduct.sizes.map((size) => ({
                          label: size,
                          value: size,
                        }))}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      Quantity
                    </label>
                    <InputNumber
                      min={1}
                      value={quantity}
                      onChange={setQuantity}
                      style={{ width: "100%" }}
                      size="large"
                    />
                  </div>

                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: 16,
                      borderRadius: 8,
                      marginTop: 24,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <span>
                        {quantity} × ₹{selectedProduct.price}
                      </span>
                      <span style={{ fontWeight: 600 }}>₹{totalPrice}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: 12,
                        borderTop: "1px solid #d9d9d9",
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600 }}>
                        Total
                      </span>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#1677ff",
                        }}
                      >
                        ₹{totalPrice}
                      </span>
                    </div>
                  </div>

                  <Space
                    style={{ width: "100%", marginTop: 24 }}
                    direction="horizontal"
                  >
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
                      style={{ flex: 1 }}
                    >
                      Place Order
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}