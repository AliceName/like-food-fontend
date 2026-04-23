import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // gọi dữ liệu
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setProducts(data);
        } catch (error) {
            console.error("Lỗi tải sản phẩm: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Chạy hàm fetch khi mới mở trang
    useEffect(() => {
        fetchProducts();
    }, []);

    // xử lý hàm sửa chức năng
    const handleEdit = async (id) => {
        navigate(`/admin/editProduct/${id}`);
    }
    //  xử lý hàm xoá món ăn
    const handleDelete = async (id, tenMon) => {
        if (window.confirm(`Bạn có chắc muốn xoá món "${tenMon}" không? Hành động này không thể hoàn tác!`)) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                alert("Xoá thành công");
                setProducts(products.filter(item => item.id !== id));
            } catch (error) {
                alert("Lỗi không thể xoá: " + error.message);
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="manage-product">
                <h2 className="label-manage">Quản lý món ăn</h2>
                <Link to="/admin/addProduct" className="btn-add-product">Thêm món mới</Link>
            </div>

            <div className="admin-manage-product">
                <table className="admin-manage-table">
                    <thead className="product-table-thead">
                        <tr>
                            <th>ID</th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá bán</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5">Đang tải dữ liệu</td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td>Chưa có món nào được thêm</td>
                            </tr>
                        ) : (
                            products.map((item) => (
                                <tr key={item.id}>
                                    <td data-label="ID">{item.id}</td>
                                    <td data-label="HÌNH ẢNH">
                                        <img
                                            src={item.anh && item.anh.length > 0 ? item.anh[0] : 'https://placehold.co/100x100?text=No+Image'}
                                            alt={item.ten}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </td>
                                    <td data-label="TÊN SẢN PHẨM">{item.ten}</td>
                                    <td data-label="GIÁ BÁN">
                                        {/* Format giá tiền Việt Nam */}
                                        {Number(item.gia).toLocaleString('vi-VN')} đ
                                    </td>

                                    <td data-label="HÀNH ĐỘNG">
                                        <button className="btn-sua" onClick={() => handleEdit(item.id)}>Sửa</button>
                                        <button onClick={() => handleDelete(item.id, item.ten)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;