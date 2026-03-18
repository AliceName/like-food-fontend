import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';
// --- Khắc phục lỗi hiển thị Icon mặc định của Leaflet trong React ---
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------------------------------------------------

// Component con để xử lý sự kiện click trên bản đồ
const LocationMarker = ({ position, setPosition }) => {
    const map = useMap();
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { animate: true, duration: 1.5 });
        }
    }, [position, map]);
    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const LocationPicker = ({ onLocationSelect }) => {
    // Tọa độ mặc định (Ví dụ: Trung tâm TP.HCM)
    const [position, setPosition] = useState({ lat: 10.762622, lng: 106.660172 });
    const [isLocating, setIsLoacting] = useState(false);
    const [isConverting, setIsConverting] = useState(false);

    const handleGetLocationCurrent = (e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
            alert("Trình duyệt không hỗ trợ GPS");
            return;
        }
        setIsLoacting(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setIsLoacting(false);
            },
            (error) => {
                console.error("Lỗi định vị: ", error);
                setIsLoacting(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setIsConverting(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
                onLocationSelect(data.display_name);
            } else {
                alert("Không thể nhận diện được địa chỉ này.");
            }
        } catch (error) {
            console.error("Lỗi dịch địa chỉ:", error);
            alert("Có Lỗi xảy ra khi lấy tên đường ");
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="location-picker-container">
            <div>
                <p>Chọn vị trí trên bản đồ</p>
                <button
                    onClick={handleGetLocationCurrent}
                    disabled={isLocating}
                >
                    {isLocating ? '⏳ Đang dò tìm...' : '🎯 Vị trí của tôi'}
                </button>
            </div>
            <MapContainer center={position} zoom={13} className="map-view-area">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>

            <button onClick={handleConfirm}
                disabled={isConverting}>
                {isConverting ? '🔄 Đang dịch địa chỉ...' : 'Xác nhận điền địa chỉ này'}
            </button>
        </div>
    );
};

export default LocationPicker;