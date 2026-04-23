import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../../components/Loading";
import "./AdminUsers.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🌟 KÉO DỮ LIỆU TỪ BẢNG PROFILES
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false }); // Sắp xếp tài khoản mới nhất lên đầu

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error("Lỗi tải danh sách người dùng: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🌟 HÀM CẤP QUYỀN HOẶC HẠ QUYỀN ADMIN
    const handleUpdateRole = async (userId, newRole) => {
        if (window.confirm(`Bạn có chắc muốn đổi quyền của người dùng này thành "${newRole}"?`)) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .update({ role: newRole })
                    .eq('id', userId);

                if (error) throw error;

                // Cập nhật lại giao diện ngay lập tức
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                ));
                alert("Cập nhật quyền thành công!");
            } catch (error) {
                alert("Lỗi khi cập nhật: " + error.message);
            }
        }
    };

    if (loading) return <Loading text="Đang tải danh sách người dùng..." />;

    return (
        <div className="users-container">
            <div className="manage-users-header">
                <div>
                    <h2 className="label-manage">Quản lý Người Dùng</h2>
                    <p className="subtitle-manage">Hệ thống đang có {users.length} tài khoản</p>
                </div>
            </div>

            <div className="admin-manage-users">
                <table className="admin-users-table">
                    <thead className="users-table-thead">
                        <tr>
                            <th>ID Tài khoản (UUID)</th>
                            <th>Email</th>
                            <th>Ngày tham gia</th>
                            <th>Vai trò (Role)</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                                    Chưa có người dùng nào.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td data-label="ID TÀI KHOẢN">
                                        {/* Cắt bớt UUID cho đỡ dài */}
                                        <span className="user-uuid">{user.id.substring(0, 8)}...</span>
                                    </td>

                                    <td data-label="EMAIL">
                                        <strong>{user.email || 'Chưa cập nhật email'}</strong>
                                    </td>

                                    <td data-label="NGÀY THAM GIA">
                                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                    </td>

                                    <td data-label="VAI TRÒ">
                                        <span className={`role-badge ${user.role === 'admin' ? 'admin-badge' : 'user-badge'}`}>
                                            {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                                        </span>
                                    </td>

                                    <td data-label="HÀNH ĐỘNG">
                                        <select
                                            className="role-dropdown"
                                            value={user.role || 'user'}
                                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                        >
                                            <option value="user">Khách hàng</option>
                                            <option value="admin">Quản trị viên</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;