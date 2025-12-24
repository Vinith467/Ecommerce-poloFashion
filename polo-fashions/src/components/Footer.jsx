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
        padding: "32px 24px",
        marginTop: 64,
      }}
    >
      <Row gutter={[24, 24]}>
        {/* BRAND */}
        <Col xs={24} sm={24} md={8}>
          <Title level={4} style={{ color: "#fff" }}>
            Polo Fashions
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.75)" }}>
            Your trusted partner for custom tailoring and premium ready-made
            traditional wear.
            <div style={{ marginTop: 8 }}>
              Get Your Dress Ready in as soon as 1-2 Hours Only at Polo
              Fashions!
            </div>
          </Text>
        </Col>

        {/* CONTACT */}
        <Col xs={24} sm={12} md={8}>
          <Title level={5} style={{ color: "#fff" }}>
            Contact Info
          </Title>

          <div style={{ marginBottom: 8 }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>
              #GF-30, Anjuman-Eslamiya Complex, T.V.S. Road Kollegal-571 440
            </Text>
          </div>

          <div style={{ marginBottom: 8 }}>
            <PhoneOutlined style={{ marginRight: 8 }} />
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>
              +91 9742445626
            </Text>
          </div>

          <div>
            <MailOutlined style={{ marginRight: 8 }} />
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>
              vinuvinith0007@gmail.com
            </Text>
          </div>
        </Col>

        {/* BUSINESS HOURS */}
        <Col xs={24} sm={12} md={8}>
          <Title level={5} style={{ color: "#fff" }}>
            Business Hours
          </Title>

          <div style={{ display: "flex", gap: 8 }}>
            <ClockCircleOutlined />
            <div>
              <Text style={{ color: "rgba(255,255,255,0.75)" }}>
                Monday - Saturday: 9:30 AM - 10:00 PM
              </Text>
              <br />
              <Text style={{ color: "rgba(255,255,255,0.75)" }}>
                Sunday: 10:00 AM - 6:00 PM
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      <Divider
        style={{ borderColor: "rgba(255,255,255,0.2)", margin: "24px 0 16px" }}
      />

      <Row justify="center">
        <Text style={{ color: "rgba(255,255,255,0.65)", textAlign: "center" }}>
          © {new Date().getFullYear()} Polo Fashions. All rights reserved.
        </Text>
      </Row>
    </footer>
  );
}