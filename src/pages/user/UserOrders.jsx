import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import './UserOrders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- CÁC STATE MỚI DÀNH CHO POPUP CHI TIẾT ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    navigate('/login');
                    return;
                }

                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [navigate]);

    const formatOrderCode = (id) => {
        return "DH" + String(id).padStart(3, '0');
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Chờ xác nhận': return 'status-badge pending';
            case 'Đang giao': return 'status-badge shipping';
            case 'Hoàn thành': return 'status-badge completed';
            case 'Đã hủy': return 'status-badge cancelled';
            default: return 'status-badge pending';
        }
    };

    // --- HÀM MỚI: MỞ POPUP VÀ TẢI CHI TIẾT ĐƠN HÀNG ---
    const handleViewDetails = async (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setLoadingDetails(true);
        setOrderDetails([]); // Xóa dữ liệu cũ trước khi tải mới

        try {
            // Chui vào bảng order_details kéo đúng những món của mã đơn này
            const { data, error } = await supabase
                .from('order_details')
                .select('*')
                .eq('order_id', order.id);

            if (error) throw error;
            setOrderDetails(data || []);
        } catch (error) {
            console.error("Lỗi tải chi tiết:", error.message);
            alert("Không thể tải chi tiết đơn hàng lúc này.");
        } finally {
            setLoadingDetails(false);
        }
    };

    // Hàm đóng Popup
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải lịch sử đơn hàng...</div>;

    return (
        <div className="user-orders-page">
            <div className="user-orders-container">
                <div className="orders-header">
                    <h2>📦 Lịch sử mua hàng</h2>
                    <p>Theo dõi trạng thái các đơn hàng bạn đã đặt</p>
                </div>

                <div className="orders-list">
                    {orders.length === 0 ? (
                        <div className="empty-orders">
                            <p>Bạn chưa có đơn hàng nào.</p>
                            <Link to="/" className="btn-buy-now">Tiếp tục mua sắm</Link>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="order-card">
                                {/* Phần Header của thẻ Đơn hàng */}
                                <div className="order-card-header">
                                    <span className="order-id">Mã đơn: {formatOrderCode(order.id)}</span>
                                    <span className={getStatusStyle(order.status)}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Phần Nội dung chính của thẻ Đơn hàng */}
                                <div className="order-card-body">
                                    <div className="order-info">
                                        <div className="info-row">
                                            <span className="info-label">Ngày đặt:</span>
                                            <span className="info-value">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Người nhận:</span>
                                            <span className="info-value">{order.customer_name} - {order.phone}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Giao đến:</span>
                                            <span className="info-value">{order.address}</span>
                                        </div>
                                    </div>

                                    {/* Phần Tổng tiền và Nút bấm (nằm bên phải) */}
                                    <div className="order-actions">
                                        <div className="order-total">
                                            <span className="total-label">Tổng tiền:</span>
                                            <span className="total-price">{Number(order.total_price).toLocaleString('vi-VN')} đ</span>
                                        </div>
                                        {/* Tạm thời để button alert, bạn thay bằng hàm onClick={() => handleViewDetails(order)} nếu đã làm Modal */}
                                        <button className="btn-view-details" onClick={() => handleViewDetails(order)}>
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- GIAO DIỆN POPUP (MODAL) CHI TIẾT ĐƠN HÀNG --- */}
            {isModalOpen && selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    {/* onClick={e => e.stopPropagation()} để bấm vào bên trong không bị đóng popup */}
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-header">
                            <h3>Chi tiết đơn hàng {formatOrderCode(selectedOrder.id)}</h3>
                            <button className="btn-close-modal" onClick={closeModal}>✕</button>
                        </div>

                        <div className="modal-body">
                            {loadingDetails ? (
                                <p style={{ textAlign: 'center', padding: '20px' }}>⏳ Đang tải món ăn...</p>
                            ) : (
                                <div className="details-list">
                                    {orderDetails.map(item => (
                                        <div key={item.id} className="detail-item">
                                            <img src={item.product_image || 'https://placehold.co/60x60'} alt={item.product_name} />
                                            <div className="detail-info">
                                                <h4>{item.product_name}</h4>
                                                <p>Giá: {Number(item.price).toLocaleString('vi-VN')} đ</p>
                                            </div>
                                            <div className="detail-quantity-subtotal">
                                                <p>x{item.quantity}</p>
                                                <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <div className="modal-total-row">
                                <span>Thành tiền:</span>
                                <span className="modal-final-price">{Number(selectedOrder.total_price).toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;