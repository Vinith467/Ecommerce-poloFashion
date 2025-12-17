import React from "react";
import { Row, Col, Typography, Divider } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Footer() {
  return (
    <footer
      style={{
        background: "#001529",
        color: "#fff",
        padding: "48px 40px",
        marginTop: 64,
      }}
    >
      <Row gutter={[32, 32]}>
        {/* BRAND */}
        <Col xs={24} md={8}>
          <Title level={4} style={{ color: "#fff" }}>
            Polo Fashions
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.75)" }}>
            Your trusted partner for custom tailoring and premium ready-made
            traditional wear.
          </Text>
        </Col>

        {/* CONTACT */}
        <Col xs={24} md={8}>
          <Title level={5} style={{ color: "#fff" }}>
            Contact Info
          </Title>

          <div style={{ marginBottom: 8 }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>
              123 Fashion Street, Bangalore, Karnataka 560001
            </Text>
          </div>

          <div style={{ marginBottom: 8 }}>
            <PhoneOutlined style={{ marginRight: 8 }} />
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>
              +91 98765 43210
            </Text>
          </div>

          <div>
            <MailOutlined style={{ marginRight: 8 }} />
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>
              info@polofashions.com
            </Text>
          </div>
        </Col>

        {/* BUSINESS HOURS */}
        <Col xs={24} md={8}>
          <Title level={5} style={{ color: "#fff" }}>
            Business Hours
          </Title>

          <div style={{ display: "flex", gap: 8 }}>
            <ClockCircleOutlined />
            <div>
              <Text style={{ color: "rgba(255,255,255,0.75)" }}>
                Monday - Saturday: 10:00 AM - 8:00 PM
              </Text>
              <br />
              <Text style={{ color: "rgba(255,255,255,0.75)" }}>
                Sunday: 11:00 AM - 6:00 PM
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      <Divider style={{ borderColor: "rgba(255,255,255,0.2)", margin: "32px 0" }} />

      <Row justify="center">
        <Text style={{ color: "rgba(255,255,255,0.65)" }}>
          © {new Date().getFullYear()} Polo Fashions. All rights reserved.
        </Text>
      </Row>
    </footer>
  );
}
