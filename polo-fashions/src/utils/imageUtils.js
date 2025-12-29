// src/utils/imageUtils.js

/**
 * Normalizes image URLs from the backend
 * Handles both Cloudinary URLs and local development URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

export const normalizeImageUrl = (url) => {
  if (!url) {
    return "https://via.placeholder.com/120?text=No+Image";
  }

  // ✅ Cloudinary or any absolute URL
  if (url.startsWith("http")) {
    return url;
  }

  // ❌ No local media support anymore
  return "https://via.placeholder.com/120?text=No+Image";
};


/**
 * Gets the first available image from an order object
 * with proper priority handling
 */
export const getOrderImage = (order) => {
  if (!order) return "https://via.placeholder.com/120?text=No+Image";

  let imageUrl = null;

  // Priority 1: Multi-image arrays
  if (order.product_details?.images?.length > 0) {
    imageUrl = order.product_details.images[0].image;
  } else if (order.rental_item_details?.images?.length > 0) {
    imageUrl = order.rental_item_details.images[0].image;
  }

  // Priority 2: Single image fields
  if (!imageUrl) {
    imageUrl =
      order.fabric_details?.image ||
      order.rental_item_details?.image ||
      order.accessory_details?.image ||
      order.innerwear_details?.image ||
      order.product_details?.image;
  }

  return normalizeImageUrl(imageUrl);
};

/**
 * Gets the first available image from a product object
 */
export const getProductImage = (product) => {
  if (!product) return "https://via.placeholder.com/120?text=No+Image";

  let imageUrl = null;

  if (product.images?.length > 0) {
    imageUrl = product.images[0].image;
  } else if (product.rental_images?.length > 0) {
    imageUrl = product.rental_images[0].image;
  } else {
    imageUrl = product.image;
  }

  return normalizeImageUrl(imageUrl);
};