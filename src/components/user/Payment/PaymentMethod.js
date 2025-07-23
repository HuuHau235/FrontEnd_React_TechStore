import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../pages/user/Payment/Payment.css";
import axios from "axios";
import InformationProductDetail from "./InformationProductDetail";

const paymentMap = {
  cash: "COD",
  momo: "Momo",
  qr: "QR",
  vnpay: "VNPay",
};

const PaymentIcon = ({ type }) => {
  switch (type) {
    case "card":
      return <svg width="24" height="24"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
    case "phone":
      return <svg width="24" height="24"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
    case "cash":
      return <svg width="24" height="24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
    case "qr":
      return <svg width="24" height="24"><rect x="3" y="3" width="5" height="5" /><rect x="16" y="3" width="5" height="5" /><rect x="3" y="16" width="5" height="5" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>;
    default:
      return null;
  }
};

const PaymentMethod = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const orderId = localStorage.getItem("currentOrderId");


  const handleAccept = async () => {
    if (!selectedPayment) return alert("Please select a payment method.");
    if (!orderId) return alert("Order ID not found.");

    const exchangeRate = 24000;
    const amountVND = Math.round(total * exchangeRate);

    try {
      setIsLoading(true);

      if (selectedPayment === "qr") {
        if (!showQRCode) return setShowQRCode(true);
        await axios.post("https://backend-laravel-techstore-4.onrender.com/api/user/orders/confirm-payment", {
          order_id: orderId,
          method: paymentMap[selectedPayment],
        });
        alert("✅ Your QR payment has been successfully confirmed!");
        return navigate("/user/payment_confirmation");
      }


      if (selectedPayment === "cash") {
        await axios.post("https://backend-laravel-techstore-4.onrender.com/api/user/orders/confirm-payment", {
          order_id: orderId,
          method: paymentMap[selectedPayment],
        });
        alert("✅ You have successfully paid with cash!");
        return navigate("/user/payment_confirmation");
      }

      if (selectedPayment === "momo") {
        if (amountVND > 50000000) return alert("⚠️ MoMo supports payments up to 50 million VND.");
        const res = await fetch("https://backend-laravel-techstore-4.onrender.com/api/user/momo/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount: amountVND, order_id: orderId }),
        });
        const data = await res.json();
        if (data.payUrl) window.location.href = data.payUrl;
        else alert("❌ Failed to create MoMo payment link.");
        return;
      }

      if (selectedPayment === "vnpay") {
        const res = await axios.post("https://backend-laravel-techstore-4.onrender.com/api/user/create-payment", {
          amount: amountVND,
          order_id: orderId,
        });
        if (res.data && res.data.url) {
          window.location.href = res.data.url;
        } else {
          alert("❌ Failed to create VNPay payment link.");
        }
        return;
      }
    } catch (err) {
      alert("An error occurred while processing the payment.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    { id: "momo", name: "MoMo", description: "Payment via MoMo", icon: "phone" },
    { id: "cash", name: "Cash", description: "Payment via Cash", icon: "cash" },
    { id: "qr", name: "QR", description: "Payment via QR", icon: "qr" },
    { id: "vnpay", name: "VNPay", description: "Payment via VNPay", icon: "card" },
  ];
useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `https://backend-laravel-techstore-4.onrender.com/api/user/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch order");

      const data = await res.json();
      if (data.order) {
        setTotal(parseFloat(data.order.total_amount || 0));
      }
    } catch (err) {
      console.error("Error fetching order in PaymentMethod:", err.message);
    }
  };

  if (orderId && token) {
    fetchOrder();
  }
}, [orderId, token]);
  return (
    <div className="payment-container-paymentMethod">
      <h1 className="payment-title-paymentMethod">Payment</h1>
      <div className="payment-content-paymentMethod">
        <div className="left-section-paymentMethod">
          <div className="step-section-paymentMethod completed-paymentMethod">
            <div className="step-header-paymentMethod">
              <div className="step-number-paymentMethod completed-paymentMethod">1</div>
              <h2>Information Order</h2>
            </div>
          </div>

          <div className="step-section-paymentMethod active-paymentMethod">
            <div className="step-header-paymentMethod">
              <div className="step-number-paymentMethod active-paymentMethod">2</div>
              <h2>Payment Method</h2>
            </div>

            <div className="payment-methods-paymentMethod">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-option-paymentMethod ${selectedPayment === method.id ? "selected-paymentMethod" : ""}`}
                  onClick={() => {
                    setSelectedPayment(method.id);
                    setShowQRCode(method.id === "qr");
                  }}
                >
                  <div className="payment-icon-paymentMethod"><PaymentIcon type={method.icon} /></div>
                  <div className="payment-info-paymentMethod">
                    <h3>{method.name}</h3>
                    <p>{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedPayment === "qr" && showQRCode && (
              <div className="qr-code-container-paymentMethod" style={{ marginTop: "20px" }}>
                <h4>Please scan the QR code to pay:</h4>
                <img
                  className="qr-image-paymentMethod"
                  src="/assets/images/QR_Code.png"
                  alt="QR Code"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              </div>
            )}

            {selectedPayment === "vnpay" && (
              <div style={{ marginTop: "20px", fontStyle: "italic", color: "#555" }}>
                You will be redirected to VNPay to complete the payment.
              </div>
            )}

            <div className="payment-footer-paymentMethod">
               <div className="total-section-paymentMethod">
                <span className="total-label-paymentMethod">Total:</span>
                <span className="total-amount-paymentMethod">${total.toFixed(2)}</span>
              </div>


              <button
                className="accept-btn-paymentMethod"
                onClick={handleAccept}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Accept"}
              </button>
            </div>
          </div>

          <div className="step-section-paymentMethod">
            <div className="step-header-paymentMethod">
              <div className="step-number-paymentMethod">3</div>
              <h2>Order Confirmation</h2>
            </div>
          </div>
        </div>

        <div className="right-section-paymentMethod">
        <InformationProductDetail
  products={products}
  subtotal={subtotal}
  discount={discount}
  shippingFee={shippingFee}
  total={total}
/>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;