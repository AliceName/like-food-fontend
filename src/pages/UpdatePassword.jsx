import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const UpdatePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Lệnh cập nhật mật khẩu mới thẳng lên Supabase
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            alert('🎉 Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/login'); // Đổi xong đá văng ra trang Login

        } catch (error) {
            alert("Lỗi: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="h2-auth">ĐẶT MẬT KHẨU MỚI</h2>

                <form onSubmit={handleUpdatePassword}>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input-inf"
                    />
                    <br />

                    <button type="submit" className="btn-auth" disabled={isLoading}>
                        {isLoading ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;