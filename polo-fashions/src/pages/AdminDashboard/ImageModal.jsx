import React from "react";
import { Modal, Spin, Alert } from "antd";
import { EyeOutlined } from "@ant-design/icons";

export default function ImageModal({
  showImageModal,
  setShowImageModal,
  selectedImage,
  setSelectedImage,
}) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (showImageModal) {
      setLoading(true);
      setError(false);
    }
  }, [showImageModal, selectedImage]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
    console.error("❌ Failed to load image:", selectedImage);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EyeOutlined />
          <span>Customer Measurement Photo</span>
        </div>
      }
      open={showImageModal}
      footer={null}
      onCancel={() => {
        setShowImageModal(false);
        setSelectedImage(null);
        setLoading(true);
        setError(false);
      }}
      width="90%"
      style={{ maxWidth: 1000 }}
      centered
      styles={{
        body: {
          padding: 20,
          minHeight: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
        <div style={{ 
          width: '100%', 
          textAlign: 'center',
          position: 'relative',
        }}>
          {loading && (
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <Spin size="large" tip="Loading image..." />
            </div>
          )}
          
          {error && (
            <Alert
              message="Failed to Load Image"
              description={`Could not load image from: ${selectedImage}`}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          <img
            src={selectedImage}
            alt="Customer Measurement"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "70vh",
              objectFit: "contain",
              display: loading ? 'none' : 'block',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
    </Modal>
  );
}