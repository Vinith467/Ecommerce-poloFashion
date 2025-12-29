import React, { useEffect, useRef, useState } from "react";
import { Modal, Spin, Alert } from "antd";
import { EyeOutlined } from "@ant-design/icons";

export default function ImageModal({
  showImageModal,
  setShowImageModal,
  selectedImage,
  setSelectedImage,
}) {
  const imgRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!showImageModal || !selectedImage) return;

    setLoading(true);
    setError(false);

    // 🔑 CRITICAL FIX: handle cached images
    setTimeout(() => {
      if (imgRef.current && imgRef.current.complete) {
        setLoading(false);
      }
    }, 50);
  }, [showImageModal, selectedImage]);

  return (
    <Modal
      className="image-modal"
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <EyeOutlined />
          <span>Customer Measurement Photo</span>
        </div>
      }
      open={showImageModal}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: 1000 }}
      onCancel={() => {
        setShowImageModal(false);
        setSelectedImage(null);
        setLoading(true);
        setError(false);
      }}
    >
      {!selectedImage ? (
        <Alert
          type="warning"
          message="No Image"
          description="No measurement photo available."
          showIcon
        />
      ) : (
        <div style={{ position: "relative", textAlign: "center" }}>
          {loading && !error && (
            <div style={{ marginBottom: 12 }}>
              <Spin size="large" tip="Loading image..." />
            </div>
          )}

          {error && (
            <Alert
              type="error"
              message="Failed to load image"
              description={selectedImage}
              showIcon
            />
          )}

          <img
            ref={imgRef}
            src={selectedImage}
            alt="Customer Measurement"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            style={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              display: error ? "none" : "block",
              cursor: "zoom-in",
            }}
            onClick={(e) => e.target.requestFullscreen?.()}
          />
        </div>
      )}
    </Modal>
  );
}
