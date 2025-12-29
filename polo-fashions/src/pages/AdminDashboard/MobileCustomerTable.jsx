// src/pages/AdminDashboard/MobileCustomerTable.jsx
import React from "react";
import { Tag, Button } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
export default function MobileCustomerTable({
  customers,
  onOpenMeasurement,
  onViewImage,
}) {
  return (
    <div className="mobile-cards-view">
      {customers.map((customer) => {
        const isCompleted = customer.measurement_status === "completed";

        return (
          <div key={customer.id} className="mobile-customer-card">
            {/* HEADER */}
            <div className="customer-card-header">
              <div className="customer-main-info">
                <div className="customer-username">{customer.username}</div>
                <div className="customer-email mobile-text-truncate">
                  {customer.email}
                </div>
              </div>
              <Tag
                icon={
                  isCompleted ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
                color={isCompleted ? "green" : "orange"}
              >
                {isCompleted ? "Done" : "Pending"}
              </Tag>
            </div>

            {/* BODY */}
            <div className="customer-card-body">
              <div className="customer-info-item">
                <span className="booking-label">ID</span>
                <span className="booking-value">#{customer.id}</span>
              </div>

              {customer.phone && (
                <div className="customer-info-item">
                  <span className="booking-label">Phone</span>
                  <span className="booking-value">{customer.phone}</span>
                </div>
              )}

              <div className="customer-info-item">
                <span className="booking-label">Measurement</span>
                <Tag
                  icon={
                    isCompleted ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    )
                  }
                  color={isCompleted ? "green" : "orange"}
                >
                  {isCompleted ? "Completed" : "Pending"}
                </Tag>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="customer-actions">
              {customer.measurement_photo && (
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    onViewImage(customer.measurement_photo);
                  }}
                  className="mobile-action-btn"
                >
                  View Photo
                </Button>
              )}
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => onOpenMeasurement(customer)}
                className="mobile-action-btn"
              >
                {isCompleted ? "Update" : "Upload"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
