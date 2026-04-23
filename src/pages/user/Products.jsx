import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useOutletContext } from 'react-router-dom';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import './Products.css';

const Products = () => {
    const { handleBuy } = useOutletContext();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCatId, setSelectedCatId] = useState('all'); // 'all' nghĩa là hiện tất cả
    const [loading, setLoading] = useState(true);

    // 🌟 Lấy danh sách Danh mục khi vừa vào trang
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    // 🌟 Lấy danh sách Sản phẩm (Chạy lại mỗi khi selectedCatId thay đổi)
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let query = supabase.from('products').select('*');

                // Nếu không phải 'all', thì lọc theo category_id
                if (selectedCatId !== 'all') {
                    query = query.eq('category_id', selectedCatId);
                }

                const { data, error } = await query.order('id', { ascending: false });
                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCatId]);

    return (
        <div className="products-page">
            {/* --- THANH DANH MỤC (SIDEBAR HOẶC TOPBAR) --- */}
            <div className="category-bar">
                <h3 className="category-title">Danh mục sản phẩm</h3>
                <ul className="category-list">
                    <li
                        className={selectedCatId === 'all' ? 'active' : ''}
                        onClick={() => setSelectedCatId('all')}
                    >
                        Tất cả sản phẩm
                    </li>
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className={selectedCatId === cat.id ? 'active' : ''}
                            onClick={() => setSelectedCatId(cat.id)}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- LƯỚI HIỂN THỊ SẢN PHẨM --- */}
            <div className="products-content">
                <div className="products-header">
                    <h2>{selectedCatId === 'all' ? "Tất cả sản phẩm" : categories.find(c => c.id === selectedCatId)?.name}</h2>
                    <p>Tìm thấy {products.length} sản phẩm</p>
                </div>

                {loading ? (
                    <Loading text="Đang lọc món ngon..." />
                ) : products.length > 0 ? (
                    <div className="products-grid">
                        {products.map((item) => (
                            <Card
                                key={item.id}
                                id={item.id}
                                linkAnh={item.anh}
                                nameProduct={item.ten}
                                price={item.gia}
                                handleMua={() => handleBuy(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Hiện tại danh mục này chưa có sản phẩm nào. Ngà hãy quay lại sau nhé! 🍲</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;