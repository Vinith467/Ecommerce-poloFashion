import React, { useRef } from "react";
import { Modal, Button, Alert, Space, message } from "antd";
import {
  UploadOutlined,
  CameraOutlined,
} from "@ant-design/icons";

/**
 * Compress image using canvas (for large camera images)
 */
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 1280;
      const scale = Math.min(1, MAX_WIDTH / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        0.7 // quality (70%)
      );
    };

    reader.readAsDataURL(file);
  });
};

export default function MeasurementModal({
  showMeasurementModal,
  setShowMeasurementModal,
  selectedUser,
  measurements,
  setMeasurements,
  uploading,
  handleSaveMeasurements,
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed");
      return;
    }

    let finalFile = file;

    // 📸 Compress if file is larger than 5MB (camera images)
    if (file.size / 1024 / 1024 > 5) {
      message.loading("Compressing image...", 0);
      finalFile = await compressImage(file);
      message.destroy();
    }

    // Final safety check
    if (finalFile.size / 1024 / 1024 > 5) {
      message.error("Image is still larger than 5MB after compression");
      return;
    }

    setMeasurements(finalFile);
  };

  return (
    <Modal
      title={`Upload Measurement - ${selectedUser?.username}`}
      open={showMeasurementModal}
      onCancel={() => {
        setShowMeasurementModal(false);
        setMeasurements(null);
      }}
      onOk={handleSaveMeasurements}
      confirmLoading={uploading}
      okButtonProps={{ disabled: !measurements }}
      okText="Save"
      centered
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {selectedUser?.measurement_photo && (
          <Alert
            type="info"
            message="Existing measurement photo will be replaced"
            showIcon
          />
        )}

        {/* 📁 Upload from device */}
        <Button
          icon={<UploadOutlined />}
          block
          onClick={() => fileInputRef.current.click()}
        >
          Upload from Device
        </Button>

        {/* 📸 Capture from camera */}
        <Button
          icon={<CameraOutlined />}
          block
          onClick={() => cameraInputRef.current.click()}
        >
          Capture Using Camera
        </Button>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={handleFileSelect}
        />

        {measurements && (
          <Alert
            type="success"
            message={`Selected: ${measurements.name}`}
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
}
