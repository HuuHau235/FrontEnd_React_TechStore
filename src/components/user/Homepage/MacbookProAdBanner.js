import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BuyNow from "../Button/BuyNow";

const MacbookProAdBanner = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/product/index");
        setProducts(product.data.data);
      } catch (err) {
        console.log("Fetch product of lastHome: ", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < products.length ? prevIndex + 1 : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  const product = products[currentIndex];
  if (!product) return null;

  return (
    <div className="macbook-showcase">
      <div className="content-left">
        {product.old_price > product.price && (
          <div className="save-badge">
            Save up to ${(product.old_price - product.price).toFixed(2)}
          </div>
        )}
        <h1 className="product-title-macbook">{product.name}</h1>
        <p className="product-description">{product.description}</p>

        <BuyNow
          product={product}
          className="promo-button-best-seller"
          label="SHOP NOW"
        />
      </div>

      <div className="content-right">
        <span className="price-tag">
          <span>${product.price}</span>
        </span>
        <img
          src={product.image_url || "/assets/images/default-image.png"}
          alt={product.name}
          className="macbook-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/images/default-image.png";
          }}
        />
      </div>
    </div>
  );
};

export default MacbookProAdBanner;
