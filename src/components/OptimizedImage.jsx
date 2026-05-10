import React, { useState } from 'react';
import { normalizeImageDimensions, isValidImageUrl } from '../utils/imageUtils';
import './OptimizedImage.css';

/**
 * OptimizedImage Component
 * Chuẩn hóa kích thước ảnh đầu vào với placeholder
 * 
 * @component
 * @param {string} src - Image source URL
 * @param {string} alt - Alternative text for image
 * @param {string} size - Size preset: CARD, THUMBNAIL, DETAIL, PRODUCT_LIST
 * @param {string} className - Additional CSS classes
 * @param {number} width - Custom width (overrides size preset)
 * @param {number} height - Custom height (overrides size preset)
 * @param {boolean} lazy - Enable lazy loading
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails to load
 */
const OptimizedImage = ({
    src,
    alt = 'Image',
    size = 'CARD',
    className = '',
    width,
    height,
    lazy = true,
    onLoad,
    onError,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Normalize image dimensions
    const imageData = normalizeImageDimensions(src || '', size);

    // Use custom dimensions if provided
    const finalWidth = width || imageData.width;
    const finalHeight = height || imageData.height;
    const imageUrl = !hasError ? imageData.url : `https://via.placeholder.com/${finalWidth}x${finalHeight}?text=Image+Error`;

    const handleImageLoad = (e) => {
        setIsLoaded(true);
        onLoad?.(e);
    };

    const handleImageError = (e) => {
        setHasError(true);
        setIsLoaded(true);
        onError?.(e);
    };

    return (
        <div
            className={`optimized-image-container ${className} ${isLoaded ? 'loaded' : 'loading'}`}
            style={{
                width: finalWidth,
                height: finalHeight,
                aspectRatio: `${finalWidth} / ${finalHeight}`,
            }}
        >
            <img
                src={imageUrl}
                alt={alt}
                width={finalWidth}
                height={finalHeight}
                loading={lazy ? 'lazy' : 'eager'}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="optimized-image"
                {...props}
            />
            {!isLoaded && (
                <div className="image-skeleton" />
            )}
        </div>
    );
};

export default OptimizedImage;
