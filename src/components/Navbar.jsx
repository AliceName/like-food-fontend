import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient'

import logoImg from "../assets/img/logo-lf.png";

function Navbar(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [user, setUser] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    }
    return (
        <nav className="navbar">
            {/* 1.Logo cửa hàng*/}
            <div className="logo">
                <Link to="/"><img src={logoImg} alt="logo" className="logo-img" /></Link>
            </div>
            {/* 2.Menu điều hướng*/}
            <ul className={openMenu ? "nav-links active" : "nav-links"}>
                <li><Link to="/">Trang chủ</Link></li>
                <li>Sản phẩm</li>
                <li>Liên hệ</li>
            </ul>
            {/* 3. Giỏ hàng (Nhận số lượng từ App truyền vào) */}
            <div className="cart-icon">
                <Link to="/cart">
                    <span>Giỏ hàng: </span>
                    <span className="badge">{props.quantity}</span>
                </Link>

                {user ? (
                    <div className="account">
                        <span className="username">
                            {user.email.split('@')[0]}
                        </span>
                        <button onClick={handleLogout} className="log-out"> Dang xuat</button>
                    </div>
                ) : (
                    <Link to="/login" className="log-in">Dang nhap</Link >
                )}
            </div>
            {/* 4. nút 3 gạch */}
            <div className="menu-icon" onClick={() => setOpenMenu(!openMenu)}>
                {openMenu ? "X" : "☰"}
            </div>
        </nav>
    );
}

export default Navbar;
