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
                option: {
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
                <form onSubmit={hanleLogin}>
                    <input type="email"
                        placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required className="input-inf" />
                    <br />
                    <input type="password"
                        placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required className="input-inf" />
                    <br />
                    <div className="text-forgot-password">
                        <Link to="/forgot-password" className="auth-link">
                            Quên mật khẩu
                        </Link>
                    </div>
                    <button className="btn-auth">Đăng nhập</button>
                    <div>
                        <h4>Hoặc</h4>
                        <button onClick={handleGoogle} className="btn-auth-google">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                            Đăng nhập bằng Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;