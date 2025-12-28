import React, { useState } from "react";
import { message, Table, Tabs, Card, Empty } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Import separated components
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import MeasurementModal from "./MeasurementModal";
import ImageModal from "./ImageModal";

// Import mobile components
import MobileBookingTable from "./MobileBookingTable";
import MobileCustomerTable from "./MobileCustomerTable";
import MobileOrderTable from "./MobileOrderTable";

import {
  getBookingColumns,
  getCustomerColumns,
  getOrderColumns,
} from "./tableColumns";

// Import CSS
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const {
    users,
    bookings,
    orders,
    updateBookingStatus,
    updateUserMeasurement,
    updateOrderStatus,
  } = useAuth();
  const navigate = useNavigate();

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

  const handleViewImage = (imageUrl) => {
      console.log("🖼️ Viewing image:", imageUrl);
      if (!imageUrl) {
    message.error("No image URL provided");
    return;
  }

    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };
  

  // Generate table columns with handlers
  const bookingColumns = getBookingColumns(handleUpdateBookingStatus);
  const customerColumns = getCustomerColumns(
    handleOpenMeasurementModal,
    setSelectedImage,
    setShowImageModal
  );
  const orderColumns = getOrderColumns(handleOrderStatusUpdate, navigate);

  return (
    <div className="admin-dashboard-container">
      <DashboardHeader />

      <StatsCards
        customerUsers={customerUsers}
        pendingBookings={pendingBookings}
        processingOrders={processingOrders}
        orders={orders}
      />

      {/* TABS WITH RESPONSIVE TABLES */}
      <Card className="dashboard-tabs">
        <Tabs
          defaultActiveKey="bookings"
          items={[
            {
              key: "bookings",
              label: `📅 Bookings (${(bookings || []).length})`,
              children:
                bookings.length === 0 ? (
                  <Empty
                    description="No bookings yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="empty-state-mobile"
                  />
                ) : (
                  <>
                    {/* DESKTOP TABLE */}
                    <div className="desktop-table-view">
                      <Table
                        rowKey="id"
                        columns={bookingColumns}
                        dataSource={bookings}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                      />
                    </div>

                    {/* MOBILE CARDS */}
                    <MobileBookingTable
                      bookings={bookings}
                      onUpdateStatus={handleUpdateBookingStatus}
                    />
                  </>
                ),
            },
            {
              key: "customers",
              label: `👥 Customers (${customerUsers.length})`,
              children:
                customerUsers.length === 0 ? (
                  <Empty
                    description="No customers yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="empty-state-mobile"
                  />
                ) : (
                  <>
                    {/* DESKTOP TABLE */}
                    <div className="desktop-table-view">
                      <Table
                        rowKey="id"
                        columns={customerColumns}
                        dataSource={customerUsers}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                      />
                    </div>

                    {/* MOBILE CARDS */}
                    <MobileCustomerTable
                      customers={customerUsers}
                      onOpenMeasurement={handleOpenMeasurementModal}
                      onViewImage={handleViewImage}
                    />
                  </>
                ),
            },
            {
              key: "orders",
              label: `🛍️ Orders (${(orders || []).length})`,
              children:
                orders.length === 0 ? (
                  <Empty
                    description="No orders yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="empty-state-mobile"
                  />
                ) : (
                  <>
                    {/* DESKTOP TABLE */}
                    <div className="desktop-table-view">
                      <Table
                        rowKey="id"
                        columns={orderColumns}
                        dataSource={orders}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1200 }}
                      />
                    </div>

                    {/* MOBILE CARDS */}
                    <MobileOrderTable
                      orders={orders}
                      onUpdateStatus={handleOrderStatusUpdate}
                      onNavigate={navigate}
                    />
                  </>
                ),
            },
          ]}
        />
      </Card>

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