import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Alert,
  Typography,
  Divider,
} from "antd";
import { LoginOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setError("");
    setLoading(true);

    const result = await login(values.email, values.password);

    if (result.success) {
      if (result.redirectTo === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
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
        {" "}
        <Card>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <LoginOutlined style={{ fontSize: 42, color: "#1677ff" }} />
            <Title level={3} style={{ marginTop: 12 }}>
              Login
            </Title>
            <Text type="secondary">Welcome back to Polo Fashions</Text>
          </div>

          {error && <Alert type="error" showIcon message={error} />}

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">
              Don&apos;t have an account?{" "}
              <Button type="link" onClick={() => navigate("/register")}>
                Register here
              </Button>
            </Text>
          </div>
          <Divider />
        </Card>
      </Col>
    </Row>
  );
}
