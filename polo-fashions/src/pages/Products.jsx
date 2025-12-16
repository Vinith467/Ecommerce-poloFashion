import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Tabs,
  Tab,
} from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import {
  productsAPI,
  fabricsAPI,
  rentalsAPI,
  accessoriesAPI,
  innerwearAPI,
} from "../services/api";
import { ShoppingBag, X } from "lucide-react";
import ProductImageGallery from "../components/ProductImageGallery";

/*
  New approach:
  - "products" are fabrics (price = per meter)
  - User can buy fabric only OR buy fabric + stitching
  - Stitching charges fixed: Shirt 350, Pant 450, Kurta 400
  - Default meter requirements: Shirt 2.3, Pant 1.6, Kurta 2.5
*/

const STITCHING_CHARGES = {
  shirt: 350,
  pant: 450,
  kurta: 400,
  dhoti: 300,
  both: 550,
};

const DEFAULT_METERS = {
  shirt: 2.3,
  pant: 1.6,
  kurta: 2.5,
};

export default function Products({ setCurrentPage }) {
  const { currentUser, addOrder } = useAuth();
  const [products, setProducts] = useState(null); // fabrics
  const [loading, setLoading] = useState(true);

  // modal states
  const [selectedProduct, setSelectedProduct] = useState(null); // fabric
  const [showModal, setShowModal] = useState(false);

  // Rental states
  const [rentalMode, setRentalMode] = useState("rent");
  // rent | buy
  const [rentalDays, setRentalDays] = useState(1);

  // order states inside modal
  const [wantStitching, setWantStitching] = useState(false);
  const [stitchType, setStitchType] = useState(""); // "shirt" | "pant" | "kurta" or ""
  const [meters, setMeters] = useState(1); // default editable
  const [quantity, setQuantity] = useState(1); // for fabric packs if needed (kept for compatibility)
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [placing, setPlacing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("fabrics");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalData = await rentalsAPI.getAll();
        const accessoryData = await accessoriesAPI.getAll();
        const innerwearData = await innerwearAPI.getAll();
        const productData = await productsAPI.getAll(); // ready-made
        const fabricData = await fabricsAPI.getAll(); // fabrics

        setProducts({
          products: productData,
          fabrics: fabricData,
          rentals: rentalData,
          accessories: accessoryData,
          innerwear: innerwearData,
        });
      } catch (error) {
        console.error("Failed to fetch fabrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper: robust measurement check (accept both snake_case and camelCase)
  const measurementDone =
    (currentUser &&
      (currentUser.measurement_status === "completed" ||
        currentUser.measurementStatus === "completed")) ||
    false;

  const openModalForProduct = (product) => {
    // product is a fabric item (price per meter)
    setSelectedProduct(product);
    setOrderError("");
    setOrderSuccess("");
    setWantStitching(false);
    setStitchType("");
    // default meters: show 1 meter as starting value
    setMeters(1);
    setQuantity(1);
    // RENTAL ORDER
    setRentalMode("rent");
    setRentalDays(1);
    setSelectedSize("");

    // Force re-render to ensure latest currentUser is read by modal contents:
    setShowModal(false);
    setTimeout(() => setShowModal(true), 10);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const onSelectStitchType = (type) => {
    setStitchType(type);
    setWantStitching(true);
    // auto-fill meters based on selection, but preserve if user already edited and meters > default
    const defaultMeter = DEFAULT_METERS[type] || 1;
    // Only overwrite if current meters is less than default (so user can increase)
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
  const rentalCost = () => {
    if (!selectedProduct) return 0;
    return rentalDays * Number(selectedProduct.price_per_day);
  };

  const rentalDeposit = () => {
    return Number(selectedProduct.deposit_amount || 0);
  };

  const rentalPayNow = () => {
    return rentalCost() + rentalDeposit();
  };

  const handlePlaceOrder = async () => {
    setOrderError("");
    setOrderSuccess("");
    if (!selectedProduct) {
      setOrderError("No product selected");
      return;
    }
    // ---------------- RENTAL ORDER LOGIC ----------------
    if (isRental) {
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
              closeModal();
              setCurrentPage("dashboard");
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

      // BUY MODE
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
              closeModal();
              setCurrentPage("dashboard");
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
    }

    // ---------------- TRADITIONAL CUSTOM ORDER ----------------
    if (isCustomTraditional) {
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
            closeModal();
            setCurrentPage("dashboard");
          }, 1200);
        } else {
          setOrderError(result.message || "Failed to place order");
        }
      } catch {
        setPlacing(false);
        setOrderError("Failed to place order");
      }

      return;
    }

    if (!currentUser) {
      setOrderError("Please login to place an order");
      return;
    }

    if (!selectedProduct) {
      setOrderError("No product selected");
      return;
    }

    // ---------------- READY-MADE ORDER LOGIC ----------------
    if (isReadyMade) {
      if (!selectedSize) {
        setOrderError("Please select a size");
        return;
      }

      const orderData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        orderType: "readymade",
        quantity: quantity,
        size: selectedSize,
        totalPrice: selectedProduct.price * quantity,
      };

      try {
        setPlacing(true);
        const result = await addOrder(orderData);
        setPlacing(false);

        if (result.success) {
          setOrderSuccess("Order placed successfully!");
          setTimeout(() => {
            closeModal();
            setCurrentPage("dashboard");
          }, 1200);
        } else {
          setOrderError(result.message || "Failed to place order");
        }
      } catch (err) {
        setPlacing(false);
        setOrderError("Failed to place order");
      }

      return; // IMPORTANT: stop here so fabric logic doesn't run
    }

    // ---------------- FABRIC ORDER LOGIC ----------------
    if (isFabric) {
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
            closeModal();
            setCurrentPage("dashboard");
          }, 1200);
        } else {
          setOrderError(result.message || "Failed to place order");
        }
      } catch (err) {
        setPlacing(false);
        setOrderError("Failed to place order");
      }
    }
  };
  let filteredProducts = [];

  if (!products) {
    filteredProducts = [];
  } else {
    if (activeCategory === "fabrics") {
      // fabric model items + custom shirt/pant
      const customProducts = products.products.filter(
        (p) =>
          p.type === "custom" &&
          (p.category === "shirt" || p.category === "pant")
      );

      filteredProducts = [...(products.fabrics || []), ...customProducts];
    } else if (activeCategory === "ready_shirts") {
      filteredProducts = products.products.filter(
        (p) => p.category === "shirt" && p.type === "readymade"
      );
    } else if (activeCategory === "ready_pants") {
      filteredProducts = products.products.filter(
        (p) => p.category === "pant" && p.type === "readymade"
      );
    } else if (activeCategory === "traditional") {
      filteredProducts = products.products.filter(
        (p) => p.category === "traditional"
      );
    } else if (activeCategory === "rentals") {
      filteredProducts = products.rentals || [];
    } else if (activeCategory === "accessories") {
      filteredProducts = products.accessories || [];
    } else if (activeCategory === "innerwear") {
      filteredProducts = products.innerwear || [];
    } else {
      filteredProducts = [];
    }
  }
  const isTraditional = selectedProduct?.category === "traditional";
  const isCustomTraditional =
    isTraditional && selectedProduct?.type === "custom";

  const isFabric = selectedProduct?.type === "custom" && !isTraditional;
  const isReadyMade = selectedProduct?.type === "readymade";
  const isRental = activeCategory === "rentals";

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1>Fabrics & Collections</h1>
        <p className="text-muted">
          Buy fabric or get it stitched — your choice.
        </p>
      </div>

      <Tabs
        activeKey={activeCategory}
        onSelect={(k) => setActiveCategory(k)}
        className="mb-4 justify-content-center"
      >
        <Tab eventKey="fabrics" title="Fabrics" />
        <Tab eventKey="ready_shirts" title="Ready-made Shirts" />
        <Tab eventKey="ready_pants" title="Ready-made Pants" />
        <Tab eventKey="traditional" title="Traditional Wear" />
        <Tab eventKey="rentals" title="Rentals (Blazers)" />
        <Tab eventKey="accessories" title="Accessories" />
        <Tab eventKey="innerwear" title="Innerwear & Loungewear" />
      </Tabs>

      <Row className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id} md={6} lg={4}>
            <div onClick={() => openModalForProduct(product)}>
              <ProductCard
                product={product}
                onClick={() => openModalForProduct(product)}
              />
            </div>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {orderSuccess && <Alert variant="success">{orderSuccess}</Alert>}
          {orderError && <Alert variant="danger">{orderError}</Alert>}

          {selectedProduct &&
            (() => {
              return (
                <Row>
                  <Col md={5}>
                    <ProductImageGallery product={selectedProduct} />
                    <div className="mt-3">
                      <div>
                        <strong>Price:</strong>
                        <span className="text-primary ms-2">
                          {isRental
                            ? rentalMode === "rent"
                              ? `₹${selectedProduct.price_per_day} / day`
                              : `₹${selectedProduct.buy_price}`
                            : isFabric
                            ? `₹${selectedProduct.price} / meter`
                            : `₹${selectedProduct.price}`}
                        </span>
                      </div>

                      <div className="text-muted mt-2">
                        {selectedProduct.description}
                      </div>
                    </div>
                  </Col>

                  <Col md={7}>
                    <hr />
                    {/* TRADITIONAL CUSTOM UI */}
                    {isCustomTraditional && (
                      <>
                        <h6 className="mb-2">What’s inside the box</h6>

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

                        {/* Stitching yes/no */}
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

                        {/* Stitch options */}
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

                        {/* Summary */}
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
                      </>
                    )}

                    {/* FABRIC UI (custom) */}
                    {isFabric && !isCustomTraditional && (
                      <>
                        {/* Stitching yes/no */}
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

                        {/* Stitch type */}
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

                        {/* Meters */}

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

                        {/* Measurement required */}
                        {wantStitching && !measurementDone && (
                          <Alert variant="warning" className="mb-3">
                            <strong>Measurement Required:</strong> Please
                            complete your measurement booking before ordering
                            stitching.
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => {
                                closeModal();
                                setCurrentPage("booking");
                              }}
                            >
                              Book Now
                            </Button>
                          </Alert>
                        )}

                        {/* Fabric pricing summary */}
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
                      </>
                    )}

                    {/* READY-MADE UI */}
                    {isReadyMade && (
                      <>
                        {/* Size selection */}
                        {selectedProduct.sizes && (
                          <Form.Group className="mb-3">
                            <Form.Label>Select Size</Form.Label>
                            <Form.Select
                              value={selectedSize}
                              onChange={(e) => setSelectedSize(e.target.value)}
                            >
                              {selectedProduct.sizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        )}

                        {/* Quantity */}
                        <Form.Group className="mb-3">
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                            style={{ width: "120px" }}
                          />
                        </Form.Group>

                        {/* Ready-made pricing summary */}
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
                      </>
                    )}
                    {isRental && (
                      <>
                        <h6 className="mb-3">Rental Options</h6>

                        {/* Rent / Buy toggle */}
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

                        {/* RENT MODE */}
                        {rentalMode === "rent" && (
                          <>
                            {/* Days */}
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

                            {/* Summary */}
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

                        {/* BUY MODE */}
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
                      </>
                    )}
                  </Col>
                </Row>
              );
            })()}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            <X size={18} className="me-1" />
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePlaceOrder}
            disabled={
              placing ||
              !selectedProduct ||
              (isFabric && (!meters || Number(meters) <= 0)) ||
              (isCustomTraditional && wantStitching && !selectedSize) ||
              (isRental && rentalMode === "rent" && !selectedSize)
            }
          >
            <ShoppingBag size={18} className="me-1" />
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
