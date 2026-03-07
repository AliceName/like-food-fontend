import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'
const UserLayout = () => {
    const [totalCart, setTotalCart] = useState(0);
    const handleBuy = () => {
        setTotalCart(totalCart + 1);
    }
    return (
        <div className="app-container">
            {/* // header */}
            <Navbar quantity={totalCart} />

            {/* // phần nội dung chính */}
            <main>
                <Outlet context={{ handleBuy }} />
            </main>

            {/* // footer */}
            <footer>
                <div>
                    <span>Chính sách bảo mật </span> | <span>Điều khoản sử dụng</span>
                </div>
            </footer>
        </div>
    )
}
export default UserLayout;