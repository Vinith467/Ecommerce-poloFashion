import React, { useState } from "react";
import { message, Table, Tabs, Card, Empty } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import MeasurementModal from "./MeasurementModal";
import ImageModal from "./ImageModal";

import MobileBookingTable from "./MobileBookingTable";
import MobileCustomerTable from "./MobileCustomerTable";
import MobileOrderTable from "./MobileOrderTable";

import {
  getBookingColumns,
  getCustomerColumns,
  getOrderColumns,
} from "./tableColumns";
import { normalizeImageUrl } from "../../utils/imageUtils";

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

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("bookings");
  const [activeOrderStatus, setActiveOrderStatus] = useState("all");

  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  /* ================= SEARCH HELPER ================= */
  const matchesSearch = (text) => {
    if (!searchText) return true;
    return text?.toString().toLowerCase().includes(searchText.toLowerCase());
  };

  /* ================= FILTERED DATA ================= */

  const customerUsers = (users || [])
    .filter((u) => u.role === "customer")
    .filter(
      (u) =>
        matchesSearch(u.username) ||
        matchesSearch(u.phone) ||
        matchesSearch(u.email)
    );

  const pendingBookings = (bookings || []).filter(
    (b) => b.status === "pending"
  );

  const filteredBookings = (bookings || []).filter(
    (b) => matchesSearch(b.user_name) || matchesSearch(b.phone)
  );

  const statusFilteredOrders =
    activeOrderStatus === "all"
      ? orders
      : (orders || []).filter((o) => o.status === activeOrderStatus);

  const filteredOrders = statusFilteredOrders.filter(
    (o) =>
      matchesSearch(o.id) ||
      matchesSearch(o.customer_name) ||
      matchesSearch(o.phone)
  );

  /* ================= HANDLERS ================= */

  const handleOpenMeasurementModal = (user) => {
    setSelectedUser(user);
    setMeasurements(null);
    setShowMeasurementModal(true);
  };

  const handleSaveMeasurements = async () => {
    if (!measurements) {
      message.error("Please select a file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("measurement_photo", measurements);

    const result = await updateUserMeasurement(selectedUser.id, formData);
    setUploading(false);

    if (result.success) {
      message.success("Measurements updated");
      setShowMeasurementModal(false);
    } else {
      message.error("Update failed");
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    const result = await updateBookingStatus(id, status);
    result.success
      ? message.success("Booking updated")
      : message.error("Update failed");
  };

  const handleOrderStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      message.success("Order updated");
    } catch {
      message.error("Update failed");
    }
  };

  const handleViewImage = (url) => {
    if (!url) return message.error("No image");
    setSelectedImage(normalizeImageUrl(url));
    setShowImageModal(true);
  };

  const bookingColumns = getBookingColumns(handleUpdateBookingStatus);
  const customerColumns = getCustomerColumns(
    handleOpenMeasurementModal,
    handleViewImage
  );
  const orderColumns = getOrderColumns(handleOrderStatusUpdate, navigate);

  return (
    <div className="admin-dashboard-container">
      <DashboardHeader />

      <StatsCards
        customerUsers={customerUsers}
        pendingBookings={pendingBookings}
        orders={orders}
        showOrderStatusFilters={activeTab === "orders"}
        activeOrderStatus={activeOrderStatus}
        onStatusSelect={setActiveOrderStatus}
      />
      {/* GLOBAL SEARCH */}
      <Card style={{ marginBottom: 20 }}>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by customer name, phone number, or order ID..."
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: 15,
            borderRadius: 6,
            border: "1px solid #d9d9d9",
          }}
        />
      </Card>

      <Card className="dashboard-tabs">
        <Tabs
          defaultActiveKey="bookings"
          onChange={(key) => {
            setActiveTab(key);
            if (key !== "orders") setActiveOrderStatus("all");
          }}
          items={[
            {
              key: "bookings",
              label: `📅 Bookings (${filteredBookings.length})`,
              children: (
                <>
                  <div className="desktop-table-view">
                    <Table
                      rowKey="id"
                      columns={bookingColumns}
                      dataSource={filteredBookings}
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                  <MobileBookingTable
                    bookings={filteredBookings}
                    onUpdateStatus={handleUpdateBookingStatus}
                  />
                </>
              ),
            },
            {
              key: "customers",
              label: `👥 Customers (${customerUsers.length})`,
              children: (
                <>
                  <div className="desktop-table-view">
                    <Table
                      rowKey="id"
                      columns={customerColumns}
                      dataSource={customerUsers}
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
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
              label: `🛍️ Orders (${filteredOrders.length})`,
              children: (
                <>
                  <div className="desktop-table-view">
                    <Table
                      rowKey="id"
                      columns={orderColumns}
                      dataSource={filteredOrders}
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                  <MobileOrderTable
                    orders={filteredOrders}
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
      />
    </div>
  );
}
