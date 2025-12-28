import React from "react";
import { Tag, Button, Space } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function MobileBookingTable({ bookings, onUpdateStatus }) {
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "orange", icon: <ClockCircleOutlined /> },
      confirmed: { color: "blue", icon: <CheckCircleOutlined /> },
      completed: { color: "green", icon: <CheckCircleOutlined /> },
      cancelled: { color: "red", icon: null },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="mobile-cards-view">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.status);
        
        return (
          <div key={booking.id} className="mobile-booking-card">
            {/* HEADER */}
            <div className="booking-card-header">
              <span className="booking-id">#{booking.id}</span>
              <Tag icon={statusConfig.icon} color={statusConfig.color}>
                {booking.status.toUpperCase()}
              </Tag>
            </div>

            {/* BODY - INFO GRID */}
            <div className="booking-card-body">
              <div className="booking-info-row">
                <span className="booking-label">Customer</span>
                <span className="booking-value">{booking.customer_name}</span>
              </div>

              <div className="booking-info-row">
                <span className="booking-label">Email</span>
                <span className="booking-value mobile-text-truncate" style={{ maxWidth: '180px' }}>
                  {booking.email}
                </span>
              </div>

              <div className="booking-info-row">
                <span className="booking-label">Phone</span>
                <span className="booking-value">{booking.phone}</span>
              </div>

              <div className="booking-info-row">
                <span className="booking-label">Date</span>
                <span className="booking-value">{formatDate(booking.date)}</span>
              </div>

              <div className="booking-info-row">
                <span className="booking-label">Time</span>
                <span className="booking-value">{booking.time}</span>
              </div>
            </div>

            {/* ACTIONS */}
            {booking.status !== "completed" && booking.status !== "cancelled" && (
              <div className="booking-actions">
                {booking.status === "pending" && (
                  <>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => onUpdateStatus(booking.id, "confirmed")}
                      className="mobile-action-btn"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="large"
                      onClick={() => onUpdateStatus(booking.id, "completed")}
                      className="mobile-action-btn"
                    >
                      Complete
                    </Button>
                  </>
                )}
                {booking.status === "confirmed" && (
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={() => onUpdateStatus(booking.id, "completed")}
                    className="mobile-action-btn"
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}