import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Alert,
  Select,
  DatePicker,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function Booking() {
  const navigate = useNavigate();
  const { currentUser, addBooking } = useAuth();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form] = Form.useForm();

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM",
  ];

  const handleSubmit = async (values) => {
    setSuccess("");
    setError("");

    if (!currentUser) {
      setError("Please login to book an appointment");
      return;
    }

    // ✅ FIXED FIELD NAME
    if (currentUser.measurementStatus === "completed") {
      setError("You already have measurements on file. You can start shopping!");
      return;
    }

    const payload = {
      name: values.name,
      phone: values.phone,
      email: currentUser.email,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time,
    };

    const result = await addBooking(payload);

    if (result.success) {
      setSuccess(result.message);
      form.resetFields(["date", "time"]);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  };

  /* ===================== LOGIN REQUIRED ===================== */

  if (!currentUser) {
    return (
      <Row justify="center" style={{ padding: 80 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>          <Alert
            type="warning"
            showIcon
            message="Login Required"
            description="Please login to book a measurement appointment."
            action={
              <Button type="primary" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            }
          />
        </Col>
      </Row>
    );
  }

  /* ===================== UI ===================== */

  return (
    <Row justify="center" style={{ padding: 40 }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>        <Card>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <CalendarOutlined style={{ fontSize: 40, color: "#1677ff" }} />
            <Title level={3} style={{ marginTop: 12 }}>
              Book Measurement Appointment
            </Title>
            <Text type="secondary">
              Schedule your visit for professional measurements
            </Text>
          </div>

          {success && <Alert type="success" showIcon message={success} />}
          {error && <Alert type="error" showIcon message={error} />}

          {currentUser.measurementStatus === "completed" ? (
            <Alert
              type="info"
              showIcon
              message="You're all set!"
              description="Your measurements are already on file."
              action={
                <Button type="primary" onClick={() => navigate("/products")}>
                  Browse Products
                </Button>
              }
            />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                name: currentUser.username,
                phone: currentUser.phone,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      readOnly
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true }]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      readOnly
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Preferred Date"
                name="date"
                rules={[{ required: true }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(d) => d.isBefore(dayjs(), "day")}
                />
              </Form.Item>

              <Form.Item
                label="Preferred Time Slot"
                name="time"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a time slot"
                  suffixIcon={<ClockCircleOutlined />}
                >
                  {timeSlots.map((slot) => (
                    <Select.Option key={slot} value={slot}>
                      {slot}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
              >
                Book Appointment
              </Button>
            </Form>
          )}

          <Card style={{ marginTop: 24, background: "#fafafa" }}>
            <Title level={5}>What to Expect</Title>
            <ul style={{ color: "#777", paddingLeft: 16 }}>
              <li>Appointment duration: 15–20 minutes</li>
              <li>Professional measurements for perfect fit</li>
              <li>One-time visit required</li>
              <li>Shop online anytime after measurement</li>
            </ul>
          </Card>
        </Card>
      </Col>
    </Row>
  );
}
