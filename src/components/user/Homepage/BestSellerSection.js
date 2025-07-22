import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BuyNow from "../Button/BuyNow";
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`star-featured ${index < Math.round(rating) ? "filled-featured" : ""}`}
    >
      ★
    </span>
  ));
};

const ProductCard = ({ product, onClick }) => (
  <div className="product-card-best-seller" onClick={() => onClick(product.id)}>
    {product.badge && (
      <div className={`badge-best-seller badge-${product.badgeType}-best-seller`}>
        {product.badge}
      </div>
    )}
    <div className="product-image-best-seller">
      <img src={product.image_url || "/placeholder.svg"} alt={product.name} />
    </div>
    <div className="product-info-best-seller">
      <h3 className="product-name-best-seller">{product.name}</h3>
      <div className="product-rating-featured">
        <span className="rating-number">{renderStars(product.rating)}</span>
      </div>
      <div className="product-price-best-seller">
        <span className="current-price-best-seller">${product.price}</span>
        {product.old_price && (
          <span className="original-price-best-seller">${product.old_price}</span>
        )}
      </div>
    </div>
  </div>
);

const PromoCard = ({ product, onClick, onBuyNow }) => {
  if (!product) return null;

  return (
    <div className="promo-card-best-seller product-card-featured">
      <div className="promo-content-best-seller">
        <div className="promo-image-best-seller" onClick={() => onClick(product.id)}>
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              display: "block",
              margin: "0 auto"
            }}
          />
        </div>
        <div className="promo-best-seller">
          <div className="promo-label-best-seller">Only for</div>
          <div className="promo-price-best-seller">${product.price}</div>
        </div>
        <h3 className="promo-title-best-seller" onClick={() => onClick(product.id)}>{product.name}</h3>
        <p className="promo-description-best-seller" onClick={() => onClick(product.id)}>{product.description}</p>
        <BuyNow className="promo-button-best-sellers" onClick={() => onBuyNow(product)}>
          SHOP NOW
        </BuyNow>
      </div>
    </div>
  );
};

const BestSellerSection = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/user/product-detail/${productId}`);
  };

  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const res = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/product/promoted");
        const bestDeals = (res.data.data || []).filter(
          (p) => p.promotion_type === "best deal"
        );
        setProducts(bestDeals);
      } catch (error) {
        console.error("❌ API call error:", error);
      }
    };

    fetchBestDeals();
    const interval = setInterval(fetchBestDeals, 5000);
    return () => clearInterval(interval);
  }, []);
if (products.length === 0) return null;
  return (
    <div className="container-best-seller">
      <div className="header-best-seller">
        <h1 className="title-best-seller">Best Seller</h1>
        <a href="#" className="browse-link-best-seller">
          Browse All Product{" "}
          <ArrowRight size={16} color="#2DA5F3" style={{ marginLeft: 6, verticalAlign: "middle" }} />
        </a>
      </div>

      <div className="main-content-best-seller">
        <div className="products-section-best-seller">
          <div className="products-grid-best-seller">
            {products.length === 0 ? (
              <p className="no-products-message">There are no promotional products!</p>
            ) : (
              products.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} onClick={handleProductClick} />
              ))
            )}
          </div>
        </div>
        <div className="promo-section-best-seller">
          <PromoCard product={products[0]} onClick={handleProductClick}/>
        </div>
      </div>
    </div>
  );
};

export default BestSellerSection;
