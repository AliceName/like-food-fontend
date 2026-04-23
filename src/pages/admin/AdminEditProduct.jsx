import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // Chú ý import supabase
import Loading from '../../components/Loading'; // Đã import Loading xịn xò
import './AdminAddProduct.css';

const AdminEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 🌟 1. CÁC STATE QUẢN LÝ FORM ĐÃ ĐƯỢC ĐỒNG BỘ TÊN
    const [ten, setTen] = useState('');
    const [categoryId, setCategoryId] = useState(''); // Sửa phanLoai thành categoryId
    const [gia, setGia] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [categoryList, setCategoryList] = useState([]); // Đã sửa tên chuẩn
    const [loadingData, setLoadingData] = useState(true); // Đã thêm state Loading

    // 🌟 2. TỰ ĐỘNG LẤY DATA TỪ DB KHI VỪA MỞ TRANG
    useEffect(() => {
        const fetchCategoriesAndProduct = async () => {
            try {
                // Lấy danh sách phân loại
                const { data: catData } = await supabase.from('categories').select('*');
                if (catData) setCategoryList(catData);

                // Lấy thông tin của Món Ăn đang cần sửa
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (productError) throw productError;

                // Đắp dữ liệu cũ lên Form
                if (productData) {
                    setTen(productData.ten);
                    setCategoryId(productData.category_id);
                    setGia(productData.gia);
                    setDescription(productData.description || '');
                    setImages(productData.anh && productData.anh.length > 0 ? productData.anh : ['']);
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error.message);
                alert("Không tìm thấy món ăn này!");
                navigate('/admin');
            } finally {
                setLoadingData(false); // Tắt loading
            }
        };

        fetchCategoriesAndProduct();
    }, [id, navigate]);

    // --- LOGIC XỬ LÝ ẢNH TỪ MÁY TÍNH ---
    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            console.log("Đang tải ảnh lên Supabase...");

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            const newImages = [...images];
            newImages[index] = data.publicUrl;
            setImages(newImages);

        } catch (error) {
            console.error("Lỗi tải ảnh:", error);
            alert("Lỗi tải ảnh: " + error.message);
        }
    };

    const addImageField = () => setImages([...images, '']);

    const removeImageField = (index) => {
        if (images.length > 1) {
            setImages(images.filter((_, i) => i !== index));
        }
    };

    // 🌟 LOGIC CẬP NHẬT SẢN PHẨM LÊN SUPABASE
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ten || !gia || !categoryId) {
            alert("Vui lòng nhập đủ thông tin cơ bản!"); return;
        }
        setIsSubmitting(true);

        try {
            const validImages = images.filter(img => img.trim() !== '');

            const updatedProduct = {
                ten: ten,
                category_id: Number(categoryId),
                gia: Number(gia),
                description: description,
                anh: validImages
            };

            const { error } = await supabase
                .from('products')
                .update(updatedProduct)
                .eq('id', id);

            if (error) throw error;

            alert("Cập nhật sản phẩm thành công!");
            navigate('/admin');

        } catch (error) {
            console.error("Lỗi sửa sản phẩm:", error);
            alert("Sửa thất bại. Lỗi: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🌟 HIỂN THỊ VÒNG XOAY LOADING ĐẸP MẮT
    if (loadingData) return <Loading text="Đang tải dữ liệu món ăn..." />;

    return (
        <div className="admin-add-product-page">
            <div className="form-container">
                <h2 className="form-title">Chỉnh sửa Món Ăn</h2>
                <p className="form-subtitle">Cập nhật thông tin chi tiết cho ID: {id}</p>

                <form onSubmit={handleSubmit} className="add-product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tên món ăn <span className="required">*</span></label>
                            <input type="text" value={ten} onChange={(e) => setTen(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Phân loại <span className="required">*</span></label>
                            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                {categoryList.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Giá bán (VNĐ) <span className="required">*</span></label>
                            <input type="number" value={gia} onChange={(e) => setGia(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
                        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    {/* 🌟 GIAO DIỆN CHỌN ẢNH ĐÃ ĐƯỢC ĐỒNG BỘ VỚI LOGIC */}
                    <div className="form-group">
                        <label>Hình ảnh (Tải lên từ máy)</label>
                        <div className="image-inputs-container">
                            {images.map((imgUrl, index) => (
                                <div key={index} className="image-input-row" style={{ flexDirection: 'column' }}>

                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(index, e)}
                                        />

                                        {images.length > 1 && (
                                            <button type="button" className="btn-remove-img" onClick={() => removeImageField(index)}>✕</button>
                                        )}
                                    </div>

                                    {/* Hiển thị ảnh xem trước (Ảnh cũ hoặc ảnh mới tải lên) */}
                                    {imgUrl && (
                                        <img
                                            src={imgUrl}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                                        />
                                    )}
                                </div>
                            ))}
                            <button type="button" className="btn-add-img" onClick={addImageField}>
                                + Thêm ảnh phụ
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit-product" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminEditProduct;