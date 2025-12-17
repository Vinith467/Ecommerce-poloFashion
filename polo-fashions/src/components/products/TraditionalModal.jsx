import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

const STITCHING_CHARGES = {
  shirt: 350,
  dhoti: 300,
  both: 550,
};

export default function TraditionalModal({ show, onHide, selectedProduct, currentUser, addOrder }) {
  const navigate = useNavigate();
  const [wantStitching, setWantStitching] = useState(false);
  const [stitchType, setStitchType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const calcStitchCharge = () => {
    if (!wantStitching || !stitchType) return 0;
    return STITCHING_CHARGES[stitchType] || 0;
  };

  const handlePlaceOrder = async () => {
    setOrderError("");
    setOrderSuccess("");

    if (!currentUser) {
      setOrderError("Please login to place an order");
      return;
    }

    if (!selectedProduct) {
      setOrderError("No product selected");
      return;
    }

    if (wantStitching && !selectedSize) {
      setOrderError("Please select size");
      return;
    }

    const orderData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      orderType: "traditional_custom",
      quantity: 1,
      stitchType: wantStitching ? stitchType : null,
      size: wantStitching ? selectedSize : null,
      stitchingCharge: wantStitching ? calcStitchCharge() : 0,
      totalPrice:
        Number(selectedProduct.price) +
        (wantStitching ? calcStitchCharge() : 0),
    };

    try {
      setPlacing(true);
      const result = await addOrder(orderData);
      setPlacing(false);

      if (result.success) {
        setOrderSuccess("Order placed successfully!");
        setTimeout(() => {
          onHide();
          navigate("/dashboard");
        }, 1200);
      } else {
        setOrderError(result.message || "Failed to place order");
      }
    } catch {
      setPlacing(false);
      setOrderError("Failed to place order");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct?.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {orderSuccess && <Alert variant="success">{orderSuccess}</Alert>}
        {orderError && <Alert variant="danger">{orderError}</Alert>}

        {selectedProduct && (
          <Row>
            <Col md={5}>
              <ProductImageGallery product={selectedProduct} />
              <div className="mt-3">
                <div>
                  <strong>Price:</strong>
                  <span className="text-primary ms-2">
                    ₹{selectedProduct.price}
                  </span>
                </div>
                <div className="text-muted mt-2">
                  {selectedProduct.description}
                </div>
              </div>
            </Col>

            <Col md={7}>
              <hr />
              <h6 className="mb-2">What's inside the box</h6>

              {Array.isArray(selectedProduct.box_items) &&
              selectedProduct.box_items.length > 0 ? (
                <ul className="text-muted mb-3">
                  {selectedProduct.box_items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-3">
                  Box contents will be revealed after order.
                </p>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Do you want stitching?</Form.Label>
                <div>
                  <Button
                    variant={
                      wantStitching ? "primary" : "outline-primary"
                    }
                    size="sm"
                    className="me-2"
                    onClick={() => setWantStitching(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={
                      !wantStitching ? "primary" : "outline-primary"
                    }
                    size="sm"
                    onClick={() => {
                      setWantStitching(false);
                      setStitchType("");
                      setSelectedSize("");
                    }}
                  >
                    No
                  </Button>
                </div>
              </Form.Group>

              {wantStitching && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      What do you want stitched?
                    </Form.Label>
                    <Form.Select
                      value={stitchType}
                      onChange={(e) => setStitchType(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="shirt">Shirt</option>
                      <option value="dhoti">Dhoti</option>
                      <option value="both">Both</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Select Size</Form.Label>
                    <Form.Select
                      value={selectedSize}
                      onChange={(e) =>
                        setSelectedSize(e.target.value)
                      }
                    >
                      <option value="">Select size</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>XXL</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              <div className="p-3 bg-light rounded mb-3">
                <h6>Order Summary</h6>
                <div className="d-flex justify-content-between">
                  <span>Traditional Set</span>
                  <span>₹{selectedProduct.price}</span>
                </div>

                {wantStitching && (
                  <div className="d-flex justify-content-between">
                    <span>Stitching</span>
                    <span>₹{calcStitchCharge()}</span>
                  </div>
                )}

                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong className="text-primary">
                    ₹
                    {Number(selectedProduct.price) +
                      (wantStitching ? calcStitchCharge() : 0)}
                  </strong>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <X size={18} className="me-1" />
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handlePlaceOrder}
          disabled={
            placing ||
            !selectedProduct ||
            (wantStitching && !selectedSize)
          }
        >
          <ShoppingBag size={18} className="me-1" />
          Place Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}