import React, {useState} from "react";
import "./Navbar.css";

import logoImg from "../assets/img/logo-lf.png";

function Navbar(props) {
    const [openMenu, setOpenMenu] = useState(false);
    return (
        <nav className="navbar">
            {/* 1.Logo cửa hàng*/}
            <div className="logo"><img src={logoImg} alt="logo" className="logo-img"/></div>
            {/* 2.Menu điều hướng*/}
            <ul className={openMenu ? "nav-links active":"nav-links"}>
                <li>Trang chủ</li>
                <li>Sản phẩm</li>
                <li>Liên hệ</li>
            </ul>
            {/* 3. Giỏ hàng (Nhận số lượng từ App truyền vào) */}
            <div className="cart-icon">
                <span>Giỏ hàng: </span>
                <span className="badge">{props.quantity}</span>
            </div>
            {/* 4. nút 3 gạch */}
            <div className="menu-icon" onClick={() => setOpenMenu(!openMenu)}>
                {openMenu ? "X" : "☰"}
            </div>
        </nav>
    );
}

export default Navbar;
