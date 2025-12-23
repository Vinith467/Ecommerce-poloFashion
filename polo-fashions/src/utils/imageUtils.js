// src/utils/imageUtils.js

/**
 * Normalizes image URLs from the backend
 * Handles both Cloudinary URLs and local development URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dvtq5lk6c';

export const normalizeImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/120?text=No+Image";
  
  // If already a full URL (starts with http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a Cloudinary path (starts with 'image/upload/')
  if (url.startsWith('image/upload/')) {
    return `${CLOUDINARY_BASE}/${url}`;
  }
  
  // If it starts with /media/, prepend the backend base URL
  if (url.startsWith('/media/')) {
    return `${BASE_URL}${url}`;
  }
  
  // If URL doesn't start with /, add /media/ prefix
  if (!url.startsWith('/')) {
    return `${BASE_URL}/media/${url}`;
  }
  
  // Fallback: prepend base URL
  return `${BASE_URL}${url}`;
};

/**
 * Gets the first available image from an order object
 * with proper priority handling
 */
export const getOrderImage = (order) => {
  if (!order) return "https://via.placeholder.com/120?text=No+Image";
  
  let imageUrl = null;

  // Priority 1: Multi-image arrays (for products with multiple images)
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
  
  // Check for multi-image arrays first
  if (product.images?.length > 0) {
    imageUrl = product.images[0].image;
  } else if (product.rental_images?.length > 0) {
    imageUrl = product.rental_images[0].image;
  } else {
    // Fallback to single image field
    imageUrl = product.image;
  }
  
  return normalizeImageUrl(imageUrl);
};