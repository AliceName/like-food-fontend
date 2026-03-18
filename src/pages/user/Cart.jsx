import React, { useState } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import './Cart.css';

const Cart = () => {
    const { cartItems = [], setCartItems } = useOutletContext() || {};
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="cart-empty-container" >
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p >Hãy dạo một vòng và chọn cho mình những món ăn ngon nhé!</p>
                <Link to="/" className="btn-continue-shopping" >
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }
    // Tính tổng tiền
    const totalAmount = cartItems.reduce((total, item) => total + (item.gia * item.quantity), 0);

    // hàm xử lý chọn món thanh toán
    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            // Nếu món này đã có trong danh sách chọn -> Bấm vào sẽ gỡ bỏ ra (Untick)
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            // Nếu chưa có -> Thêm ID của nó vào danh sách chọn (Tick)
            setSelectedItems([...selectedItems, id]);
        }
    };

    // 2. Hàm xử lý nút "Chọn Tất Cả"
    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            // Nếu đang tick hết rồi -> Bỏ tick tất cả
            setSelectedItems([]);
        } else {
            // Lấy tất cả ID của giỏ hàng nhét vào mảng chọn
            setSelectedItems(cartItems.map(item => item.id));
        }
    };
    // tính tổng tiền
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            // CHỈ CỘNG TIỀN NẾU ID CỦA MÓN ĐÓ NẰM TRONG MẢNG ĐƯỢC TICK CHỌN
            if (selectedItems.includes(item.id)) {
                return total + (item.gia * item.quantity); // <--- SỬA CHỮ NÀY NÈ
            }
            return total; // Còn không thì bỏ qua, không cộng
        }, 0);
    };


    // Xóa 1 món
    const handleRemoveItem = async (cartId) => {
        try {
            // Lệnh xóa dòng dữ liệu trong bảng carts
            const { error } = await supabase.from('carts').delete().eq('id', cartId);

            if (error) throw error;

            // Cập nhật lại giao diện ngay lập tức
            setCartItems(prevCart => prevCart.filter(item => item.cart_id !== cartId));
        } catch (error) {
            console.error("Lỗi xóa món ăn:", error);
            alert("Lỗi hệ thống, không thể xóa lúc này.");
        }
    };

    // tăng/ giảm số lượng
    const handleUpdateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const { error } = await supabase
                .from('carts')
                .update({ quantity: newQuantity })
                .eq('id', cartId);

            if (error) throw error;
            setCartItems(prevCart =>
                prevCart.map(item =>
                    item.cart_id === cartId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("Lỗi cập nhật số lượng: ", error);
        }
    }

    // giao diện
    return (
        <div className="cart-container">
            {/* Cột phải */}
            <h1 className="cart-title">Giỏ hàng của bạn</h1>
            <div className="select-all-wrapper">
                <input
                    type="checkbox"
                    className="cart-checkbox"
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                />
                <label>Chọn tất cả ({cartItems.length} sản phẩm)</label>
            </div>
            <div className="cart-content">
                <div className="cart-items-section">
                    {cartItems.map((item) => (
                        <div key={item.cart_id} className="cart-item">
                            <div className="item-checkbox">
                                <input
                                    type="checkbox"
                                    className="cart-checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                />
                            </div>
                            <img src={item.anh?.[0] || 'https://placehold.co/100x100?text=No+Image'} alt={item.ten} className="cart-item-img" />

                            <div className="cart-item-info">
                                <Link to={`/product/${item.id}`} className="cart-item-name">{item.ten}</Link>
                                <p className="cart-item-price">{Number(item.gia).toLocaleString('vi-VN')} đ</p>
                            </div>

                            {/* cụm nút tăng giảm số lượng */}
                            <div className="cart-item-quantity">
                                <button onClick={() => handleUpdateQuantity(item.cart_id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(item.cart_id, item.quantity + 1)}>+</button>
                            </div>

                            {/* Thành tiền của 1 món */}
                            <div className="cart-item-subtotal">
                                {Number(item.gia * item.quantity).toLocaleString('vi-VN')} đ
                            </div>

                            <button className="btn-remove-item" onClick={() => handleRemoveItem(item.cart_id)}>
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                {/* Cột trái */}
                <div className="cart-sumary-section">
                    <h3>Tổng đơn hàng </h3>

                    <div className="sumary-row">
                        <span>Tạm tính: </span>
                        <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>

                    <div className="sumary-row">
                        <span>Phí giao hàng: </span>
                        <span>Miễn Phí</span>
                    </div>

                    <div className="cart-summary-total">
                        <h3 className="summary-total-label">
                            Tổng thanh toán ({selectedItems.length} sản phẩm):
                        </h3>
                        <span className="summary-total-price">
                            {calculateTotal().toLocaleString('vi-VN')} đ
                        </span>
                    </div>

                    <div className="checkout-actions">
                        <button
                            className="btn-checkout"
                            onClick={() => {
                                // 1. Kiểm tra xem khách có chọn món nào chưa
                                if (selectedItems.length === 0) {
                                    alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
                                    return;
                                }

                                // 2. Lọc ra danh sách CHÍNH XÁC các món đã được tick
                                const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));

                                // 3. Đá sang trang Checkout và mang theo "hành lý" là các món vừa lọc
                                navigate('/checkout', { state: { itemsToCheckout } });
                            }}
                        >
                            Thanh toán
                        </button>
                        <Link to="/" className="btn-back-home">Tiếp tục mua sắm</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;