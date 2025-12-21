import React from "react";
import { Modal, Image } from "antd";

export default function ImageModal({
  showImageModal,
  setShowImageModal,
  selectedImage,
  setSelectedImage,
}) {
  return (
    <Modal
      open={showImageModal}
      footer={null}
      onCancel={() => {
        setShowImageModal(false);
        setSelectedImage(null);
      }}
      width="80%"
      centered
    >
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="Measurement"
          style={{ width: "100%" }}
          preview={false}
        />
      )}
    </Modal>
  );
}