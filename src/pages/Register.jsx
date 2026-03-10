import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) throw error;
            alert("Đăng ký thành công! Chào mừng bạn...");
            navigate('/login');
        } catch (error) {
            alert("Đăng ký thất bại: " + error.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="h2-auth">ĐĂNG KÝ TÀI KHOẢN</h2>
                <form onSubmit={handleRegister}>
                    <input type="email"
                        placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required className="input-inf" />
                    <br />
                    <input type="password"
                        placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6" className="input-inf" />
                    <br />
                    <button type="submit"
                        disabled={loading} className="btn-auth" >
                        Sign up
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px', color: 'white' }}>
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="auth-link">
                        Đăng nhập tại đây
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;