import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Card from '../../components/Card'; // Tái sử dụng lại component Card của bạn
import Loading from '../../components/Loading';
import './Search.css'; // File CSS ở bước 2

const Search = () => {
    // 1. Lấy từ khóa (keyword) từ thanh URL (VD: ?keyword=gà)
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    // Lấy hàm thêm vào giỏ hàng từ UserLayout (Giống trang ProductDetail)
    const { handleBuy } = useOutletContext();

    // 2. State lưu kết quả
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. Hàm gọi lên Supabase để tìm kiếm
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!keyword.trim()) {
                setResults([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('ten', `%${keyword}%`)
                    .limit(20); // 🔥 giới hạn kết quả

                if (error) throw error;
                setResults(data || []);

            } catch (error) {
                console.error("Lỗi:", error.message);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchSearchResults, 500);

        return () => clearTimeout(debounce);
    }, [keyword]);

    return (
        <div className="search-page-container">
            <h2 className="search-title">
                Kết quả tìm kiếm cho: <span className="keyword-highlight">"{keyword}"</span>
            </h2>

            {/* Hiển thị vòng xoay khi đang chờ tải dữ liệu */}
            {loading ? (
                <Loading text="Đang tìm kiếm món ngon cho bạn..." />
            ) : results.length > 0 ? (
                /* NẾU TÌM THẤY: Hiển thị lưới sản phẩm dùng Component Card */
                <div className="search-results-grid">
                    {results.map((item) => (
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
                /* NẾU KHÔNG TÌM THẤY MÓN NÀO */
                <div className="no-results">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/7486/7486831.png"
                        alt="Không tìm thấy"
                        className="no-results-img"
                    />
                    <h3>Ôi không! Quán chưa có món này 😢</h3>
                    <p>Thử tìm một từ khóa khác xem sao nhé (VD: Gà, Trà sữa, Khô...)</p>
                </div>
            )}
        </div>
    );
};

export default Search;