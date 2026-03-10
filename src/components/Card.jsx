import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
function Card(props) {
    const images = Array.isArray(props.linkAnh) ? props.linkAnh : [props.linkAnh];

    const [currentIndex, setCurrentIndex] = useState(0);
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Hàm bấm nút sang trái
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    return (
        <div className="card">
            <div className="image-slider">
                {images.length > 1 && (
                    <>
                        <button className="btn-arrow btn-prev" onClick={prevSlide}>❮</button>
                        <button className="btn-arrow btn-next" onClick={nextSlide}>❯</button>
                    </>
                )}

                <img src={images[currentIndex] || 'https://via.placeholder.com/300'} alt={props.nameProduct} className="card-img" />

                {images.length > 1 && (
                    <span>
                        {currentIndex + 1}/{images.length}
                    </span>
                )}
            </div>

            <div>
                <Link to={`/product/${props.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2>{props.nameProduct}</h2>
                </Link>
                <p>{props.price}</p>
                <button onClick={props.handleMua} className="btn-buy">Mua</button>
            </div>
        </div>
    );
}
export default Card;