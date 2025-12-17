import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";

const STITCHING_CHARGES = {
  shirt: 350,
  pant: 450,
  kurta: 400,
};

const DEFAULT_METERS = {
  shirt: 2.3,
  pant: 1.6,
  kurta: 2.5,
};

export default function FabricModal({ show, onHide, selectedProduct, currentUser, addOrder }) {
  const navigate = useNavigate();
  const [wantStitching, setWantStitching] = useState(false);
  const [stitchType, setStitchType] = useState("");
  const [meters, setMeters] = useState(1);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const measurementDone =
    (currentUser &&
      (currentUser.measurement_status === "completed" ||
        currentUser.measurementStatus === "completed")) ||
    false;

  const onSelectStitchType = (type) => {
    setStitchType(type);
    setWantStitching(true);
    const defaultMeter = DEFAULT_METERS[type] || 1;
    setMeters((prev) => (prev < defaultMeter ? defaultMeter : prev));
  };

  const calcFabricCost = () => {
    if (!selectedProduct) return 0;
    const pricePerMeter = Number(
      selectedProduct.price || selectedProduct.fabric_price || 0
    );
    return Number((pricePerMeter * Number(meters || 0)).toFixed(2));
  };

  const calcStitchCharge = () => {
    if (!wantStitching || !stitchType) return 0;
    return STITCHING_CHARGES[stitchType] || 0;
  };

  const calcTotal = () => {
    return Number((calcFabricCost() + calcStitchCharge()).toFixed(2));
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

    if (!meters || Number(meters) <= 0) {
      setOrderError("Please enter a valid meter value");
      return;
    }

    if (wantStitching && !measurementDone) {
      setOrderError("Please complete your measurement booking first");
      return;
    }

    if (wantStitching && !stitchType) {
      setOrderError("Please select a stitching type");
      return;
    }

    const orderData = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      orderType: wantStitching ? "fabric_with_stitching" : "fabric_only",
      meters: Number(meters),
      stitchType: wantStitching ? stitchType : null,
      stitchingCharge: wantStitching ? calcStitchCharge() : 0,
      fabricPricePerMeter: Number(selectedProduct.price),
      totalPrice: calcTotal(),
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
    } catch (err) {
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
                    ₹{selectedProduct.price} / meter
                  </span>
                </div>
                <div className="text-muted mt-2">
                  {selectedProduct.description}
                </div>
              </div>
            </Col>

            <Col md={7}>
              <hr />
              <Form.Group className="mb-3">
                <Form.Label>
                  Do you want stitching with this fabric?
                </Form.Label>
                <div>
                  <Button
                    variant={
                      wantStitching ? "primary" : "outline-primary"
                    }
                    className="me-2"
                    size="sm"
                    onClick={() => {
                      setWantStitching(true);
                      if (!stitchType) {
                        setStitchType("shirt");
                        setMeters((prev) =>
                          prev < DEFAULT_METERS["shirt"]
                            ? DEFAULT_METERS["shirt"]
                            : prev
                        );
                      }
                    }}
                  >
                    Yes, stitch it
                  </Button>

                  <Button
                    variant={
                      !wantStitching ? "primary" : "outline-primary"
                    }
                    size="sm"
                    onClick={() => {
                      setWantStitching(false);
                      setStitchType("");
                      setMeters(1);
                    }}
                  >
                    No, just buy fabric
                  </Button>
                </div>
              </Form.Group>

              {wantStitching && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Stitch Type</Form.Label>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant={
                        stitchType === "shirt"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => onSelectStitchType("shirt")}
                    >
                      Shirt — ₹{STITCHING_CHARGES.shirt}
                    </Button>

                    <Button
                      variant={
                        stitchType === "pant"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => onSelectStitchType("pant")}
                    >
                      Pant — ₹{STITCHING_CHARGES.pant}
                    </Button>

                    <Button
                      variant={
                        stitchType === "kurta"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => onSelectStitchType("kurta")}
                    >
                      Kurta — ₹{STITCHING_CHARGES.kurta}
                    </Button>
                  </div>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Meters required</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={meters}
                  onChange={(e) => setMeters(Number(e.target.value))}
                  style={{ width: "140px" }}
                />
              </Form.Group>

              {wantStitching && !measurementDone && (
                <Alert variant="warning" className="mb-3">
                  <strong>Measurement Required:</strong> Please
                  complete your measurement booking before ordering
                  stitching.
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      onHide();
                      navigate("/booking");
                    }}
                  >
                    Book Now
                  </Button>
                </Alert>
              )}

              <div className="p-3 bg-light rounded mb-3">
                <h6>Order Summary</h6>
                <div className="d-flex justify-content-between">
                  <span>Fabric ({meters} m)</span>
                  <span>₹{calcFabricCost()}</span>
                </div>
                {wantStitching && (
                  <div className="d-flex justify-content-between">
                    <span>Stitching ({stitchType})</span>
                    <span>₹{calcStitchCharge()}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary">
                    ₹{calcTotal()}
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
            (!meters || Number(meters) <= 0)
          }
        >
          <ShoppingBag size={18} className="me-1" />
          Place Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
