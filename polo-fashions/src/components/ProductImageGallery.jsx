// src/components/ProductImageGallery.jsx
import React, { useState, useMemo } from "react";
import { Modal } from "antd";
import { normalizeImageUrl } from "../utils/imageUtils";
import "./ProductImageGallery.css";
import "../products/ProductModals.css"; 

export default function ProductImageGallery({ product }) {
  // ✅ Memoize and normalize images
  const images = useMemo(() => {
    let imageUrls = [];
    
    if (product.images?.length > 0) {
      imageUrls = product.images.map((img) => normalizeImageUrl(img.image));
    } else if (product.rental_images?.length > 0) {
      imageUrls = product.rental_images.map((img) => normalizeImageUrl(img.image));
    } else if (product.image) {
      imageUrls = [normalizeImageUrl(product.image)];
    }
    
    return imageUrls.filter(Boolean);
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(() => images[0]);
  const [fullScreen, setFullScreen] = useState(false);

  // ✅ Update selected image when images change
  React.useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  return (
    <>
      <div className="gallery-container">
        {/* Thumbnails - Hide on mobile if only one image */}
        {images.length > 1 && (
          <div className="thumb-list">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`thumb ${selectedImage === img ? "active-thumb" : ""}`}
                onClick={() => setSelectedImage(img)}
                alt=""
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/70?text=Error";
                }}
              />
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="main-image-box">
          {selectedImage ? (
            <img
              src={selectedImage}
              className="main-image"
              onClick={() => setFullScreen(true)}
              alt=""
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/380?text=Image+Not+Found";
              }}
            />
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '200px',
              color: '#999'
            }}>
              No image available
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN VIEWER */}
      <Modal
        open={fullScreen}
        onCancel={() => setFullScreen(false)}
        footer={null}
        width="100vw"
        centered
        closable={false}
        transitionName=""
        maskTransitionName=""
        styles={{
          body: {
            padding: 0,
            background: "#000",
            height: "100vh",
          },
        }}
      >
        <div className="ecom-fullscreen">
          <button
            className="ecom-close"
            onClick={() => setFullScreen(false)}
            aria-label="Close"
          >
            ✕
          </button>

          <img
            src={selectedImage}
            alt="Product"
            className="ecom-fullscreen-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/800?text=Image+Not+Found";
            }}
          />
        </div>
      </Modal>
    </>
  );
}