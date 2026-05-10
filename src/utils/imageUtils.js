/**
 * Image Normalization Utilities
 * Chuẩn hóa kích thước ảnh đầu vào
 */

// Standard image dimensions for different use cases
export const IMAGE_SIZES = {
  CARD: {
    width: 300,
    height: 250,
  },
  THUMBNAIL: {
    width: 120,
    height: 120,
  },
  DETAIL: {
    width: 600,
    height: 500,
  },
  PRODUCT_LIST: {
    width: 280,
    height: 210,
  },
};

/**
 * Generates optimized image URL with specified dimensions
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, width = 300, height = 250) => {
  if (!imageUrl) {
    return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
  }

  // Handle picsum.photos URLs
  if (imageUrl.includes('picsum.photos')) {
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
  }

  // Handle placehold.co URLs
  if (imageUrl.includes('placehold.co')) {
    return `https://placehold.co/${width}x${height}`;
  }

  // Handle placeholder.com URLs
  if (imageUrl.includes('via.placeholder.com')) {
    return `https://via.placeholder.com/${width}x${height}`;
  }

  // For Supabase or other external URLs, return as is
  return imageUrl;
};

/**
 * Normalizes image dimensions for display
 * @param {string} imageUrl - Image URL to normalize
 * @param {string} sizePreset - Preset size key (CARD, THUMBNAIL, DETAIL, PRODUCT_LIST)
 * @returns {object} - Object with width and height properties
 */
export const normalizeImageDimensions = (imageUrl, sizePreset = 'CARD') => {
  const preset = IMAGE_SIZES[sizePreset] || IMAGE_SIZES.CARD;
  return {
    url: getOptimizedImageUrl(imageUrl, preset.width, preset.height),
    width: preset.width,
    height: preset.height,
    aspectRatio: preset.width / preset.height,
  };
};

/**
 * Validates image URL
 * @param {string} imageUrl - URL to validate
 * @returns {boolean} - True if valid URL format
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  try {
    new URL(imageUrl);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets aspect ratio from dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - CSS aspect ratio value
 */
export const getAspectRatio = (width, height) => {
  return `${width} / ${height}`;
};

/**
 * Generates srcSet for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {array} sizes - Array of sizes to generate
 * @returns {string} - srcSet string for responsive images
 */
export const generateSrcSet = (baseUrl, sizes = [280, 560, 840]) => {
  if (!isValidImageUrl(baseUrl)) return '';
  
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, size, size)} ${size}w`)
    .join(', ');
};

/**
 * Gets placeholder image with specified dimensions
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @param {string} text - Text to display on placeholder
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 250, text = 'No Image') => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};

export default {
  IMAGE_SIZES,
  getOptimizedImageUrl,
  normalizeImageDimensions,
  isValidImageUrl,
  getAspectRatio,
  generateSrcSet,
  getPlaceholderImage,
};
