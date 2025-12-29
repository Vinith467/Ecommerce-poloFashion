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
        padding: "40px 20px",
        marginTop: 64,
      }}
    >
      <Row
        gutter={[24, 32]}
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* BRAND */}
        <Col xs={24} md={8}>
          <div className="footer-section footer-brand">
            <Title level={4} style={{ color: "#fff", marginBottom: 12 }}>
              Polo Fashions
            </Title>
            <Text className="footer-text">
              Your trusted partner for custom tailoring and premium ready-made
              traditional wear.
            </Text>
            <div style={{ marginTop: 12 }}>
              <Text className="footer-text highlight">
                Get your dress ready in as soon as 1–2 hours!
              </Text>
            </div>
          </div>
        </Col>

        {/* CONTACT */}
        <Col xs={24} sm={12} md={8}>
          <div className="footer-section">
            <Title level={5} style={{ color: "#fff" }}>
              Contact Info
            </Title>

            <div className="footer-item">
              <EnvironmentOutlined />
              <Text className="footer-text">
                #GF-30, Anjuman-Eslamiya Complex,<br />
                T.V.S Road, Kollegal – 571440
              </Text>
            </div>

            <div className="footer-item">
              <PhoneOutlined />
              <Text className="footer-text">+91 97424 45626</Text>
            </div>

            <div className="footer-item">
              <MailOutlined />
              <Text className="footer-text">
                vinuvinith0007@gmail.com
              </Text>
            </div>
          </div>
        </Col>

        {/* BUSINESS HOURS */}
        <Col xs={24} sm={12} md={8}>
          <div className="footer-section">
            <Title level={5} style={{ color: "#fff" }}>
              Business Hours
            </Title>

            <div className="footer-item">
              <ClockCircleOutlined />
              <div>
                <Text className="footer-text">
                  Monday – Saturday
                </Text>
                <br />
                <Text className="footer-text">
                  9:30 AM – 10:00 PM
                </Text>
              </div>
            </div>

            <div className="footer-item" style={{ marginTop: 8 }}>
              <ClockCircleOutlined style={{ visibility: "hidden" }} />
              <div>
                <Text className="footer-text">
                  Sunday
                </Text>
                <br />
                <Text className="footer-text">
                  10:00 AM – 6:00 PM
                </Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Divider
        style={{
          borderColor: "rgba(255,255,255,0.2)",
          margin: "32px 0 16px",
        }}
      />

      <div style={{ textAlign: "center" }}>
        <Text className="footer-text small">
          © {new Date().getFullYear()} Polo Fashions. All rights reserved.
        </Text>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .footer-section {
          text-align: left;
        }

        .footer-brand {
          text-align: left;
        }

        .footer-text {
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
          line-height: 1.6;
        }

        .footer-text.small {
          font-size: 13px;
        }

        .footer-text.highlight {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .footer-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .footer-item svg {
          font-size: 16px;
          margin-top: 4px;
          color: #facc15;
        }

        @media (max-width: 768px) {
          .footer-section,
          .footer-brand {
            text-align: center;
          }

          .footer-item {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
