import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Card.css";

function Card(props) {
    const images = Array.isArray(props.linkAnh) ? props.linkAnh : [props.linkAnh];
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // State cho Slider ảnh
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // --- 🌟 STATE CHO POPUP MUA NHANH ---
    const [showQuickBuy, setShowQuickBuy] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    // Mở popup và reset số lượng về 1
    const handleOpenQuickBuy = () => {
        setQuantity(1);
        setShowQuickBuy(true);
    };

    // Hành động CHỐT ĐƠN: Mang số lượng đã chọn sang Checkout
    const confirmBuy = () => {
        const itemToCheckout = {
            id: props.id,
            ten: props.nameProduct,
            gia: props.price,
            anh: images,
            quantity: quantity // Lấy đúng số lượng vừa bấm
        };
        navigate('/checkout', { state: { itemsToCheckout: [itemToCheckout] } });
    };

    return (
        <>
            <div className="card">
                <div className="image-slider">
                    {images.length > 1 && (
                        <>
                            <button className="btn-arrow btn-prev" onClick={prevSlide}>❮</button>
                            <button className="btn-arrow btn-next" onClick={nextSlide}>❯</button>
                        </>
                    )}
                    <img src={images[currentIndex] || 'https://via.placeholder.com/300'} alt={props.nameProduct} className="card-img" />
                    {images.length > 1 && (
                        <span className="slider-counter">
                            {currentIndex + 1}/{images.length}
                        </span>
                    )}
                </div>

                <div className="card-info">
                    <Link to={`/product/${props.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2>{props.nameProduct}</h2>
                    </Link>
                    <p className="card-price">{Number(props.price).toLocaleString('vi-VN')} đ</p>

                    {/* Bấm nút này sẽ mở Popup thay vì chuyển trang */}
                    <button onClick={handleOpenQuickBuy} className="btn-buy">
                        Mua ngay
                    </button>
                </div>
            </div>

            {/* --- 🌟 GIAO DIỆN POPUP MUA NHANH --- */}
            {showQuickBuy && (
                <div className="quick-buy-overlay" onClick={() => setShowQuickBuy(false)}>
                    {/* Ngăn không cho sự kiện click lan ra ngoài làm tắt popup */}
                    <div className="quick-buy-modal" onClick={e => e.stopPropagation()}>

                        <button className="btn-close-quick-buy" onClick={() => setShowQuickBuy(false)}>✕</button>
                        <h3>Tùy chỉnh đơn hàng</h3>

                        <div className="quick-buy-product">
                            <img src={images[0] || 'https://placehold.co/80'} alt={props.nameProduct} />
                            <div className="quick-buy-details">
                                <h4>{props.nameProduct}</h4>
                                <p className="quick-buy-price">{Number(props.price).toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>

                        <div className="quick-buy-qty-section">
                            <span>Số lượng:</span>
                            <div className="quick-buy-qty-controls">
                                <button onClick={decreaseQty}>-</button>
                                <span>{quantity}</span>
                                <button onClick={increaseQty}>+</button>
                            </div>
                        </div>

                        {/* Nút xác nhận tự động nhân tiền cho khách dễ nhìn */}
                        <button className="btn-confirm-buy" onClick={confirmBuy}>
                            Xác nhận mua ({(props.price * quantity).toLocaleString('vi-VN')} đ)
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}

export default Card;