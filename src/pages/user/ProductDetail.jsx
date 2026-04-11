import { useEffect, useState } from "react";
import React from "react";
import { supabase } from "../../supabaseClient";
import { useParams, useOutletContext, useNavigate, Link } from "react-router-dom";
import './ProductDetail.css'
import Card from "../../components/Card";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleBuy } = useOutletContext();

    // Các state lưu data
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [relatedProduct, setRelatedProduct] = useState([]);

    // ---  STATE CHO POPUP MUA NHANH ---
    const [showQuickBuy, setShowQuickBuy] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    // Mở popup và reset số lượng về 1
    const handleOpenQuickBuy = () => {
        setQuantity(1);
        setShowQuickBuy(true);
    };

    // Hành động CHỐT ĐƠN
    const confirmBuy = async () => {
        // Kiểm tra xem khách đã đăng nhập chưa
        const isSuccess = await handleBuy(product);

        if (isSuccess) {
            // Đóng gói dữ liệu lấy từ State 'product'
            const itemToCheckout = {
                id: product.id,
                ten: product.ten,
                gia: product.gia,
                anh: product.anh,
                quantity: quantity // Lấy đúng số lượng vừa bấm trong Popup
            };
            navigate('/checkout', { state: { itemsToCheckout: [itemToCheckout] } });
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProduct(data);

                // lấy ảnh đầu tiên làm mainImg
                if (data.anh && data.anh.length > 0) {
                    setMainImage(data.anh[0]);
                }

                // gọi API lấy món cùng loại
                const { data: relatedData, error: relatedError } = await supabase
                    .from('products')
                    .select('*')
                    .neq('id', id)
                    .limit(5);

                if (!relatedError && relatedData) {
                    setRelatedProduct(relatedData);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm: ", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải thông tin món ăn...</h2>;
    if (!product) return null;

    return (
        <>
            <div className="product-detail-container">

                {/* CỘT TRÁI: HÌNH ẢNH */}
                <div className="product-image-section">
                    <img src={mainImage} alt={product.ten} className="main-image" />

                    <div className="thumbnail-list">
                        {product.anh && product.anh.map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt={`Thumbnail ${index}`}
                                onClick={() => setMainImage(imgUrl)}
                                className={`thumbnail ${mainImage === imgUrl ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG TIN VÀ NÚT MUA */}
                <div className="product-info-section">
                    <h1 className="product-title">{product.ten}</h1>
                    <p className="product-category">Phân loại: {product.phan_loai}</p>

                    <h2 className="product-price">{product.gia
                        ? `${Number(String(product.gia).replace(/\D/g, '')).toLocaleString('vi-VN')} đ`
                        : 'Đang cập nhật giá'}</h2>

                    <div className="product-description">
                        <p>{product.description ? product.description : "Đang cập nhật mô tả cho món ăn này..."}</p>
                    </div>

                    {/* KHU VỰC 2 NÚT BẤM */}
                    <div className="product-actions">
                        <Link to="/cart" className="link-add-cart">
                            <button className="btn-add-cart" onClick={() => handleBuy(product)}>
                                🛒 Thêm vào giỏ hàng
                            </button>
                        </Link>

                        {/*  NÚT KÍCH HOẠT POPUP MUA NGAY */}
                        <button onClick={handleOpenQuickBuy} className="btn-buy-now">
                            Mua ngay
                        </button>
                    </div>
                </div>

                {/* ---  GIAO DIỆN POPUP MUA NHANH (BẢN CARD) --- */}
                {showQuickBuy && (
                    <div className="quick-buy-overlay" onClick={() => setShowQuickBuy(false)}>
                        <div className="quick-buy-modal card-style" onClick={e => e.stopPropagation()}>

                            <button className="btn-close-quick-buy" onClick={() => setShowQuickBuy(false)}>✕</button>

                            {/* Ảnh lấy từ product.anh */}
                            <img className="quick-buy-cover" src={product.anh?.[0] || 'https://placehold.co/400x200'} alt={product.ten} />

                            <div className="quick-buy-content">
                                <h3 className="quick-buy-title">{product.ten}</h3>
                                <p className="quick-buy-price">{Number(product.gia).toLocaleString('vi-VN')} đ</p>

                                <div className="quick-buy-qty-section">
                                    <span className="qty-label">Chọn số lượng:</span>
                                    <div className="quick-buy-qty-controls">
                                        <button onClick={decreaseQty}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={increaseQty}>+</button>
                                    </div>
                                </div>

                                <button className="btn-confirm-buy" onClick={confirmBuy}>
                                    Xác nhận • {(product.gia * quantity).toLocaleString('vi-VN')} đ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Khu vực gợi ý món ăn */}
            {relatedProduct.length > 0 && (
                <div className="related-products-container">
                    <h2 className="related-title">Có thể bạn cũng thích</h2>
                    <div className="related-list">
                        {relatedProduct.map((item) => (
                            <Card
                                key={item.id}
                                id={item.id}
                                linkAnh={item.anh}
                                nameProduct={item.ten}
                                price={item.gia}
                                handleMua={() => handleBuy(item)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
export default ProductDetail;