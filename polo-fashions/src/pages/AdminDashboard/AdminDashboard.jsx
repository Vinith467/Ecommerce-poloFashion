import React, { useState } from "react";
import { message } from "antd";
import { useAuth } from "../../context/AuthContext";

// Import separated components
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import DashboardTabs from "./DashboardTabs";
import MeasurementModal from "./MeasurementModal";
import ImageModal from "./ImageModal";
import {
  getBookingColumns,
  getCustomerColumns,
  getOrderColumns,
} from "./tableColumns";

export default function AdminDashboard() {
  const {
    users,
    bookings,
    orders,
    updateBookingStatus,
    updateUserMeasurement,
    updateOrderStatus,
  } = useAuth();

  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ FIX: Filter customer users safely
  const customerUsers = (users || []).filter((u) => u.role === "customer");
  const pendingBookings = (bookings || []).filter(
    (b) => b.status === "pending"
  );
  const processingOrders = (orders || []).filter(
    (o) => o.status === "processing"
  );

  const handleOpenMeasurementModal = (user) => {
    setSelectedUser(user);
    setMeasurements(null);
    setShowMeasurementModal(true);
  };

  const handleSaveMeasurements = async () => {
    if (!measurements) {
      message.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("measurement_photo", measurements);

    const result = await updateUserMeasurement(selectedUser.id, formData);
    setUploading(false);

    if (result.success) {
      message.success("Measurements updated successfully!");
      setShowMeasurementModal(false);
      setMeasurements(null);
    } else {
      message.error("Failed to update measurements");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.success) {
      message.success(`Booking ${newStatus}!`);
    } else {
      message.error("Failed to update booking");
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      message.success("Order status updated successfully");
    } catch (err) {
      message.error(
        err?.response?.data?.error || "Failed to update order status"
      );
    }
  };

  // Generate table columns with handlers
  const bookingColumns = getBookingColumns(handleUpdateBookingStatus);
  const customerColumns = getCustomerColumns(
    handleOpenMeasurementModal,
    setSelectedImage,
    setShowImageModal
  );
  const orderColumns = getOrderColumns(handleOrderStatusUpdate);

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <DashboardHeader />

      <StatsCards
        customerUsers={customerUsers}
        pendingBookings={pendingBookings}
        processingOrders={processingOrders}
        orders={orders}
      />

      <DashboardTabs
        bookings={bookings}
        customerUsers={customerUsers}
        orders={orders}
        bookingColumns={bookingColumns}
        customerColumns={customerColumns}
        orderColumns={orderColumns}
      />

      <MeasurementModal
        showMeasurementModal={showMeasurementModal}
        setShowMeasurementModal={setShowMeasurementModal}
        selectedUser={selectedUser}
        measurements={measurements}
        setMeasurements={setMeasurements}
        uploading={uploading}
        handleSaveMeasurements={handleSaveMeasurements}
      />

      <ImageModal
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
}