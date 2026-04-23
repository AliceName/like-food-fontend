# 🍕 LIKEFOOD - Hệ thống Quản lý & Đặt món ăn Trực tuyến

LIKEFOOD là một ứng dụng web hiện đại được xây dựng để hỗ trợ quản lý thực đơn và đặt món ăn trực tuyến. Dự án tập trung vào trải nghiệm người dùng mượt mà, khả năng quản trị mạnh mẽ và tích hợp các công nghệ đám mây tiên tiến.

---

## 🚀 Tính năng nổi bật

### 👤 Cho khách hàng
* **Trang chủ:** Hiển thị danh sách món ăn bắt mắt với bộ lọc thông minh.
* **Thanh tìm kiếm:** Công cụ tìm kiếm nhanh chóng tích hợp ngay trên Navbar, sử dụng hàm `ilike` của PostgreSQL để tìm kiếm không phân biệt dấu/hoa thường.
* **Chi tiết sản phẩm:** Xem thông tin chi tiết, hình ảnh và gợi ý các món ăn liên quan cùng danh mục.
* **Giỏ hàng & Mua nhanh:** Quy trình chọn món và đặt hàng (Quick Buy) tối ưu hóa trải nghiệm người dùng.
* **Responsive Design:** Giao diện hiển thị hoàn hảo trên mọi thiết bị (Mobile, Tablet, Desktop) nhờ thiết kế Grid và Media Queries.

### 🛠 Cho quản trị viên (Admin)
* **Bảng điều khiển (Dashboard):** Thống kê tổng quan đơn hàng và trạng thái món ăn.
* **Quản lý Sản phẩm (CRUD):** Thêm, sửa, xóa món ăn với giao diện trực quan.
* **Tải ảnh thông minh:** Tích hợp **Supabase Storage** cho phép tải ảnh trực tiếp từ máy tính lên Cloud và tự động lấy URL công khai.
* **Chuẩn hóa Dữ liệu:** Sử dụng hệ thống danh mục (Categories) với liên kết khóa ngoại (Foreign Key) để quản lý thực đơn khoa học.
* **Bảo mật (RLS):** Thiết lập Row Level Security trên Supabase để bảo vệ kho lưu trữ ảnh và dữ liệu sản phẩm.

---

## 🛠 Công nghệ sử dụng

* **Frontend:** React.js, React Router v6.
* **Backend & Database:** Supabase (PostgreSQL).
* **Storage:** Supabase Storage (Quản lý file hình ảnh).
* **Styling:** CSS3 hiện đại (Flexbox, Grid, Responsive Design).
* **Công cụ hỗ trợ:** Canva (Thiết kế logo/banner), Vercel/Netlify (Triển khai).

---

## 🏗 Cấu trúc Cơ sở dữ liệu

Dự án được thiết kế theo mô hình quan hệ để đảm bảo tính toàn vẹn dữ liệu:
* **Table `categories`**: Lưu trữ các nhóm món ăn (Cá khô, Tôm mực khô, Trà bánh mứt, Gia vị...).
* **Table `products`**: Lưu trữ thông tin món ăn, liên kết với danh mục qua `category_id`.
* **Table `profiles`**: Quản lý thông tin người dùng và phân quyền `role` (Admin/User).

---

## 💻 Hướng dẫn cài đặt & Chạy dự án

1. **Clone dự án:**
   ```bash
   git clone [https://github.com/your-username/like-food-frontend.git](https://github.com/your-username/like-food-frontend.git)
   cd like-food-frontend
2. **Cài đặt thư viện:**
    npm install
3. **Cấu hình biến môi trường:**
Tạo file .env ở thư mục gốc và thêm thông tin kết nối Supabase của bạn:

    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
4. **Chạy dự án ở chế độ Development:**

    npm run dev
