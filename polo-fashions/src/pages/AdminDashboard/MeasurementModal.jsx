import React from "react";
import { Modal, Upload, Button, Alert, Space, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function MeasurementModal({
  showMeasurementModal,
  setShowMeasurementModal,
  selectedUser,
  measurements,
  setMeasurements,
  uploading,
  handleSaveMeasurements,
}) {
  return (
    <Modal
      title={
        <Space>
          <UploadOutlined />
          <span>Upload Measurement - {selectedUser?.username}</span>
        </Space>
      }
      open={showMeasurementModal}
      onCancel={() => {
        setShowMeasurementModal(false);
        setMeasurements(null);
      }}
      onOk={handleSaveMeasurements}
      confirmLoading={uploading}
      okText="Upload"
      okButtonProps={{ disabled: !measurements }}
    >
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: "#666", marginBottom: 12 }}>
          Upload customer measurement photo for future custom orders.
        </p>

        {selectedUser?.measurement_photo && (
          <Alert
            type="info"
            message="Current measurement photo exists"
            description="Uploading a new photo will replace the existing one."
            showIcon
            style={{ marginBottom: 12 }}
          />
        )}
      </div>

      <Upload
        beforeUpload={(file) => {
          // Validate file type
          const isImage = file.type.startsWith("image/");
          if (!isImage) {
            message.error("You can only upload image files!");
            return false;
          }

          // Validate file size (max 5MB)
          const isLt5M = file.size / 1024 / 1024 < 5;
          if (!isLt5M) {
            message.error("Image must be smaller than 5MB!");
            return false;
          }

          setMeasurements(file);
          return false; // Prevent auto upload
        }}
        onRemove={() => setMeasurements(null)}
        maxCount={1}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />} block>
          Select Image File
        </Button>
      </Upload>

      {measurements && (
        <Alert
          type="success"
          message={`Selected: ${measurements.name}`}
          style={{ marginTop: 12 }}
        />
      )}
    </Modal>
  );
}