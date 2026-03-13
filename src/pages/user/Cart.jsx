import React from "react";
import { useOutletContext, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import './Cart.css';

const Cart = () => {
    const { cartItems = [], setCartItems } = useOutletContext() || {};

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
            <div className="cart-content">
                <div className="cart-items-section">
                    {cartItems.map((item) => (
                        <div key={item.cart_id} className="cart-item">
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

                    <div className="sumary-total">
                        <span>Tổng cộng: </span>
                        <span className="total-price">{totalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>

                    <div className="checkout-actions">
                        <button className="btn-checkout" onClick={() => alert('Chức năng thanh toán')}>
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