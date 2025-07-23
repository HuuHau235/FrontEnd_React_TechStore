import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../pages/user/Payment/Payment.css";

const PaymentMethod = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutData"));
    if (data?.total) {
      setTotalAmount(data.total);
    }
  }, []);

  const handlePaymentSelect = (methodId) => {
    setSelectedPayment(methodId);
  };

  const handleAccept = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }

    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    const usd = checkoutData?.total || totalAmount;
    const exchangeRate = 24000;
    const roundedAmount = Math.round(usd * exchangeRate);



    const orderId = localStorage.getItem("currentOrderId");

    if (!orderId) {
      alert("Order_id not found. Please return to the information entry step.");
      return;
    }

    if (selectedPayment === "momo") {
      console.log("📦 Send MoMo:", { amount: roundedAmount, order_id: orderId });
      setIsLoading(true);

      try {
        const response = await fetch("https://backend-laravel-techstore-4.onrender.com/api/user/momo/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({
            amount: roundedAmount,
            order_id: orderId,
          }),
        });

        const data = await response.json();
        if (data.payUrl) {
          window.location.href = data.payUrl;
        } else {
          alert("Unable to create MoMo link.");
        }
      } catch (error) {
        console.error("MoMo API error:", error);
        alert("An error occurred while connecting to MoMo.");
      } finally {
        setIsLoading(false);
      }

    } else if (selectedPayment === "cash") {
      alert("You choose to pay cash!");
      navigate("/order-success");
    } else {
      alert(`Method "${selectedPayment}" not supported yet.`);
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Choose Payment Method</h1>

      <div className="payment-methods">
        {["momo", "vnpay", "cash", "qr"].map((id) => (
          <div
            key={id}
            className={`payment-option ${selectedPayment === id ? "selected" : ""}`}
            onClick={() => handlePaymentSelect(id)}
          >
            <div className="payment-icon">💰</div>
            <div className="payment-details">
              <h3>{id.toUpperCase()}</h3>
              <p>Pay with {id.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-footer">
        <div className="total-section">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <button
          className="accept-btn"
          onClick={handleAccept}
          disabled={!selectedPayment || isLoading}
        >
          {isLoading ? "Processing..." : "Accept"}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
