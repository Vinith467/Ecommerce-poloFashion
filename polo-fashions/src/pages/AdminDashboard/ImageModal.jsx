import React, { useEffect, useState } from "react";
import { Modal, Spin, Alert } from "antd";
import { EyeOutlined } from "@ant-design/icons";

export default function ImageModal({
  showImageModal,
  setShowImageModal,
  selectedImage,
  setSelectedImage,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (showImageModal && selectedImage) {
      // 🔑 Reset states EVERY TIME modal opens
      setImageLoaded(false);
      setError(false);
    }
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
      onCancel={() => {
        setShowImageModal(false);
        setSelectedImage(null);
        setImageLoaded(false);
        setError(false);
      }}
      width="90%"
      style={{ maxWidth: 1000 }}
      centered
    >
      {!selectedImage ? (
        <Alert
          message="No Image"
          description="No measurement photo available."
          type="warning"
          showIcon
        />
      ) : (
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* ✅ Spinner ONLY if image not loaded */}
          {!imageLoaded && !error && (
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
            key={selectedImage} // 🔑 forces re-render for cached images
            src={selectedImage}
            alt="Customer Measurement"
            onLoad={() => setImageLoaded(true)}
            onError={() => setError(true)}
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
