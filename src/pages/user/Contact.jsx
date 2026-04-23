import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Giả lập thời gian gửi dữ liệu (Ở dự án thực tế bạn có thể lưu vào DB hoặc dùng EmailJS)
        setTimeout(() => {
            alert(`Cảm ơn ${formData.name}! Lời nhắn của bạn đã được gửi đến LIKEFOOD. Chúng tôi sẽ phản hồi sớm nhất.`);
            setFormData({ name: '', email: '', message: '' }); // Xóa trắng form
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="contact-page-container">
            <div className="contact-header">
                <h2>Liên Hệ Với Chúng Tôi</h2>
                <p>Bạn có thắc mắc hay góp ý? Đừng ngần ngại để lại lời nhắn cho LIKEFOOD nhé!</p>
            </div>

            <div className="contact-content">
                {/* Cột trái: Thông tin liên hệ */}
                <div className="contact-info">
                    <h3>Thông Tin Liên Hệ</h3>
                    <div className="info-item">
                        <span className="icon">📍</span>
                        <div>
                            <h4>Địa chỉ:</h4>
                            <p>Khu Công Nghệ Cao, TP. Thủ Đức, Hồ Chí Minh</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="icon">📞</span>
                        <div>
                            <h4>Điện thoại:</h4>
                            <p>0909 123 456</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="icon">✉️</span>
                        <div>
                            <h4>Email:</h4>
                            <p>support@likefood.com</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="icon">⏰</span>
                        <div>
                            <h4>Giờ mở cửa:</h4>
                            <p>08:00 Sáng - 22:00 Tối (Tất cả các ngày)</p>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Form nhập lời nhắn */}
                <div className="contact-form-container">
                    <h3>Gửi Lời Nhắn</h3>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label>Họ và Tên</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên của bạn..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email để chúng tôi phản hồi..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Nội dung</label>
                            <textarea
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Bạn muốn nói gì với LIKEFOOD?"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-submit-contact" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang gửi...' : 'Gửi Lời Nhắn 🚀'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;