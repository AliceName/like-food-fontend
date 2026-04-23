import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient'

import logoImg from "../assets/img/logo-lf.png";
import userImg from "../assets/img/user.png";

function Navbar(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [user, setUser] = useState();

    // 🌟 THÊM STATE KIỂM TRA ADMIN
    const [isAdmin, setIsAdmin] = useState(false);

    // Thêm state quản lý ô tìm kiếm
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        const checkUserRole = async (userId) => {
            if (!userId) {
                setIsAdmin(false);
                return;
            }
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                // Nếu có data và role là admin thì bật cờ isAdmin lên
                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Lỗi kiểm tra quyền: ", error);
                setIsAdmin(false);
            }
        };

        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user || null;
            setUser(currentUser);

            // Nếu có user, đem ID đi kiểm tra quyền
            if (currentUser) {
                checkUserRole(currentUser.id);
            }
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user || null;
            setUser(currentUser);

            // Khi trạng thái đăng nhập thay đổi, cũng phải kiểm tra lại quyền
            if (currentUser) {
                checkUserRole(currentUser.id);
            } else {
                setIsAdmin(false); // Đăng xuất thì tắt quyền admin
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAdmin(false); // Reset lại state
        navigate('/');
    }
    // 🌟 HÀM XỬ LÝ KHI NGƯỜI DÙNG BẤM TÌM KIẾM
    const handleSearch = (e) => {
        e.preventDefault(); // Chặn hành vi load lại trang của Form mặc định
        if (searchQuery.trim() !== "") {
            // Chuyển hướng sang url có chứa từ khóa (VD: /search?keyword=gà)
            navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(""); // Tùy chọn: Xóa trắng ô nhập sau khi tìm xong
            setOpenMenu(false); // Đóng menu nếu đang ở chế độ mobile
        }
    };
    return (
        <nav className="navbar">
            {/* 1.Logo cửa hàng*/}
            <div className="logo">
                <Link to="/"><img src={logoImg} alt="logo" className="logo-img" /></Link>
            </div>

            {/* 2.Menu điều hướng*/}
            <ul className={openMenu ? "nav-links active" : "nav-links"}>
                <li onClick={() => setOpenMenu(false)}><Link to="/" className="link-main-page">Trang chủ</Link></li>
                {isAdmin && (
                    <li onClick={() => setOpenMenu(false)}>
                        <Link to="/admin" className="link-main-page">Quản lý sản phẩm</Link>
                    </li>
                )}
                <li onClick={() => setOpenMenu(false)}>
                    <Link to="/products" className="link-main-page">Sản phẩm</Link>
                </li>
                <li onClick={() => setOpenMenu(false)}>
                    <Link to="/contact" className="link-main-page">Liên hệ</Link>
                </li>
            </ul>

            {/* 🌟 3. THANH TÌM KIẾM MỚI */}
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-btn">Tìm kiếm</button>
            </form>

            {/* 4. Giỏ hàng & Account */}
            <div className="cart-icon">
                <Link to="/cart" className="cart-icon-link">
                    <span className="link-main-page">Giỏ hàng: </span>
                    <span className="badge">{props.quantity}</span>
                </Link>

                {user ? (
                    <div className="account">
                        <span className="username">
                            <Link to='/profile' className="profile-user"><img src={userImg} alt="account" className="user-img" /></Link>
                        </span>
                        <button onClick={handleLogout} className="log-out">Đăng xuất</button>
                    </div>
                ) : (
                    <Link to="/login" className="log-in">Đăng nhập</Link >
                )}
            </div>

            {/* 5. nút 3 gạch cho mobile */}
            <div className="menu-icon" onClick={() => setOpenMenu(!openMenu)}>
                {openMenu ? "X" : "☰"}
            </div>
        </nav>
    );
}

export default Navbar;
