import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

export default function RentalModal({ show, onHide, selectedProduct, currentUser, addOrder }) {
  const navigate = useNavigate();
  const [rentalMode, setRentalMode] = useState("rent");
  const [rentalDays, setRentalDays] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const rentalCost = () => {
    if (!selectedProduct) return 0;
    return rentalDays * Number(selectedProduct.price_per_day);
  };

  const rentalDeposit = () => {
    return Number(selectedProduct?.deposit_amount || 0);
  };

  const rentalPayNow = () => {
    return rentalCost() + rentalDeposit();
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

    if (rentalMode === "rent") {
      if (!selectedSize) {
        setOrderError("Please select a size");
        return;
      }

      const orderData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        orderType: "rental",
        rentalMode: "rent",
        size: selectedSize,
        rentalDays: rentalDays,
        rentalPricePerDay: selectedProduct.price_per_day,
        rentalDeposit: rentalDeposit(),
        total_price: rentalCost(),
        totalPrice: rentalPayNow(),
      };

      try {
        setPlacing(true);
        const result = await addOrder(orderData);
        setPlacing(false);

        if (result.success) {
          setOrderSuccess("Rental order placed successfully!");
          setTimeout(() => {
            onHide();
            navigate("/dashboard");
          }, 1200);
        } else {
          setOrderError(result.message || "Failed to place rental order");
        }
      } catch {
        setPlacing(false);
        setOrderError("Failed to place rental order");
      }

      return;
    }

    if (rentalMode === "buy") {
      const orderData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        orderType: "rental_buy",
        size: selectedSize || null,
        totalPrice: selectedProduct.buy_price,
      };

      try {
        setPlacing(true);
        const result = await addOrder(orderData);
        setPlacing(false);

        if (result.success) {
          setOrderSuccess("Product purchased successfully!");
          setTimeout(() => {
            onHide();
            navigate("/dashboard");
          }, 1200);
        } else {
          setOrderError(result.message || "Failed to buy product");
        }
      } catch {
        setPlacing(false);
        setOrderError("Failed to buy product");
      }

      return;
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
                    {rentalMode === "rent"
                      ? `₹${selectedProduct.price_per_day} / day`
                      : `₹${selectedProduct.buy_price}`}
                  </span>
                </div>
                <div className="text-muted mt-2">
                  {selectedProduct.description}
                </div>
              </div>
            </Col>

            <Col md={7}>
              <hr />
              <h6 className="mb-3">Rental Options</h6>

              <Form.Group className="mb-3">
                <Form.Label>Choose Option</Form.Label>
                <div>
                  <Button
                    size="sm"
                    className="me-2"
                    variant={
                      rentalMode === "rent"
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() => setRentalMode("rent")}
                  >
                    Rent
                  </Button>

                  <Button
                    size="sm"
                    variant={
                      rentalMode === "buy"
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() => setRentalMode("buy")}
                  >
                    Buy
                  </Button>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Size</Form.Label>
                    <Form.Select
                      value={selectedSize}
                      onChange={(e) =>
                        setSelectedSize(e.target.value)
                      }
                    >
                      <option value="">Select size</option>
                      {selectedProduct.sizes?.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </Form.Group>

              {rentalMode === "rent" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Number of Days</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={rentalDays}
                      onChange={(e) =>
                        setRentalDays(Number(e.target.value))
                      }
                      style={{ width: "120px" }}
                    />
                  </Form.Group>

                  <div className="p-3 bg-light rounded mb-3">
                    <h6>Order Summary</h6>

                    <div className="d-flex justify-content-between">
                      <span>
                        Rent ({rentalDays} × ₹
                        {selectedProduct.price_per_day})
                      </span>
                      <span>₹{rentalCost()}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span>Refundable Deposit</span>
                      <span>₹{rentalDeposit()}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <strong>Pay Now</strong>
                      <strong className="text-primary">
                        ₹{rentalPayNow()}
                      </strong>
                    </div>

                    <small className="text-muted d-block mt-2">
                      ⚠ Deposit will be refunded after return. Extra
                      charges may apply for damage, stains, or
                      cleaning.
                    </small>
                  </div>
                </>
              )}

              {rentalMode === "buy" && (
                <div className="p-3 bg-light rounded mb-3">
                  <h6>Buy Price</h6>
                  <div className="d-flex justify-content-between">
                    <span>Blazer Price</span>
                    <strong className="text-primary">
                      ₹{selectedProduct.buy_price}
                    </strong>
                  </div>
                </div>
              )}
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
            (rentalMode === "rent" && !selectedSize)
          }
        >
          <ShoppingBag size={18} className="me-1" />
          Place Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
