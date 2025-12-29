import React, { useRef } from "react";
import { Modal, Button, Alert, Space, message } from "antd";
import {
  UploadOutlined,
  CameraOutlined,
} from "@ant-design/icons";

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed");
      return;
    }

    if (file.size / 1024 / 1024 > 5) {
      message.error("Image must be smaller than 5MB");
      return;
    }

    setMeasurements(file);
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
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">

        {selectedUser?.measurement_photo && (
          <Alert
            type="info"
            message="Existing measurement photo will be replaced"
            showIcon
          />
        )}

        {/* 📁 Upload from Gallery */}
        <Button
          icon={<UploadOutlined />}
          block
          onClick={() => fileInputRef.current.click()}
        >
          Upload from Device
        </Button>

        {/* 📸 Capture from Camera */}
        <Button
          icon={<CameraOutlined />}
          block
          onClick={() => cameraInputRef.current.click()}
        >
          Capture Using Camera
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />

        {/* Hidden camera input */}
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
