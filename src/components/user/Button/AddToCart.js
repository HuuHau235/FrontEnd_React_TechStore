import React, { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from '../../../context/CartContext';

const apiUrl = process.env.REACT_APP_BE_URL;

const AddToCart = ({ product, quantity = 1, selectedColor = null, className = "", children }) => {
  const { syncCartItems } = useContext(CartContext);

  const checkStockBeforeAdd = async (productId, quantityToAdd) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiUrl}/api/user/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartItems = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const existingItem = cartItems.find(item =>
        item.product_id === productId &&
        (selectedColor ? item.color === selectedColor : true) // Nếu có selectedColor thì check đúng màu
      );

      const inCart = existingItem ? existingItem.quantity : 0;
      const totalAfterAdd = inCart + quantityToAdd;

      if (totalAfterAdd > product.stock) {
        toast.warning(`⚠️ Bạn đã có ${inCart} sản phẩm trong giỏ. Thêm ${quantityToAdd} nữa sẽ vượt tồn kho (${product.stock}).`);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error checking cart:", err);
      toast.error("Không thể kiểm tra giỏ hàng.");
      return false;
    }
  };

  const handleAddToCart = async () => {
    if (!product || typeof product.stock === "undefined") {
      toast.error("Không tìm thấy thông tin sản phẩm.");
      return;
    }

    const isValid = await checkStockBeforeAdd(product.id, quantity);
    if (!isValid) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      let payload = {
        product_id: product.id,
        quantity,
      };

      let apiEndpoint = "";

      if (selectedColor) {
        // ✅ Trường hợp Product Detail
        payload.color = selectedColor;
        apiEndpoint = `${apiUrl}/api/product/add-to-cart`;
      } else {
        // ✅ Trường hợp Product List (mặc định Black)
        payload.color = "black";
        apiEndpoint = `${apiUrl}/api/user/cart/add`;
      }

      await axios.post(apiEndpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      toast.success(`Đã thêm vào giỏ hàng! (${payload.color})`);
      syncCartItems();
    } catch (error) {
      console.error("❌ Lỗi thêm vào giỏ hàng:", error);

      const message = error.response?.data?.message || "Thêm vào giỏ hàng thất bại.";
      const stock = error.response?.data?.stock;
      const in_cart = error.response?.data?.in_cart;

      if (error.response?.status === 401) {
        toast.error("Bạn cần đăng nhập để mua hàng.");
      } else if (
        error.response?.status === 400 &&
        message.toLowerCase().includes("exceeds available stock")
      ) {
        toast.warning(`Chỉ còn ${stock} sản phẩm trong kho, bạn đã có ${in_cart} sản phẩm trong giỏ.`);
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <button onClick={handleAddToCart} className={`flex items-center gap-2 transition ${className}`}>
      {children || "ADD TO CART"}
    </button>
  );
};

export default AddToCart;

