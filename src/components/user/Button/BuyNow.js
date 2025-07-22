import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuyNow = ({ product, className = "", children }) => {
  const navigate = useNavigate();

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) throw new Error("Missing token or user ID");

      const res = await axios.post(
        "https://backendlaraveltechstore-production.up.railway.app/api/user/orders/create",
        {
          user_id: userId,
          products: [
            {
              product_id: product?.id,
              quantity: 1,
              unit_price: product.price,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const orderId = res.data.order_id;
      localStorage.setItem("currentOrderId", orderId);
      navigate(`/user/payment/`);
    } catch (error) {
      console.error("Order creation failed:", error.response?.data || error.message);
      alert("Order failed. Please try again.");
    }
  };

  return (
    <button onClick={handleBuyNow} className={`transition ${className}`}>
      {children || "Buy Now"}
    </button>
  );
};

export default BuyNow;