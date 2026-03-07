import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
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
            alert("Đăng nhập thành công!");
            navigate('/');
        }
    };

    return (
        <div>
            <h2>ĐĂNG NHẬP</h2>
            <form onSubmit={hanleLogin}>
                <input type="email"
                    placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    required />
                <input type="password"
                    placeholder="Mật khẩu"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required />
            </form>
        </div>
    );
}

export default Login;