import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import './AdminLayout.css';
import { supabase } from "../supabaseClient";

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="admin-wrapper">
            {/* Thanh menu bên trái */}
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <h2>BẢNG QUẢN TRỊ</h2>
                </div>
                <ul className="admin-menu">
                    <li>
                        <Link to="/admin" className="admin-link">Quản lý sản phẩm</Link>
                    </li>
                    <li>
                        <Link to="#" className="admin-link">Quản lý đơn hàng</Link>
                    </li>
                    <li>
                        <Link to="#" className="admin-link">Quản lý người dùng</Link>
                    </li>
                </ul>

                <div className="admin-footer">
                    <button className="btn-admin-logout" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h3>Xin chào, Admin!</h3>
                    <Link to="/" className="btn-back-shop">
                        Xem trang khách hàng
                    </Link>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;