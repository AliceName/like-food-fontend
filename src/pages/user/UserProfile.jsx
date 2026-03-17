//import
import React, { useState } from "react";
import { supabase } from "../../supabaseClient"
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Quản lý Sổ địa chỉ
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        recipient_name: '',
        phone_number: '',
        detailed_address: ''
    });

    const navigate = useNavigate();

    // 1. Lấy thông tin User và Danh sách địa chỉ
    const fetchUserData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                navigate('/login');
                return;
            }
            setUser(session.user);
            // Kéo danh sách địa chỉ từ bảng user_addresses
            const { data: addressData, error } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('user_id', session.user.id)
                .order(`is_default`, { ascending: false }); // đưa đỉa chỉ mặt định

            if (error) throw error;
            setAddresses(addressData || []);
        } catch (error) {
            console.error("Lỗi: ", error.message);
        } finally {
            setLoading(false);
        }
    };
    // 2. Hàm thêm địa chỉ mới
    // Nếu đây là địa chỉ đầu tiên, tự động cho nó làm mặc định
    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            // Nếu đây là địa chỉ đầu tiên, tự động cho nó làm mặc định
            const isFirstAddress = addresses.length === 0;

            const { error } = await supabase
                .from('user_addresses')
                .insert([{
                    user_id: user.id,
                    recipient_name: newAddress.recipient_name,
                    phone_number: newAddress.phone_number,
                    detailed_address: newAddress.detailed_address,
                    is_default: isFirstAddress
                }]);
            if (error) throw error;
            alert("Đã thêm địa chỉ mới!");
            setShowAddressForm(false);
            setNewAddress({ recipient_name: '', phone_number: '', detailed_address: '' });
            fetchUserData();
        } catch (error) {
            alert("Lỗi khi thêm địa chỉ: " + error.message);
        }
    }
    // 3. Hàm thiết lập địa chỉ mặc định
    const handleSetDefault = async (addressId) => {
        try {
            // Bước A: Gỡ mặc định của tất cả địa chỉ cũ
            await supabase
                .from('user_addresses')
                .update({ is_default: true })
                .eq('user_id', user.id);
            // Bước B: Cài mặc định cho địa chỉ được chọn
            const { error } = await supabase
                .from('user_addresses')
                .update({ is_default: false })
                .eq('id', addressId);

            if (error) throw error;
            // Tải lại danh sách để đổi thứ tự
            fetchUserData();
        } catch (error) {
            alert("Lỗi cài mặc định: " + error.message);
        }
    }


    // 4. Hàm xóa địa chỉ
    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            try {
                const { error } = await supabase
                    .from('user_addresses')
                    .delete()
                    .eq('id', addressId);

                if (error) throw error;
                fetchUserData();
            } catch (error) {
                alert("Lỗi khi xoá: " + error.message);
            }
        }
    }

    if (loading) return <div>Đang tải dữ liệu...</div>;
    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="avatar-placeholder">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <h2>Tài khoản của tôi</h2>
                    <p>{user?.email}</p>
                </div>
                {/* Khu vực quản lý sổ địa chỉ */}
                <div className="address-book-section">
                    <div className="address-header">
                        <h3>Sổ địa chỉ giao hàng</h3>
                        <button className="btn-add-address"
                            onClick={() => setShowAddressForm(!showAddressForm)}>
                            {showAddressForm ? '✖ Đóng' : '+ Thêm địa chỉ mới'}
                        </button>
                    </div>

                    {/* form sẽ ẩn khi */}
                    {showAddressForm && (
                        <form onSubmit={handleAddAddress} className="address-form">
                            <h4>Thêm địa chỉ mới</h4>
                            <div className="form-row">
                                <input type="text"
                                    placeholder="Tên người nhận"
                                    value={newAddress.recipient_name}
                                    onChange={e => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                                    required />
                                <input type="text"
                                    placeholder="Số điện thoại"
                                    value={newAddress.phone_number}
                                    onChange={e => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                                    required />
                            </div>
                            <textarea
                                placeholder="Địa chỉ cụ thể( số nhà, tên đường,.."
                                value={newAddress.detailed_address}
                                onChange={e => setNewAddress({ ...newAddress, detailed_address: e.target.value })}
                                required
                            />
                        </form>
                    )}

                    {/* Danh sách địa chỉ đã lưu */}
                    <div className="address-list">
                        {addresses.length === 0 && !showAddressForm ? (
                            <p className="emty-address">Bạn chưa có địa chỉ nào</p>
                        ) : (
                            addresses.map(addr => (
                                <div key={addr.id} className={`address-card ${addr.is_default ? 'is-default' : ''}`}>
                                    <div className="address-infor">
                                        <div className="address-name-phone">
                                            <strong>{addr.recipient_name}</strong>
                                            <span className="divider">|</span>
                                            <span>{addr.phone_number}</span>
                                            {addr.is_default && <span className="badge-default">Mặc định</span>}
                                        </div>
                                        <div className="address-detail">{addr.detailed_address}</div>
                                    </div>
                                    <div className="address-actions">
                                        {!addr.is_default && (
                                            <button
                                                className="btn-set-default"
                                                onClick={() => handleSetDefault(addr.id)}
                                            >
                                                Thiết lập mặc định
                                            </button>
                                        )}
                                        <button
                                            className="btn-delete-address"
                                            onClick={() => handleDeleteAddress(addr.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;



