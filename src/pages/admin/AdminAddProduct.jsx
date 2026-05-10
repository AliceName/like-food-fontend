import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './AdminAddProduct.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const AdminAddProduct = () => {
    const navigate = useNavigate();
    // Các state quản lý form
    const [ten, setTen] = useState('');
    const [phanLoai, setPhanLoai] = useState('Trà sữa');
    const [gia, setGia] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState(['']); // Khởi tạo mảng chứa 1 ô nhập link ảnh trống
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. STATE DÀNH RIÊNG CHO CATEGORIES
    const [categories, setCategories] = useState([]); // Mảng chứa danh sách DB tải về
    const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Lưu ID danh mục được chọn

    // 3. TỰ ĐỘNG LẤY DATA TỪ DB KHI VỪA MỞ TRANG
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*'); // Lấy tất cả danh mục

                if (error) throw error;

                if (data && data.length > 0) {
                    setCategories(data);
                    setSelectedCategoryId(data[0].id); // Gán mặc định chọn dòng đầu tiên
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error.message);
            }
        };

        fetchCategories();
    }, []);

    // --- LOGIC XỬ LÝ ẢNH TỪ MÁY TÍNH ---
    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // 1. Tạo tên file ngẫu nhiên để không bị trùng (VD: 171300000_hinhanh.jpg)
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            // 2. Báo hiệu đang tải (tùy chọn, bạn có thể thêm state loading nếu muốn)
            console.log("Đang tải ảnh lên Supabase...");

            // 3. Đẩy file cứng lên Bucket 'product-images' của Supabase
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 4. Lấy cái Link URL công khai của bức ảnh vừa tải lên
            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            // 5. Nhét cái Link URL đó vào mảng images của Form (Giống hệt cách cũ)
            const newImages = [...images];
            newImages[index] = data.publicUrl;
            setImages(newImages);

        } catch (error) {
            console.error("Lỗi tải ảnh:", error);
            // Đã chuyển sang Swal báo lỗi
            Swal.fire({
                icon: 'error',
                title: 'Lỗi tải ảnh',
                text: error.message,
                confirmButtonColor: '#e74c3c'
            });
        }
    };

    const addImageField = () => setImages([...images, '']);

    const removeImageField = (index) => {
        if (images.length > 1) {
            setImages(images.filter((_, i) => i !== index));
        }
    };


    // --- LOGIC LƯU SẢN PHẨM LÊN SUPABASE ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn hành vi load lại trang của Form
        const rawPrice = Number(gia.replace(/\./g, ''));
        // Đã chuyển sang Swal báo lỗi thiếu thông tin (Warning)
        if (!ten || !gia || images[0].trim() === '' || !selectedCategoryId) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin!',
                text: 'Vui lòng nhập đầy đủ Tên, Giá, Phân loại và tải lên ít nhất 1 hình ảnh.',
                confirmButtonColor: '#f39c12'
            });
            return;
        }

        // Validate cơ bản
        if (!ten || !gia || images[0].trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin!',
                text: 'Vui lòng nhập đầy đủ Tên, Giá và tải lên ít nhất 1 hình ảnh.',
                confirmButtonColor: '#f39c12'
            });
            return;
        }

        // Validate for negative price
        if (rawPrice < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Giá không hợp lệ!',
                text: 'Giá bán không được là số âm. Vui lòng nhập lại!',
                confirmButtonColor: '#f39c12'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Lọc bỏ các ô link ảnh bị bỏ trống
            const validImages = images.filter(img => img.trim() !== '');

            const newProduct = {
                ten: ten,
                category_id: Number(selectedCategoryId),
                gia: rawPrice, // Đảm bảo lưu vào DB dưới dạng số
                description: description,
                anh: validImages // Lưu nguyên mảng ảnh vào cột 'anh'
            };

            const { error } = await supabase.from('products').insert([newProduct]);

            if (error) throw error; // Nếu RLS chặn (không phải admin), nó sẽ quăng lỗi ở đây

            Swal.fire({
                title: 'Thành công!',
                text: 'Đã thêm sản phẩm thành công lên Thực đơn!',
                icon: 'success',
                confirmButtonText: 'Tuyệt vời',
                confirmButtonColor: '#0ca960', // Đổi màu nút bấm thành màu xanh lá của quán bạn
            }).then((result) => {
                // Đoạn code trong này sẽ chạy SAU KHI người dùng bấm nút "Tuyệt vời"
                if (result.isConfirmed) {
                    navigate('/admin'); // Chuyển về trang quản lý
                }
            });
        } catch (error) {
            console.error("Lỗi thêm sản phẩm:", error);
            // 🌟 Đã chuyển sang Swal báo lỗi hệ thống
            Swal.fire({
                icon: 'error',
                title: 'Thêm thất bại!',
                text: error.message,
                confirmButtonColor: '#e74c3c'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // HÀM TỰ ĐỘNG FORMAT GIÁ TIỀN (THÊM DẤU CHẤM)
    const handlePriceChange = (e) => {
        // 1. Lấy giá trị người dùng nhập, xóa bỏ mọi ký tự KHÔNG phải là số
        let rawValue = e.target.value.replace(/\D/g, '');

        // 2. Nếu có số, thì định dạng lại với dấu chấm chuẩn Việt Nam
        if (rawValue !== '') {
            rawValue = Number(rawValue).toLocaleString('vi-VN');
        }

        // 3. Lưu vào state
        setGia(rawValue);
    };

    return (
        <div className="admin-add-product-page">
            <div className="form-container">
                <h2 className="form-title">Thêm Món Mới</h2>
                <p className="form-subtitle">Điền thông tin bên dưới để đưa món mới lên thực đơn</p>

                <form onSubmit={handleSubmit} className="add-product-form">

                    {/* Hàng 1: Tên & Phân loại */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tên món ăn <span className="required">*</span></label>
                            <input
                                type="text"
                                placeholder="VD: Gà rán giòn rụm"
                                value={ten}
                                onChange={(e) => setTen(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phân loại <span className="required">*</span></label>
                            <select value={phanLoai} onChange={(e) => setPhanLoai(e.target.value)}>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Hàng 2: Giá & Mô tả */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Giá bán (VNĐ) <span className="required">*</span></label>
                            <input
                                type="text"
                                placeholder="VD: 55.000"
                                value={gia}
                                onChange={handlePriceChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
                        <textarea
                            rows="4"
                            placeholder="Mô tả sự hấp dẫn của món ăn để thu hút khách hàng..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Hàng 3: Danh sách Link Ảnh */}
                    <div className="form-group">
                        <label>Hình ảnh (Tải lên từ máy) <span className="required">*</span></label>
                        <div className="image-inputs-container">
                            {images.map((imgUrl, index) => (
                                <div key={index} className="image-input-row" style={{ flexDirection: 'column' }}>

                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {/* ĐỔI THÀNH INPUT FILE */}
                                        <input
                                            type="file"
                                            accept="image/*" /* Chỉ cho phép chọn file ảnh */
                                            onChange={(e) => handleFileChange(index, e)}
                                        />

                                        {images.length > 1 && (
                                            <button type="button" className="btn-remove-img" onClick={() => removeImageField(index)}>✕</button>
                                        )}
                                    </div>

                                    {/* Hiển thị ảnh xem trước nếu đã tải lên thành công */}
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

                    {/* Nút Submit */}
                    <button type="submit" className="btn-submit-product" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang lưu hệ thống...' : 'Lưu Sản Phẩm'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAddProduct;