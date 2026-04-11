import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";
const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const itemsToCheckout = location.state?.itemsToCheckout || [];
    const [user, setUser] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tính tổng tiền đơn hàng
    const totalAmount = itemsToCheckout.reduce((total, item) => total + (item.gia * item.quantity), 0);

    //2. Kéo thông tin User và Địa chỉ mặc định từ Supabase
    useEffect(() => {
        if (itemsToCheckout.length === 0) {
            navigate('/cart');
            return;
        }

        const fetchCheckoutData = async () => {
            try {
                // ktra đăng nhập
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    alert("Vui lòng đăng nhập để thanh toán !");
                    navigate('/login');
                    return;
                }
                setUser(session.user);

                // get mặc định Address
                const { data: addressData, error } = await supabase
                    .from('user_addresses')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .eq('is_default', true)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                if (addressData) {
                    setDefaultAddress(addressData);
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin thanh toán: ", error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCheckoutData();
    }, [navigate, itemsToCheckout]);

    // Hàm xử lý đặt hàng chính thức
    const handlePlaceOrder = async () => {
        if (!defaultAddress) {
            alert("Vui lòng thêm địa chỉ giao hàng trước khi đặt món!");
            navigate('/profile');
            return;
        }

        setIsSubmitting(true);

        try {
            // --- HÀNH ĐỘNG 1: TẠO VỎ ĐƠN HÀNG VÀO BẢNG 'orders' ---
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: user.id,
                    customer_name: defaultAddress.recipient_name,
                    phone: defaultAddress.phone_number,
                    address: defaultAddress.detailed_address,
                    total_price: totalAmount,
                    status: 'Chờ xác nhận'
                }]).select()
                .single();

            if (orderError) throw orderError;

            const newOrderId = orderData.id;
            // --- HÀNH ĐỘNG 2: TẠO CHI TIẾT ĐƠN HÀNG VÀO BẢNG 'order_details' ---
            const orderDetailsArray = itemsToCheckout.map(item => ({
                order_id: newOrderId,
                user_id: user.id,
                product_id: item.id,
                product_name: item.ten,
                product_image: item.anh?.[0] || '',
                price: item.gia,
                quantity: item.quantity
            }));

            const { error: detailsError } = await supabase
                .from('order_details')
                .insert(orderDetailsArray);

            if (detailsError) throw detailsError;

            // --- HÀNH ĐỘNG 3: DỌN SẠCH CÁC MÓN ĐÃ MUA KHỎI GIỎ HÀNG (BẢNG 'carts') ---
            // 1. Lọc ra danh sách ID hợp lệ (chỉ lấy những món có cart_id)
            const validCartIds = itemsToCheckout
                .map(item => item?.cart_id)
                .filter(id => id !== undefined && id !== null);

            // 2. CHỈ GỌI LỆNH XÓA KHI CÓ ID HỢP LỆ (Tức là mua từ Giỏ hàng)
            if (validCartIds.length > 0) {
                const { error: clearCartError } = await supabase
                    .from('carts')
                    .delete()
                    .in('id', validCartIds);

                if (clearCartError) console.error("Không thể dọn giỏ hàng:", clearCartError);
            }
            // --- HOÀN THÀNH ---
            alert("Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
            window.location.href = '/userOrder';

        } catch (error) {
            alert("Lỗi đặt hàng: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    // Giao diện
    if (loading) return <div>Đang load</div>
    return (
        <div className="checkout-page">
            <div className="checkout-container">
                {/*  Cột trái thông tin giao hàng */}
                <div className="checkout-left">
                    <h2 className="checkout-system-title">Địa chỉ nhận hàng</h2>
                    {defaultAddress ? (
                        <div className="checkout-address-card">
                            <div className="checkout-address-header">
                                <strong>{defaultAddress.recipient_name}</strong>
                                <span className="divider"> | </span>
                                <span>{defaultAddress.phone_number}</span>
                            </div>
                            <p className="checkout-address-detail">{defaultAddress.detailed_address}</p>
                            <Link to="/profile" className="btn-change-address">Thay đổi địa chỉ</Link>
                        </div>
                    ) : (
                        <div className="checkout-no-address">
                            <p>Bạn chưa thiết lập địa chỉ giao hàng nào.</p>
                            <Link to="/profile" className="btn-setup-address">Thiết lập ngay</Link>
                        </div>
                    )}
                    <h2 className="checkout-section-title" style={{ marginTop: '30px' }}>Phương thức thanh toán</h2>
                    <div className="payment-methods">
                        <label className="payment-option selected">
                            <input type="radio" name="payment" defaultChecked />
                            <span>Thanh toán khi nhận hàng (COD)</span>
                        </label>
                    </div>
                </div>
                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                <div className="checkout-right">
                    <h2 className="checkout-section-title">Tóm tắt đơn hàng</h2>

                    <div className="checkout-items-list">
                        {itemsToCheckout.map(item => (
                            <div key={item.id} className="checkout-item">
                                <img src={item.anh?.[0] || 'https://placehold.co/50x50'} alt={item.ten} />
                                <div className="checkout-item-info">
                                    <h4>{item.ten}</h4>
                                    <p>Số lượng: x{item.quantity}</p>
                                </div>
                                <div className="checkout-item-price">
                                    {(item.gia * item.quantity).toLocaleString('vi-VN')} đ
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-summary">
                        <div className="summary-line">
                            <span>Tạm tính ({itemsToCheckout.length} món):</span>
                            <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="summary-line">
                            <span>Phí giao hàng:</span>
                            <span>Miễn phí</span>
                        </div>
                        <div className="summary-line total-line">
                            <span>Tổng cộng:</span>
                            <span className="final-price">{totalAmount.toLocaleString('vi-VN')} đ</span>
                        </div>

                        <button
                            className="btn-place-order"
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting || !defaultAddress}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG NGAY'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Checkout;