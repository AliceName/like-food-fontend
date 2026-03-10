import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const hanleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Yêu cầu sp gửi email
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'http://localhost:5173/reset-password',
            });

            if (error) throw error;
            setMessage('Vui lòng kiểm tra hộp thư email');
        } catch (error) {
            setMessage('Lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="h2-auth">KHÔI PHỤC MẬT KHẨU</h2>
                <form onSubmit={hanleResetPassword}>
                    <input type="email"
                        placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required className="input-inf" />
                    <br />
                    <button className="btn-auth" type="submit" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi link khôi phục'}
                    </button>
                </form>
                {/* Hiện thông báo sau khi bấm gửi */}
                {message && (
                    <p>
                        {message}
                    </p>
                )}

                {/* Quay lại trang đăng nhập */}
                <div>
                    <Link to="/login" className="auth-link">
                        Quay lại trang đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;