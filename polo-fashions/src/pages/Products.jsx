import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  productsAPI,
  fabricsAPI,
  rentalsAPI,
  accessoriesAPI,
  innerwearAPI,
} from "../services/api";
import ProductCard from "../components/ProductCard";

// Import product modals
import FabricModal from "../components/products/FabricModal";
import ReadyMadeModal from "../components/products/ReadyMadeModal";
import TraditionalModal from "../components/products/TraditionalModal";
import RentalModal from "../components/products/RentalModal";
import AccessoryModal from "../components/products/AccessoryModal";

export default function Products() {
  const { currentUser, addOrder } = useAuth();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("fabrics");

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalData = await rentalsAPI.getAll();
        const accessoryData = await accessoriesAPI.getAll();
        const innerwearData = await innerwearAPI.getAll();
        const productData = await productsAPI.getAll();
        const fabricData = await fabricsAPI.getAll();

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

  const openModalForProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(false);
    setTimeout(() => setShowModal(true), 10);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Filter products based on active category
  let filteredProducts = [];

  if (!products) {
    filteredProducts = [];
  } else {
    if (activeCategory === "fabrics") {
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

  // Determine product type
  const isTraditional = selectedProduct?.category === "traditional";
  const isCustomTraditional = isTraditional && selectedProduct?.type === "custom";
  const isFabric = selectedProduct?.type === "custom" && !isTraditional;
  const isReadyMade = selectedProduct?.type === "readymade";
  const isRental = activeCategory === "rentals";
  const isAccessory = activeCategory === "accessories" || activeCategory === "innerwear";

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

      {/* Render appropriate modal based on product type */}
      {isFabric && !isCustomTraditional && (
        <FabricModal
          show={showModal}
          onHide={closeModal}
          selectedProduct={selectedProduct}
          currentUser={currentUser}
          addOrder={addOrder}
        />
      )}

      {isReadyMade && (
        <ReadyMadeModal
          show={showModal}
          onHide={closeModal}
          selectedProduct={selectedProduct}
          currentUser={currentUser}
          addOrder={addOrder}
        />
      )}

      {isCustomTraditional && (
        <TraditionalModal
          show={showModal}
          onHide={closeModal}
          selectedProduct={selectedProduct}
          currentUser={currentUser}
          addOrder={addOrder}
        />
      )}

      {isRental && (
        <RentalModal
          show={showModal}
          onHide={closeModal}
          selectedProduct={selectedProduct}
          currentUser={currentUser}
          addOrder={addOrder}
        />
      )}

      {isAccessory && (
        <AccessoryModal
          show={showModal}
          onHide={closeModal}
          selectedProduct={selectedProduct}
          currentUser={currentUser}
          addOrder={addOrder}
          category={activeCategory}
        />
      )}
    </Container>
  );
}