import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../pages/user/Product/Product.css";
import DescriptionTab from "./DescriptionTab";
import SpecificationsTab from "./SpecificationsTab";
import ReviewsTab from "./ReviewsTab";
import ReviewModal from "./ReviewModal";
import { toast } from "react-toastify";
import LoadingSpinner from "../../common/LoadingSpinner";
import AddToCart from "../Button/AddToCart";
import AddToWishlist from "../Button/AddToWishlist";
import BuyNow from "../Button/BuyNow";

import {
  ShoppingCart,
  Heart,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw,
  CirclePlus,
} from "lucide-react";

const apiUrl = process.env.REACT_APP_BE_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/product/${id}/detail`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;
        setProduct(data);
        setMainImage(Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : "/placeholder.svg");
        setSelectedColor(data.colors?.[0] || "Black");
      } catch (err) {
        toast.error("Unable to retrieve product information.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
      isDown = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      slider.classList.remove("dragging");
    };

    const mouseUpHandler = () => {
      isDown = false;
      slider.classList.remove("dragging");
    };
    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", mouseDownHandler);
    slider.addEventListener("mouseleave", mouseLeaveHandler);
    slider.addEventListener("mouseup", mouseUpHandler);
    slider.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      slider.removeEventListener("mousedown", mouseDownHandler);
      slider.removeEventListener("mouseleave", mouseLeaveHandler);
      slider.removeEventListener("mouseup", mouseUpHandler);
      slider.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab />;
      case "specifications":
        return <SpecificationsTab />;
      case "reviews":
        return <ReviewsTab />;
      default:
        return null;
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/user/product-detail/${productId}`);
  };

  useEffect(() => {
    if (!id) return;

    const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/product/${id}/related`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Related products response:", res.data);
        setRelatedProducts(Array.isArray(res.data.data) ? res.data.data : []);

      } catch (error) {
        console.error("Error fetching related products:", error);
        toast.error("Unable to load related products");
      }
    };

    fetchRelatedProducts();
  }, [id]);

  if (loading) return <div className="loading"><LoadingSpinner />.</div>;
  if (!product) return <div className="error">Product not found.</div>;

  return (
    <div className="container-product-detail">
      <div className="product-section-product-detail">
        <div className="product-images-product-detail">
          <img
            src={mainImage}
            alt={product.name}
            className="main-image-product-detail"
          />
          <div className="thumbnail-gallery-product-detail">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail-product-detail ${mainImage === img ? "active-product-detail" : ""
                  }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="product-info-product-detail">
          <h1 className="product-title-product-detail">{product.name}</h1>

          <div className="price-section-product-detail">
            <span className="current-price-product-detail">${product.price}</span>
            {product.old_price && (
              <span className="original-price-product-detail">${product.old_price}₫</span>
            )}
          </div>

          <div className="product-options-product-detail">
            <div className="option-group-product-detail">
              <label className="option-label-color-product-detail">Color:</label>
              <div className="color-options-product-detail">
                {(product.colors || ["Black", "White"]).map((color) => (
                  <button
                    key={color}
                    className={`color-option-product-detail ${selectedColor === color ? "active-product-detail" : ""}`}
                    onClick={() => {
                      setSelectedColor(color);
                      console.log("Selected color:", color);
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="quantity-section-product-detail">
            <label className="option-label-quantity-product-detail">Quantity:</label>
            <div className="quantity-controls-product-detail">
              <button className="quantity-btn-product-detail" onClick={() => handleQuantityChange(-1)}>
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input-product-detail"
                min="1"
                max="99"
              />
              <button className="quantity-btn-product-detail" onClick={() => handleQuantityChange(1)}>
                +
              </button>
            </div>
            <span className="stock-info-product-detail">
              Only {product.stock} item(s)
            </span>
          </div>

          <div className="action-buttons-product-detail">
            <AddToCart
              product={product}
              quantity={quantity}
              selectedColor={selectedColor}
              className="add-to-cart-btn-product-detail"
            >
              <ShoppingCart color="#fff" size={25} style={{ marginRight: 8 }} />
              Add to Cart
            </AddToCart>

            <div className="secondary-actions-product-detail">
              <BuyNow className="secondary-btn-product-detail" product={product}>
                <CreditCard size={18} color="#000000" style={{ marginRight: 8 }} />
                Buy Now
              </BuyNow>
              <AddToWishlist item={product.id} className="secondary-btn-product-detail">
                <Heart size={18} color="#000000" style={{ marginRight: 8 }} /> Favorited
              </AddToWishlist>
            </div>
          </div>

          <div className="trust-badges-product-detail">
            <div className="badge-product-detail">
              <Truck strokeWidth={3} size={22} color="#13830C" />
              <span>Free Shipping</span>
            </div>
            <div className="badge-product-detail">
              <ShieldCheck strokeWidth={3} size={22} color="#0980CD" />
              <span>Official Warranty</span>
            </div>
            <div className="badge-product-detail">
              <RotateCcw strokeWidth={3} size={22} color="#FF0000" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      <div className="specifications-product-detail">
        <div className="spec-tabs-product-detail">
          <button
            className={`spec-tab-product-detail ${activeTab === "description" ? "active-product-detail" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Product Description
          </button>
          <button
            className={`spec-tab-product-detail ${activeTab === "specifications" ? "active-product-detail" : ""}`}
            onClick={() => setActiveTab("specifications")}
          >
            Specifications
          </button>
          <button
            className={`spec-tab-product-detail ${activeTab === "reviews" ? "active-product-detail" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              Reviews
              <CirclePlus
                size={18}
                style={{ marginLeft: 8, cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReviewModalOpen(true);
                }}
              />
            </div>
          </button>
        </div>

        <div className={`tab-content ${activeTab === "specifications" ? "with-border" : ""}`}>
          {renderTabContent()}
        </div>
      </div>

      {isReviewModalOpen && <ReviewModal onClose={() => setIsReviewModalOpen(false)} />}
      <div className="related-products-product-detail">
        <h2 className="section-title-product-detail">Related Products</h2>
        <div className="products-grid-product-detail" ref={scrollRef}>
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="product-card-product-detail"
            >
              {product.promotion_type && (
                <div className="promotion_type-badge-product-detail">
                  {product.promotion_type}
                </div>
              )}
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>

              <div className="price-product-detail">
                <span className="current-price">
                  {Number(product.price).toLocaleString("vi-VN")}₫
                </span>
                {product.old_price && (
                  <span className="original-price">
                    {Number(product.old_price).toLocaleString("vi-VN")}₫
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
