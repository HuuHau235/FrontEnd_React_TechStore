import "../../../components/user/Wishlist/Wishlist.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BuyNow from "../../../components/user/Button/BuyNow";
import AddToCart from "../../../components/user/Button/AddToCart";
export default function Wishlist() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "Loading...",
    email: "",
    avatar: "https://placehold.co/80",
  });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveFromWishlist = async (item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      await axios.delete(
        `https://backend-laravel-techstore-4.onrender.com/api/user/delete/wishlist/${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      setWishlistItems((prev) => prev.filter((wishItem) => wishItem.id !== item.id));
      window.dispatchEvent(new Event("wishlist-updated"));

    } catch (error) {
      console.error("Failed to remove from wishlist:", error.response?.data || error.message);
      toast.error("Failed to remove item from wishlist.");
    }
  };

  useEffect(() => {
    const fetchUserDataAndWishlist = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found.");

        const idRes = await axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/getUserId", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const fetchedUserId = idRes.data.userId;
        setUserId(fetchedUserId);

        const userRes = await axios.get(`https://backend-laravel-techstore-4.onrender.com/api/user/${fetchedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const user = userRes.data.data;
        setProfile({
          username: user.name ?? "N/A",
          email: user.email ?? "N/A",
          avatar: user.avatar?.trim() || "https://placehold.co/80",
        });

        const wishlistRes = await axios.get(
          `https://backend-laravel-techstore-4.onrender.com/api/user/wishlist/${fetchedUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const wishlistData = wishlistRes.data;
        setWishlistItems(wishlistData);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndWishlist();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="wishlist-container">
      <div className="profile-card">
        <img src={profile.avatar} alt="profile" className="profile-image" />
        <div>
          <h2 className="profile-name">{profile.username}</h2>
          <p className="profile-role">{profile.email}</p>
        </div>
      </div>

      <h3 className="wishlist-title">Wishlist ({wishlistItems.length})</h3>

      <div className="wishlist-table">
        <div className="wishlist-header">
          <div className="col-product"></div>
          <div className="col-price">PRICES</div>
          <div className="col-action">ACTION</div>
        </div>

        {wishlistItems.map((item) => {
          const product = {
            ...item.product,
            stock: item.product?.stock ?? 10,
          };

          return (
            <div className="wishlist-row" key={item.id}>
              <div className="col-product">
                <img
                  src={product?.images?.[0]?.image_url || "https://placehold.co/100x70?text=No+Image"}
                  alt={product?.name || "Product"}
                  className="item-img"
                />
                <div>
                  <p className="item-title">{product?.name}</p>
                  <small className="item-description">{product?.description}</small>
                </div>
              </div>

              <div className="col-price">
                <span className="item-prices">${product?.price}</span>
              </div>

              <div className="col-action">
                <BuyNow className="buy-now-btn" product={product} label="SHOW NOW" />
                <AddToCart className="add-to-cart-btn" product={product} quantity={1}>
                  Add To Cart
                </AddToCart>

                <button
                  className="heart-icon"
                  onClick={() => handleRemoveFromWishlist(item)}
                  title="Remove from wishlist"
                >
                  ❤️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
