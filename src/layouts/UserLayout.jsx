import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { supabase } from '../supabaseClient';
const UserLayout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Kiểm tra đăng nhập và lấy giỏ hàng
    useEffect(() => {
        const fetchUserAndCart = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setCurrentUser(session.user);
                loadCartFromDB(session.user.id);
            }
        };
        fetchUserAndCart();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                // KHI ĐĂNG XUẤT: Tẩy trắng giỏ hàng và xóa thông tin User hiện tại
                setCartItems([]);
                setCurrentUser(null);
            } else if (event === 'SIGNED_IN') {
                // KHI ĐĂNG NHẬP (nếu lỡ chưa load kịp ở bước 1): Gắn user vào và lấy giỏ hàng
                setCurrentUser(session.user);
                loadCartFromDB(session.user.id);
            }
        });

        // Hủy lắng nghe khi Component bị gỡ bỏ để tránh tràn bộ nhớ
        return () => subscription.unsubscribe();
    }, []);

    // Hàm lấy giỏ hàng
    const loadCartFromDB = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('carts')
                .select(`
                    id ,
                    quantity,
                    products(*)
                    `).eq('user_id', userId);

            if (error) throw error;

            if (data) {
                const formattedCart = data
                    .filter(item => item.products !== null)
                    .map(item => ({
                        cart_id: item.id,
                        id: item.products.id,
                        ten: item.products.ten,
                        gia: item.products.gia,
                        anh: item.products.anh,
                        quantity: item.quantity
                    }));
                setCartItems(formattedCart);
            }
        } catch (error) {
            console.error("Lỗi tải giỏ hàng: ", error.message);
        }
    };

    const handleBuy = async (product) => {
        try {
            if (!currentUser) {
                alert("Bạn cần đăng nhập để mua hàng!");
                navigate('/login');
                return false;
            }

            // kiểm tra user đã thêm món này chưa
            const existingItem = cartItems.find(item => item.id === product.id);
            if (existingItem) {
                const newQuantity = existingItem.quantity + 1;

                const { error } = await supabase
                    .from('carts')
                    .update({ quantity: newQuantity })
                    .eq('id', existingItem.cart_id);

                if (error) throw error;

                setCartItems(prev => prev.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                ));
            } else {
                const { data: insertData, error } = await supabase
                    .from('carts')
                    .insert([
                        { user_id: currentUser.id, product_id: product.id, quantity: 1 }
                    ])
                    .select()
                    .single();

                if (error) throw error;
                setCartItems(prev => [...prev, {
                    cart_id: insertData.id,
                    id: product.id,
                    ten: product.ten,
                    gia: product.gia,
                    anh: product.anh,
                    quantity: 1
                }]);
            }

            return true;
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ DB:", error);
            return false;
        }
    };

    const totalCart = cartItems.reduce((total, item) => total + item.quantity, 0);
    return (
        <div className="app-container">
            {/* // header */}
            <Navbar quantity={totalCart} />

            {/* // phần nội dung chính */}
            <main>
                <Outlet context={{ handleBuy, cartItems, setCartItems }} />
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