import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import './AdminLayout.css';
import { supabase } from "../supabaseClient";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // 🌟 ĐÃ BỔ SUNG HÀM ĐÓNG MENU
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            {/* 🌟 THANH HEADER RIÊNG CHO MOBILE CHỨA NÚT 3 GẠCH */}
            <div className="mobile-admin-header">
                <button
                    className="admin-menu-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    ☰
                </button>
                <span className="admin-mobile-title">LIKEFOOD ADMIN</span>
            </div>

            {/* 🌟 THANH SIDEBAR (Thêm class 'open' nếu state là true) */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

                {/* Nút X để đóng menu trên Mobile */}
                <button className="close-sidebar-btn" onClick={closeSidebar}>✕</button>

                <div className="sidebar-logo">BẢNG QUẢN TRỊ</div>

                <ul className="sidebar-menu">
                    <li><Link to="/admin" onClick={closeSidebar}>Quản lý sản phẩm</Link></li>
                    <li><Link to="/admin/manageOrder" onClick={closeSidebar}>Quản lý đơn hàng</Link></li>
                    <li><Link to="/admin/manageUsers" onClick={closeSidebar}>Quản lý người dùng</Link></li>
                </ul>

                {/* Bọc nút đăng xuất vào một thẻ div để dồn xuống cuối bằng CSS */}
                <div className="sidebar-footer">
                    <Link to="/" className="btn-view-shop" onClick={closeSidebar}>
                        Xem giao người dùng
                    </Link>

                    <button className="btn-logout" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Khu vực nội dung bên phải */}
            <div className="admin-content">
                {/* BẬT OUTLET ĐỂ HIỂN THỊ TRANG CON */}
                <Outlet />
            </div>

            {/* Lớp nền mờ tối (Overlay) khi mở menu trên điện thoại */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}
        </div>
    );
}

export default AdminLayout;