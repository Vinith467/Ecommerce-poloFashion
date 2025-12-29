import React from "react";
import { Modal, Spin, Alert } from "antd";
import { EyeOutlined } from "@ant-design/icons";

export default function ImageModal({
  showImageModal,
  setShowImageModal,
  selectedImage,
  setSelectedImage,
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (showImageModal && selectedImage) {
      setLoading(true);
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
        setLoading(false);
        setError(false);
      }}
      width="90%"
      style={{ maxWidth: 1000 }}
      centered
      styles={{
        body: {
          padding: 16,
          minHeight: 400,
        },
      }}
    >
      {!selectedImage ? (
        <Alert
          message="No Image"
          description="No measurement photo available for this customer."
          type="warning"
          showIcon
        />
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          {loading && (
            <div style={{ marginBottom: 12 }}>
              <Spin size="large" tip="Loading image..." />
            </div>
          )}

          {error && (
            <Alert
              message="Failed to Load Image"
              description={selectedImage}
              type="error"
              showIcon
            />
          )}

          <img
            key={selectedImage}
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
              cursor: "zoom-in",
            }}
            onClick={(e) => e.target.requestFullscreen?.()}
          />
        </div>
      )}
    </Modal>
  );
}
