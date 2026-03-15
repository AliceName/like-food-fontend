import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const hanleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) throw error;
            setEmail('');
            setPassword('');
            if (data.user) {
                checkUserRole(data.user.id);
            }
        } catch (error) {
            alert("Đăng nhập thất bại" + error.message);
        }
    };

    const checkUserRole = async (userId) => {
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();
        if (data && data.role === 'admin') {
            alert("Administrator hello!");
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const handleGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirect: 'http://localhost:5173/'
                }
            });

            if (error) throw error;
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    }
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="h2-auth">ĐĂNG NHẬP</h2>
                <form onSubmit={hanleLogin} autoComplete="off">
                    <input type="email"
                        placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required className="input-inf"
                        autoComplete="off" />
                    <br />
                    <input type="password"
                        placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required className="input-inf"
                        autoComplete="off" />
                    <br />
                    <div className="text-forgot-password">
                        <Link to="/forgot-password" className="auth-link">
                            Quên mật khẩu
                        </Link>
                    </div>
                    <button className="btn-auth">Đăng nhập</button>
                    <div>
                        <h4>Hoặc</h4>
                        <button type="button" onClick={handleGoogle} className="btn-auth-google">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                            Đăng nhập bằng Google
                        </button>
                    </div>

                    <div >
                        <span>Bạn chưa có tài khoản? </span>
                        <Link to="/register" className="auth-link" >
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;