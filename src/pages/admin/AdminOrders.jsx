import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './AdminOrders.css';
import Loading from '../../components/Loading';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Kéo TẤT CẢ đơn hàng từ Supabase
    const fetchAllOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Lỗi tải danh sách đơn hàng:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    // Hàm thay đổi trạng thái đơn hàng (Cập nhật Real-time trên giao diện)
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Cập nhật lại state cục bộ để UI đổi màu ngay lập tức mà không cần load lại trang
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

        } catch (error) {
            alert("Lỗi cập nhật trạng thái: " + error.message);
        }
    };

    // --- TÍNH TOÁN CÁC CON SỐ THỐNG KÊ ---
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Chờ xác nhận').length;
    const completedOrders = orders.filter(o => o.status === 'Hoàn thành').length;

    if (loading) return <Loading text="Đang tải dữ liệu ..." />;

    return (
        <div className="admin-orders-page">
            <div className="admin-header">
                <h2>Quản Lý Đơn Hàng</h2>
                <p>Khu vực dành riêng cho Chủ cửa hàng</p>
            </div>

            {/* --- 3 THẺ THỐNG KÊ --- */}
            <div className="admin-stats-container">
                <div className="stat-card">
                    <div className="stat-title">Tổng đơn hàng</div>
                    <div className="stat-value">{totalOrders}</div>
                </div>
                <div className="stat-card pending-card">
                    <div className="stat-title">Chờ xác nhận</div>
                    <div className="stat-value">{pendingOrders}</div>
                </div>
                <div className="stat-card completed-card">
                    <div className="stat-title">Đã hoàn thành</div>
                    <div className="stat-value">{completedOrders}</div>
                </div>
            </div>

            {/* --- BẢNG DANH SÁCH ĐƠN HÀNG --- */}
            <div className="admin-table-container">
                <table className="admin-orders-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Thời Gian</th>
                            <th>Khách Hàng</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td data-label="MÃ ĐƠN"><strong>DH{String(order.id).padStart(3, '0')}</strong></td>
                                <td data-label="THỜI GIAN">
                                    {new Date(order.created_at).toLocaleDateString('vi-VN')} <br />
                                    <span className="time-text">{new Date(order.created_at).toLocaleTimeString('vi-VN')}</span>
                                </td>
                                <td data-label="KHÁCH HÀNG">
                                    <strong>{order.customer_name}</strong> <br />
                                    <span className="phone-text">{order.phone}</span>
                                </td>
                                <td data-label="TỔNG TIỀN" className="price-text">
                                    {Number(order.total_price).toLocaleString('vi-VN')} đ
                                </td>
                                <td data-label="TRẠNG THÁI">
                                    {/* Huy hiệu màu sắc thay đổi theo Status */}
                                    <span className={`admin-badge ${order.status === 'Chờ xác nhận' ? 'pending' :
                                        order.status === 'Đang giao' ? 'shipping' :
                                            order.status === 'Hoàn thành' ? 'completed' : 'cancelled'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td data-label="HÀNH ĐỘNG">
                                    {/* Dropdown chuyển trạng thái */}
                                    <select
                                        className="status-dropdown"
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                    >
                                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                                        <option value="Đang giao">Đang giao</option>
                                        <option value="Hoàn thành">Hoàn thành</option>
                                        <option value="Đã hủy">Hủy đơn</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && <div className="no-orders">Chưa có đơn hàng nào trong hệ thống.</div>}
            </div>
        </div>
    );
};

export default AdminOrders;