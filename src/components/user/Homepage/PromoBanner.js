import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import BuyNow from "../Button/BuyNow";
const PromoBanner = () => {
  const [products, setProducts] = useState([]);
  const [summerSaleProduct, setSummerSaleProduct] = useState(null);
  const navigate = useNavigate();
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, promotedRes] = await Promise.all([
          axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/product/index"),
          axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/product/promoted"),
        ]);

        const productData = productRes.data?.data || [];
        const promotedData = promotedRes.data?.data || [];

        setProducts(productData.slice(0, 3));

        const summerSale = promotedData.find(p => p.promotion_type === "summer sale");
        setSummerSaleProduct(summerSale || null);
      } catch (error) {
        console.error("❌ API call error:", error);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? "0.00" : num.toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  const fallback = {
    name: "No Summer Sale",
    price: 0,
    old_price: 0,
    images: [{ image_url: "https://placehold.co/300x200?text=No+Image" }]
  };

  const displayProduct = summerSaleProduct || fallback;
if (products.length === 0 && !summerSaleProduct) return null;

  return (
    <div className="showcase-container-banner">
       <div className="main-product-banner">
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={product.id}>
              <div className="product-content-banner">
                <div className="product-text-banner">
                  <h2 className="product-title-banner">{product.name}</h2>
                  <h3 className="product-subtitle-banner">Xbox</h3>
                  <p className="product-description-banner">{product.description}</p>
                 <BuyNow className="buy-button-banner" product={product} label="SHOW NOW" />
                </div>
                <div className="product-image-banner">
                  <img
                    src={product.images?.[0]?.image_url || "https://placehold.co/300x200"}
                    alt={product.name}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="side-products-banner">
        <div className="product-card-banner">
          <div className="card-overlay-content">
            <div className="promotion-title">
              <span className="sale-badge-banner">SUMMER SALES</span>
              <p className="sale-badge-banner-description">{displayProduct.name}</p>
             <BuyNow className="buy-button-banner" product={displayProduct} label="SHOW NOW" />
            </div>
            <div className="promotion-image">
              <img
                src={displayProduct.images?.[0]?.image_url}
                alt={displayProduct.name}
                className="card-image-banner"
              />
            </div>
          </div>

          <div className="product-card-banner-bottom">
            <div className="card-content-banner-bottom">
              <img
                src={displayProduct.images?.[0]?.image_url}
                alt={displayProduct.name}
                className="card-image-banner"
              />
            </div>
            <div className="price-info-banner">
              <p className="sale-badge-banner-description">{displayProduct.name}</p>
              <p>
                <span className="sale-price-banner">${formatPrice(displayProduct.price)}</span>
                <span className="original-price-banner">${formatPrice(displayProduct.old_price)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
