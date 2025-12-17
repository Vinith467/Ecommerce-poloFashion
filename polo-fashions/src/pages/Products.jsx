import React, { useState, useEffect } from "react";
import { Tabs, Row, Col, Skeleton, Empty } from "antd";
import { useAuth } from "../context/AuthContext";
import {
  productsAPI,
  fabricsAPI,
  rentalsAPI,
  accessoriesAPI,
  innerwearAPI,
} from "../services/api";
import ProductCard from "../components/ProductCard";

// Product modals (UNCHANGED)
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
        console.error("Failed to fetch products:", error);
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

  /* ================= FILTER LOGIC (UNCHANGED) ================= */

  let filteredProducts = [];

  if (products) {
    if (activeCategory === "fabrics") {
      const customProducts = products.products.filter(
        (p) =>
          p.type === "custom" &&
          (p.category === "shirt" || p.category === "pant")
      );
      filteredProducts = [...products.fabrics, ...customProducts];
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
      filteredProducts = products.rentals;
    } else if (activeCategory === "accessories") {
      filteredProducts = products.accessories;
    } else if (activeCategory === "innerwear") {
      filteredProducts = products.innerwear;
    }
  }

  /* ================= MODAL TYPE LOGIC (UNCHANGED) ================= */

  const isTraditional = selectedProduct?.category === "traditional";
  const isCustomTraditional =
    isTraditional && selectedProduct?.type === "custom";
  const isFabric = selectedProduct?.type === "custom" && !isTraditional;
  const isReadyMade = selectedProduct?.type === "readymade";
  const isRental = activeCategory === "rentals";
  const isAccessory =
    activeCategory === "accessories" || activeCategory === "innerwear";

  /* ================= UI ================= */

  return (
    <div style={{ padding: 40 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1>Fabrics & Collections</h1>
        <p style={{ color: "#777" }}>
          Buy fabric or get it stitched — your choice.
        </p>
      </div>

      <Tabs
        activeKey={activeCategory}
        onChange={setActiveCategory}
        centered
        items={[
          { key: "fabrics", label: "Fabrics" },
          { key: "ready_shirts", label: "Ready-made Shirts" },
          { key: "ready_pants", label: "Ready-made Pants" },
          { key: "traditional", label: "Traditional Wear" },
          { key: "rentals", label: "Rentals (Blazers)" },
          { key: "accessories", label: "Accessories" },
          { key: "innerwear", label: "Innerwear & Loungewear" },
        ]}
      />

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Col key={i} span={8}>
              <Skeleton active />
            </Col>
          ))
        ) : filteredProducts.length === 0 ? (
          <Col span={24}>
            <Empty description="No products available" />
          </Col>
        ) : (
          filteredProducts.map((product) => (
            <Col key={product.id} span={8}>
              <ProductCard
                product={product}
                onClick={() => openModalForProduct(product)}
              />
            </Col>
          ))
        )}
      </Row>

      {/* ================= MODALS (UNCHANGED) ================= */}

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
    </div>
  );
}
