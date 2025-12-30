import React, { useState } from "react";
import { Row, Col, Card, Form, Input, Button, Alert, Typography } from "antd";
import {
  UserAddOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Extra safety
      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Split name
      const nameParts = values.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const result = await register({
        username: values.email.trim().split("@")[0],
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
        password2: values.confirmPassword,
        first_name: firstName,
        last_name: lastName,
      });

      if (result.success) {
        setSuccess(result.message || "Registration successful");
        form.resetFields(); // ✅ reset form
        setTimeout(() => navigate("/login"), 2000);
      } else {
        if (typeof result.message === "object") {
          const firstError = Object.values(result.message)
            .flat()
            .join(" ");
          setError(firstError);
        } else {
          setError(result.message || "Registration failed");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // ✅ IMPORTANT FIX
    }
  };

  return (
    <Row
      justify="center"
      style={{
        padding: "24px 12px",
        minHeight: "calc(100vh - 64px)",
        alignItems: "center",
      }}
    >
      <Col xs={24} sm={22} md={16} lg={12} xl={10}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <UserAddOutlined style={{ fontSize: 42, color: "#1677ff" }} />
            <Title level={3} style={{ marginTop: 12 }}>
              Create Account
            </Title>
            <Text type="secondary">Join Polo Fashions today</Text>
          </div>

          {error && <Alert type="error" showIcon message={error} />}
          {success && <Alert type="success" showIcon message={success} />}

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Enter your full name" }]}
            >
              <Input prefix={<UserAddOutlined />} />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Enter phone number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              ]}
            >
              <Input prefix={<PhoneOutlined />} maxLength={10} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Enter password" },
                { min: 8, message: "Password must be at least 8 characters" },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: "Password must contain letters and numbers",
                },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Register
            </Button>
          </Form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">
              Already have an account?{" "}
              <Button type="link" onClick={() => navigate("/login")}>
                Login here
              </Button>
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
