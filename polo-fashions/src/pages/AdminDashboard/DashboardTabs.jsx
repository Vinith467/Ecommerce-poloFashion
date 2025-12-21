import React from "react";
import { Card, Tabs, Table, Empty } from "antd";

export default function DashboardTabs({
  bookings,
  customerUsers,
  orders,
  bookingColumns,
  customerColumns,
  orderColumns,
}) {
  return (
    <Card>
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
                />
              ) : (
                <Table
                  rowKey="id"
                  columns={bookingColumns}
                  dataSource={bookings}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
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
                />
              ) : (
                <Table
                  rowKey="id"
                  columns={customerColumns}
                  dataSource={customerUsers}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
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
                />
              ) : (
                <Table
                  rowKey="id"
                  columns={orderColumns}
                  dataSource={orders}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1200 }}
                />
              ),
          },
        ]}
      />
    </Card>
  );
}