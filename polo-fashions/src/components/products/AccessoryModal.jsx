import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

export default function AccessoryModal({ show, onHide, selectedProduct, currentUser, addOrder, category }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const isInnerwear = category === "innerwear";

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

    if (isInnerwear && !selectedSize) {
      setOrderError("Please select a size");
      return;
    }

    const orderData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      orderType: isInnerwear ? "innerwear" : "accessory",
      quantity: quantity,
      size: isInnerwear ? selectedSize : null,
      totalPrice: selectedProduct.price * quantity,
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

              {isInnerwear && selectedProduct.sizes && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Size</Form.Label>
                  <Form.Select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    <option value="">Choose size...</option>
                    {selectedProduct.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: "120px" }}
                />
              </Form.Group>

              <div className="p-3 bg-light rounded mb-3">
                <h6>Order Summary</h6>
                <div className="d-flex justify-content-between">
                  <span>
                    {quantity} × ₹{selectedProduct.price}
                  </span>
                  <strong className="text-primary">
                    ₹{selectedProduct.price * quantity}
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
            (isInnerwear && !selectedSize)
          }
        >
          <ShoppingBag size={18} className="me-1" />
          Place Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}