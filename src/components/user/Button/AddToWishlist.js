import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default class AddToWishlist extends Component {
  state = {
    added: this.props.addedToWishlist || false,
  };

  async componentDidMount() {
    const token = localStorage.getItem("token");
    const productId = this.props.item?.id || this.props.item;

    if (!token || !productId) return;

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await axios.get(
        `https://backend-laravel-techstore-4.onrender.com/api/user/wishlist/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const wishlistItems = response.data?.wishlist || [];

      const alreadyInWishlist = wishlistItems.some(
        (item) => item.product_id === productId
      );

      if (alreadyInWishlist) {
        this.setState({ added: true });
      }

    } catch (error) {
      console.error("Failed to fetch wishlist:", error.response?.data || error.message);
    }
  }

  handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const userIdRes = await axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/getUserId", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        withCredentials: true,
      });

      const finalUserId = userIdRes.data.userId;

      const response = await axios.post(
        "https://backend-laravel-techstore-4.onrender.com/api/user/wishlist/add",
        { user_id: finalUserId, product_id: productId },
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );

      const msg = response.data?.message;

      if (msg === "Đã có trong wishlist") {
        toast.info("This product is already in your wishlist.");
      } else {
        toast.success("Successfully added to wishlist!");
        window.dispatchEvent(new Event("wishlist-updated"));
      }

    } catch (error) {
      toast.error("Failed to add to wishlist.");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  render() {
    const { item, className, children } = this.props;
    const { added } = this.state;

    return (
      <button
        onClick={() => this.handleAddToWishlist(item.id || item)}
        className={className}
      >
        {children}
      </button>
    );
  }
}
