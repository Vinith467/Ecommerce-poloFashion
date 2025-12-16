import React, { useState , useMemo } from "react";
import { Modal } from "react-bootstrap";
import "./ProductImageGallery.css"; // Create this CSS file also

export default function ProductImageGallery({ product }) {

  // ✅ Memoize images so reference does NOT change every render
  const images = useMemo(() => {
    if (product.images?.length > 0) {
      return product.images.map((img) => img.image);
    }
    if (product.rental_images?.length > 0) {
      return product.rental_images.map((img) => img.image);
    }
    if (product.image) {
      return [product.image];
    }
    return [];
  }, [product]);

  // ✅ Initialize once
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
        show={fullScreen}
        onHide={() => setFullScreen(false)}
        size="xl"
        centered
      >
        <div className="fullscreen-wrapper">
          <button
            className="close-fullscreen"
            onClick={() => setFullScreen(false)}
          >
            ✖
          </button>
          <img src={selectedImage} className="fullscreen-image" alt="" />
        </div>
      </Modal>
    </>
  );
}
