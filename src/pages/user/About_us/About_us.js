import React, { useEffect, useState } from 'react';
import '../../user/About_us/About_us.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";

const AboutUs = () => {
    const [promotedProducts, setPromotedProducts] = useState({
        hot: [],
        new: [],
        summerSale: [],
        bestDeal: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPromotedProducts = async () => {
            try {
                // *** CHỈNH SỬA DÒNG NÀY ***
                // Sử dụng biến môi trường REACT_APP_API_URL đã cấu hình trên Railway
                // và nối với phần còn lại của đường dẫn API
                const response = await fetch(`https://backend-laravel-techstore-4.onrender.com/api/products/promoted-aboutus`);
                const json = await response.json();

                const data = json.data || [];
                console.log(data);

                const categorizedProducts = {
                    hot: data.filter((product) => product.promotion_type === 'hot'),
                    new: data.filter((product) => product.promotion_type === 'new'),
                    summerSale: data.filter((product) => product.promotion_type === 'summer sale'),
                    bestDeal: data.filter((product) => product.promotion_type === 'best deal'),
                };
                setPromotedProducts(categorizedProducts);

            } catch (error) {
                // Thay đổi cách hiển thị lỗi để dễ debug hơn
                console.error('Failed to fetch promoted products:', error);
                toast.error(`Failed to fetch promoted products: ${error.message || error}`);
            }
        };

        fetchPromotedProducts();
    }, []);
    const handleProductClick = (productId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.warning("Please login to view product details!");
            return;
        }

        navigate(`/user/product-detail/${productId}`);
    };

    const renderProducts = (products = [], title) => (
        <div className="product-category">
            <h3>{title}</h3>
            <ul className="product-list" >
                {products.map((product) => (
                    <li key={product.id} className="product-item" onClick={() => handleProductClick(product.id)}>
                        <img
                            src={product.images?.[0]?.image_url || 'https://via.placeholder.com/150'}
                            alt={product.name}
                            className="product-image"
                        />
                        <div className="product-info">
                            <p className="product-name">{product.name}</p>
                            <div className="product-price-container">
                                <p className="product-price">${product.price}</p>
                                {product.old_price && (
                                    <p className="product-old-price">${product.old_price}</p>
                                )}
                            </div>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    );

    return (
        <div className="about-container">
            <div className="top-content-row-about-us">
                <div className="text-container">
                    <div className="who-we-are">WHO WE ARE</div>
                    <h1 className="title">
                        TechStore - largest electronics retail shop in the world.
                    </h1>
                    <p className="description">
                        TechStore is an online platform specializing in high-quality electronic devices from leading brands. We take pride in delivering a modern, convenient, and secure shopping experience to our customers. We aim to be your trusted companion by providing cutting-edge technology products at competitive prices while helping you stay updated with the latest innovations.
                    </p>
                    <ul>
                        <li className="list-item">
                            <span>✔</span>
                            <p>We offer the latest and most reliable electronics from leading brands.</p>
                        </li>
                        <li className="list-item">
                            <span>✔</span>
                            <p>Your satisfaction is our priority; we ensure a seamless shopping experience.</p>
                        </li>
                        <li className="list-item">
                            <span>✔</span>
                            <p>Affordable rates with excellent value for every product.</p>
                        </li>
                    </ul>
                </div>

                <div className="image-container">
                    <img
                        src="https://lh4.googleusercontent.com/proxy/0XpTUDaIygIImiUgj8Dv3-abrla5Xqpydq7GB9u9PGTwNVRM6-LEeVt32vnM20Z8DfwF-jCCpdNPo5fRR0lnKd1GQ5GIYVRYLOTKkSWiogadipyVDDJf"
                        alt="TechStore promotional banner"
                        className="image"
                    />
                </div>
            </div>

            <div className="image-with-text-overlay">
                <img
                    src="https://www.naco.org/sites/default/files/styles/1441x468/public/GettyImages-1435226158.jpg?h=e1f7dfbd&itok=R3DCfrTl"
                    alt="Your trusted and reliable retail shop"
                    className="overlay-image"
                />
                <div className="overlay-text">
                    <h2>Your trusted and reliable retail shop</h2>
                    <p>TechStore is an online platform specializing in high-quality electronic devices from leading brands. We take pride in delivering a modern, convenient, and secure shopping experience to our customers. We aim to be your trusted companion by providing cutting-cutting-edge technology products at competitive prices while helping you stay updated with the latest innovations.</p>
                </div>
            </div>

            <div className="promoted-products-section">
                {renderProducts(promotedProducts.hot, 'Flash Sale Today')}
                {renderProducts(promotedProducts.bestDeal, 'Best Sellers')}
                {renderProducts(promotedProducts.summerSale, 'Top Rated')}
                {renderProducts(promotedProducts.new, 'New Arrivals')}
            </div>
            <ToastContainer />
        </div>
    );
};

export default AboutUs;