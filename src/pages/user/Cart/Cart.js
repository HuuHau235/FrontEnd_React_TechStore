import { useState, useEffect } from "react";
import axios from "axios";
import Shopping_Cart from "../../../components/user/Cart/Cart_Content";
import "./Cart.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const apiUrl = process.env.REACT_APP_BE_URL;

export default function Cart() {
  const { cartItems, setCartItems } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [shippingOption, setShippingOption] = useState("free");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = () => {
      axios
        .get(`${apiUrl}/api/user/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        })
        .then((response) => {
          const items = response.data.data.map((item) => ({
            id: item.id,
            product_id: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price),
            quantity: item.quantity,
            image:
              item.product.first_image?.image_url ||
              "https://bizweb.dktcdn.net/100/450/808/products/anh-chup-man-hinh-2022-10-05-luc-10-26-02-1664940394276.png?v=1679732596117",
            stock: item.product.stock !== undefined ? item.product.stock : 0,
            color: item.color,
          }));

          console.log("Fetched cart items (with stock):", items);
          setCartItems(items);
          setSelectedItems(items.filter((item) => item.stock > 0).map((item) => item.id));
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    };


    fetchCartItems();
  }, []);


  useEffect(() => {
    console.log("Current cartItems state:", cartItems);
    if (selectedItems.length === 0) {
      setDiscount(0);
      setAppliedCoupon(null);
    }
  }, [selectedItems, cartItems]);


  const handleItemSelect = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    console.log(`Selecting item ${itemId}, stock: ${item?.stock}`);
    if (!item || item.stock === 0 || item.stock === undefined) return;


    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };


  const handleQuantityChange = (itemId, newQuantity) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity < 1) return;

    if (newQuantity > item.stock) {
      toast.error(`⚠️ Quantity Exceeds Stock (${item.stock}) of product "${item.name}"`);
      return;
    }

    axios
      .put(
        `${apiUrl}/api/user/cart/${itemId}/quantity`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const updatedItem = response.data;

        const newQuantityValue =
          updatedItem.quantity !== undefined ? updatedItem.quantity : newQuantity;
        const newStockValue =
          updatedItem.stock !== undefined ? updatedItem.stock : item.stock;

        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                ...item,
                quantity: newQuantityValue,
                stock: newStockValue,
              }
              : item
          )
        );

        toast.success("Quantity updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);

        let errorMessage = "Unable to update quantity due to unknown error!";
        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            `Lỗi server: ${error.response.statusText} (Mã: ${error.response.status})`;
        } else if (error.request) {
          errorMessage = "Unable to connect to server. Please check network!";
        } else {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      });
  };


  const handleRemoveItem = (itemId) => {
    axios
      .delete(`${apiUrl}/api/user/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        setSelectedItems((prev) => prev.filter((id) => id !== itemId));
        toast.success("Remove item successfully.");
      })
      .catch((error) => {
        alert("Cannot remove product from cart.");
      });
  };


  const handleShippingChange = (e) => {
    setShippingOption(e.target.value);
  };


  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };


  const handleApplyCoupon = () => {
    axios
      .post(
        `${apiUrl}/api/user/cart/apply-coupon`,
        { code: couponCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const coupon = response.data.coupon;
        setAppliedCoupon(coupon);

        const subtotal = cartItems
          .filter((item) => selectedItems.includes(item.id))
          .reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (coupon.type === "percent") {
          setDiscount((subtotal * coupon.value) / 100);
        } else {
          setDiscount(Number(coupon.value));
        }

        toast.success(`Discount code applied successfully.: ${coupon.code}`);
      })
      .catch((error) => {
        const message = error.response?.data?.message || "The coupon is invalid.";

        if (message === "Coupon has expired") {
          toast.warning("The discount code has expired!");
        } else if (message === "Coupon not found") {
          toast.warning("The discount code does not exist!");
        } else {
          toast.error("Unable to apply the discount code!");
        }

        setDiscount(0);
        setAppliedCoupon(null);
      });
  };


  const handleEmptyCart = () => {
    if (!window.confirm("Are you sure you want to empty your cart?")) return;


    axios
      .delete(`${apiUrl}/api/user/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        toast.success("Cart emptied successfully!");
        setCartItems([]);
        setSelectedItems([]);
      })
      .catch((error) => {
        toast.error("Failed to clear cart.");
      });
  };


  const handleSelectAll = () => {
    const availableIds = cartItems.filter((item) => item.stock > 0).map((item) => item.id);
    setSelectedItems(availableIds);
  };


  const handleProceedToCheckout = async () => {
    const selectedData = cartItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => ({
        cart_item_id: item.id,
        product_id: item.product_id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
      }));

    const payload = {
      selected_items: selectedData,
      shipping_option: shippingOption,
      shipping_fee: shippingCost,
      coupon_code: appliedCoupon?.code || null,
      discount: discount,
      total_amount: subtotal - discount + shippingCost,
    };


    try {
      const response = await axios.post(`${apiUrl}/api/user/cart/checkout`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const orderId = response.data?.order_id || response.data?.data?.id;
      if (orderId) {
        localStorage.setItem("currentOrderId", orderId);
      } else {
        console.warn("⚠️ Unable to receive order_id from server");
      }

      localStorage.setItem("checkoutData", JSON.stringify({
        items: selectedData,
        subtotal,
        discount,
        shippingCost,
        total: subtotal - discount + shippingCost,
      }));

      toast.success("✅ Checkout successful! Redirecting to payment...");
      navigate("/user/payment");
    } catch (error) {
      toast.error("❌ Checkout failed.");
      console.error(error);
    }
  };



  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingOption === "local" ? 5.0 : shippingOption === "flat" ? 15.0 : 0.0;
  const total = subtotal - discount + shippingCost;


  return (
    <>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2 className="empty-cart-title">
            Your cart is empty <ShoppingCart size={28} style={{ marginBottom: "-6px" }} />
          </h2>
          <p className="empty-cart-description">Browse our products and find something you love!</p>
          <button className="btn-cart" onClick={() => (window.location.href = "/user/product")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <Shopping_Cart
          cartItems={cartItems}
          selectedItems={selectedItems}
          shippingOption={shippingOption}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          discount={discount}
          handleItemSelect={handleItemSelect}
          handleQuantityChange={handleQuantityChange}
          handleRemoveItem={handleRemoveItem}
          handleShippingChange={handleShippingChange}
          handleCouponChange={handleCouponChange}
          handleApplyCoupon={handleApplyCoupon}
          handleEmptyCart={handleEmptyCart}
          handleSelectAll={handleSelectAll}
          handleProceedToCheckout={handleProceedToCheckout}
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
        />
      )}
      <ToastContainer />
    </>
  );
}
