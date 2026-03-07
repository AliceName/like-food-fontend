# ==========================================
# BƯỚC 1: XÂY DỰNG (BUILD) DỰ ÁN VỚI NODE.JS
# ==========================================
FROM node:18-alpine as build

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy 2 file quản lý thư viện vào trước để cài đặt
COPY package.json package-lock.json ./

# Cài đặt các thư viện (node_modules)
RUN npm install

# Copy toàn bộ code dự án của bạn vào container
COPY . .

# Tiến hành dịch code React thành code Web tĩnh (HTML, CSS, JS)
# Với Vite, code sau khi build sẽ nằm trong thư mục /app/dist
RUN npm run build

# ==========================================
# BƯỚC 2: CHẠY WEB VỚI MÁY CHỦ NGINX
# ==========================================
FROM nginx:alpine

# Copy code đã được dịch ở Bước 1 sang thư mục phát sóng của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 để cho phép truy cập web
EXPOSE 80

# Lệnh khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]