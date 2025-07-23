import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddToCart from "../Button/AddToCart";
import AddToWishlist from "../Button/AddToWishlist";
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

const BestDealSection = () => {
  const [userId, setUserId] = useState(null);
  const [deals, setDeals] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const fetchUserId = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/getUserId", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const fetchedUserId = res.data.userId;
          localStorage.setItem("userId", fetchedUserId);
          setUserId(fetchedUserId);
        } catch (err) {
          console.error("Failed to fetch user ID:", err);
        }
      };
      fetchUserId();
    }
  }, []);

  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const res = await axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/product/promoted");
        const allPromoted = res.data?.data || [];
        const bestDeals = allPromoted.filter((p) => p.promotion_type === "best deal");
        const uniqueDeals = Array.from(new Map(bestDeals.map(p => [p.id, p])).values());
        setDeals(uniqueDeals);
        const idMap = {};
        uniqueDeals.forEach((item) => {
          idMap[item.id] = (idMap[item.id] || 0) + 1;
        });
        const duplicated = Object.entries(idMap).filter(([id, count]) => count > 1);
        if (duplicated.length > 0) {
          console.warn("⚠️ Duplicate ID in deals:", duplicated);
        }

        if (uniqueDeals.length > 0) {
          const soonest = uniqueDeals
            .filter((p) => p.end_date)
            .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))[0];
          setFeaturedProduct(soonest);
        } else {
          setFeaturedProduct(null);
        }
      } catch (error) {
        console.error("Error when getting Best Deal product:", error);
      }
    };

    fetchBestDeals();
    const interval = setInterval(fetchBestDeals, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!featuredProduct?.end_date) return;

    const updateCountdown = () => {
      const now = new Date();
      const endTime = new Date(featuredProduct.end_date);
      const diff = endTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [featuredProduct]);

  const handleProductClick = (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to view product details!");
      return;
    }

    navigate(`/user/product-detail/${productId}`);
  };

  if (deals.length === 0) return null;
  return (
    <div className="best-deals-container-best-deal">
      <div className="header-section-best-deal">
        <div className="deals-info-best-deal">
          <h1 className="deals-title-best-deal">Best Deals</h1>
          <span className="deals-subtitle-best-deal">Deals ends in</span>
          <div className="countdown-timer-best-deal">
            <span className="time-unit-best-deal">{timeLeft.days}d</span>
            <span className="separator-best-deal">:</span>
            <span className="time-unit-best-deal">{timeLeft.hours}h</span>
            <span className="separator-best-deal">:</span>
            <span className="time-unit-best-deal">{timeLeft.minutes}m</span>
            <span className="separator-best-deal">:</span>
            <span className="time-unit-best-deal">{timeLeft.seconds}s</span>
          </div>
        </div>
        <a href="#" className="browse-all-link-best-deal">
          Browse All Product <ArrowRight size={15} />
        </a>
      </div>

      <div className="content-wrapper-best-deal">
        {featuredProduct && (
          <div className="featured-product-section-best-deal">
            <div className="featured-product-card-best-deal">
              <div className="product-badges-best-deal">
                {featuredProduct.discount && (
                  <span className="discount-badge-best-deal">{featuredProduct.discount}</span>
                )}
                {featuredProduct.isHot && (
                  <span className="hot-badge-best-deal">HOT</span>
                )}
              </div>
              <div className="product-image-container-best-deal">
                <img
                  src={featuredProduct.image_url || "/placeholder.svg"}
                  alt={featuredProduct.title}
                  className="product-image-best-deal"
                  onClick={() => handleProductClick(featuredProduct.id)}
                />
              </div>
              <div className="product-info-best-deal">
                <div className="rating-container-best-deal">
                  <div className="stars-best-deal">{renderStars(featuredProduct.rating)}</div>
                </div>
                <h3
                  className="product-title-best-deal"
                  onClick={() => handleProductClick(featuredProduct.id)}
                >
                  {featuredProduct.title}
                </h3>
                <div
                  className="price-container-best-deal"
                  onClick={() => handleProductClick(featuredProduct.id)}
                >
                  <span className="sale-price-best-deal">${featuredProduct.price}</span>
                  {featuredProduct.old_price && (
                    <span className="original-price-best-deal">${featuredProduct.old_price}</span>
                  )}
                </div>
                <p
                  className="product-description-best-deal"
                  onClick={() => handleProductClick(featuredProduct.id)}
                >
                  {featuredProduct.description}
                </p>
                <div className="action-buttons-best-deal">
                  <AddToWishlist
                    className={`wishlist-btn-best-deal ${addedToWishlist ? "added" : ""}`}
                    item={featuredProduct}
                    addedToWishlist={false}
                  >
                    <Heart color={addedToWishlist ? "red" : "gray"} />
                  </AddToWishlist>


                  <AddToCart
                    product={featuredProduct}
                    className="add-to-cart-btn-best-deal"
                  >
                    <ShoppingCart color="#ffffff" /> ADD TO CART
                  </AddToCart>
                  <button className="view-btn-best-deal" onClick={() => handleProductClick(featuredProduct.id)}>
                    <Eye />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="product-grid-section-best-deal">
          <div className="products-grid-best-deal">
            {deals.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="product-card-best-deal"
                onClick={() => handleProductClick(product.id)}
              >
                {product.badge && (
                  <div className="product-badge-best-deal">{product.badge}</div>
                )}
                <div className="product-image-small-best-deal">
                  <img src={product.image_url || "/placeholder.svg"} alt={product.title} />
                </div>
                <div className="product-details-best-deal">
                  <p className="product-description-best-deal">{product.description}</p>
                  <div className="price-small-best-deal">
                    <span className="current-price-best-deal">${product.price}</span>
                    {product.old_price && (
                      <span className="original-price-small-best-deal">${product.old_price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestDealSection;
