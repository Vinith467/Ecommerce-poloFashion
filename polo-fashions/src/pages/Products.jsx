import React, { useState, useEffect, useMemo } from "react";
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

// Product modals
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
    console.log("🔵 Opening modal for product:", product);
    console.log("🔵 Active category:", activeCategory);
    setSelectedProduct(product);
    setShowModal(false);
    setTimeout(() => setShowModal(true), 10);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  /* ================= ✅ FIXED: FILTER LOGIC WITH useMemo ================= */

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    // ✅ Always return a NEW array for each category
    switch (activeCategory) {
      case "fabrics": {
        const customProducts = products.products.filter(
          (p) =>
            p.type === "custom" &&
            (p.category === "shirt" || p.category === "pant")
        );
        return [...products.fabrics, ...customProducts];
      }

      case "ready_shirts":
        return products.products.filter(
          (p) => p.category === "shirt" && p.type === "readymade"
        );

      case "ready_pants":
        return products.products.filter(
          (p) => p.category === "pant" && p.type === "readymade"
        );

      case "traditional":
        return products.products.filter((p) => p.category === "traditional");

      case "rentals":
        return [...products.rentals]; // ✅ Return new array

      case "accessories":
        return [...products.accessories]; // ✅ Return new array

      case "innerwear":
        return [...products.innerwear]; // ✅ Return new array

      default:
        return [];
    }
  }, [products, activeCategory]); // ✅ Recalculate only when these change

  /* ================= MODAL TYPE LOGIC ================= */

  const isFabricModal = activeCategory === "fabrics" && selectedProduct;
  const isTraditional =
    selectedProduct?.category === "traditional" &&
    selectedProduct?.type !== "readymade";
  const isReadyMade = selectedProduct && selectedProduct.type === "readymade";
  const isRental = activeCategory === "rentals" && selectedProduct;
  const isAccessory =
    (activeCategory === "accessories" || activeCategory === "innerwear") &&
    selectedProduct;

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
            <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
              <ProductCard
                product={product}
                onClick={() => openModalForProduct(product)}
              />
            </Col>
          ))
        )}
      </Row>

      {/* ================= MODALS ================= */}

      {isFabricModal && (
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

      {isTraditional && (
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
