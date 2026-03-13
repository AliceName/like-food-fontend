import { useEffect, useState } from "react";
import React from "react";
import { supabase } from "../../supabaseClient";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
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
                    .limit(4); // chỉ lấy 4 món

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
                        <button className="btn-add-cart" onClick={() => handleBuy(product)}>
                            🛒 Thêm vào giỏ hàng
                        </button>

                        {/* Nút Mua ngay: Chờ handleBuy kiểm tra, nếu trả về true (đã đăng nhập) thì mới chuyển trang */}
                        <button className="btn-buy-now" onClick={async () => {
                            const isSuccess = await handleBuy(product); // Đợi kết quả kiểm tra
                            if (isSuccess) {
                                navigate('/cart'); // Chỉ nhảy sang giỏ hàng nếu kiểm tra thành công
                            }
                        }}>
                            Mua ngay
                        </button>
                    </div>
                </div>

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