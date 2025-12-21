import React from "react";
import { SettingOutlined } from "@ant-design/icons";

export default function DashboardHeader() {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
        <SettingOutlined style={{ marginRight: 12 }} />
        Admin Dashboard
      </h1>
      <p style={{ color: "#666", marginTop: 8 }}>
        Manage customers, bookings, and orders
      </p>
    </div>
  );
}