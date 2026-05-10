# Chuẩn Hóa Kích Thước Ảnh Đầu Vào

## Mục đích
Tài liệu này mô tả cách chuẩn hóa kích thước ảnh đầu vào trong ứng dụng Like Food Frontend để đảm bảo nhất quán về giao diện và hiệu suất.

## Tệp liên quan

### 1. **src/utils/imageUtils.js**
Chứa các hàm tiện ích để xử lý ảnh:
- `IMAGE_SIZES`: Định nghĩa các kích thước tiêu chuẩn (CARD, THUMBNAIL, DETAIL, PRODUCT_LIST)
- `getOptimizedImageUrl()`: Tạo URL ảnh được tối ưu hóa với kích thước cụ thể
- `normalizeImageDimensions()`: Chuẩn hóa kích thước ảnh theo tiêu chuẩn
- `isValidImageUrl()`: Kiểm tra tính hợp lệ của URL ảnh
- `getAspectRatio()`: Tính toán tỷ lệ khung hình

### 2. **src/components/OptimizedImage.jsx** & **src/components/OptimizedImage.css**
Thành phần React tái sử dụng để hiển thị ảnh chuẩn hóa:
- Tự động điều chỉnh kích thước ảnh
- Hỗ trợ lazy loading
- Hiển thị placeholder trong khi tải
- Animation shimmer khi tải ảnh

**Props:**
- `src`: URL của ảnh
- `alt`: Text thay thế (bắt buộc)
- `size`: Preset kích thước (CARD, THUMBNAIL, DETAIL, PRODUCT_LIST)
- `width`: Chiều rộng tùy chỉnh (tính bằng pixel)
- `height`: Chiều cao tùy chỉnh (tính bằng pixel)
- `lazy`: Bật/tắt lazy loading (mặc định: true)
- `onLoad`, `onError`: Callback khi tải xong/lỗi

### 3. **src/components/Card.jsx**
Cập nhật để sử dụng `OptimizedImage` cho:
- Ảnh chính trong slider sản phẩm (PRODUCT_LIST: 300x210px)
- Ảnh trong popup mua nhanh (THUMBNAIL: 80x80px)

### 4. **src/pages/user/ProductDetail.jsx**
Cập nhật để sử dụng `OptimizedImage` cho:
- Ảnh chi tiết sản phẩm (DETAIL: 600x500px)
- Ảnh thumbnail (THUMBNAIL: 120x120px)
- Ảnh cover trong popup (CARD: 400x200px)

## Kích thước tiêu chuẩn

| Size | Chiều rộng | Chiều cao | Sử dụng |
|------|-----------|----------|--------|
| CARD | 300px | 250px | Card sản phẩm chính |
| THUMBNAIL | 120px | 120px | Ảnh nhỏ, preview |
| DETAIL | 600px | 500px | Trang chi tiết sản phẩm |
| PRODUCT_LIST | 280px | 210px | Slider ảnh trong card |

## Cách sử dụng

### 1. Nhập thành phần
```jsx
import OptimizedImage from '../../components/OptimizedImage';
import { IMAGE_SIZES, getOptimizedImageUrl } from '../../utils/imageUtils';
```

### 2. Sử dụng với preset
```jsx
<OptimizedImage 
  src={imageUrl}
  alt="Tên sản phẩm"
  size="CARD"
  lazy={true}
/>
```

### 3. Sử dụng với kích thước tùy chỉnh
```jsx
<OptimizedImage 
  src={imageUrl}
  alt="Mô tả"
  width={400}
  height={300}
  lazy={false}
/>
```

### 4. Tạo URL tối ưu trực tiếp
```jsx
const optimizedUrl = getOptimizedImageUrl(originalUrl, 300, 250);
<img src={optimizedUrl} alt="Ảnh" />
```

## Hiệu suất

- **Lazy Loading**: Ảnh chỉ tải khi cần thiết, tiết kiệm băng thông
- **Placeholder**: Hiển thị loading animation trong khi tải
- **Responsive**: Tự động thích ứng với các screen khác nhau
- **Caching**: Trình duyệt tự động cache ảnh đã tải

## CSS Hỗ Trợ

OptimizedImage component bao gồm các styles:
- `.optimized-image-container`: Container chính
- `.optimized-image`: Thẻ img
- `.image-skeleton`: Loading animation
- Animation shimmer cho UX tốt hơn

## Hỗ Trợ Trình duyệt

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Hỗ trợ retina displays (2x DPI)

## Ghi chú

1. **Placeholder mặc định**: Nếu không có URL, component sẽ sử dụng placeholder từ via.placeholder.com
2. **Aspect Ratio**: CSS tự động duy trì tỷ lệ khung hình đúng
3. **Error Handling**: Nếu ảnh không tải được, sẽ hiển thị placeholder error
4. **Mobile**: Tất cả kích thước được tối ưu cho thiết bị di động

## Phát triển trong tương lai

- [ ] Thêm hỗ trợ WebP
- [ ] Tích hợp CDN image optimization
- [ ] Thêm blur hash placeholder
- [ ] Hỗ trợ srcset cho responsive images
- [ ] Image compression server-side
