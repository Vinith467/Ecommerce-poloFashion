import React, { useState, useMemo } from "react";
import { Modal } from "antd";
import "./ProductImageGallery.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
// ✅ Helper function to normalize image URLs
const normalizeImageUrl = (url) => {
  if (!url) return null;
  
  // If URL is already absolute (starts with http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL is relative, prepend the base URL
  return `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
};

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
    
    return imageUrls.filter(Boolean); // Remove any null/undefined values
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(() => images[0]);
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <>
      <div className="gallery-container">
        {/* Thumbnails */}
        <div className="thumb-list">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              className={`thumb ${selectedImage === img ? "active-thumb" : ""}`}
              onClick={() => setSelectedImage(img)}
              alt=""
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="main-image-box">
          <img
            src={selectedImage}
            className="main-image"
            onClick={() => setFullScreen(true)}
            alt=""
          />
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
          />
        </div>
      </Modal>
    </>
  );
}