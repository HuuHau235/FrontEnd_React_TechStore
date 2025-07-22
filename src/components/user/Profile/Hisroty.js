import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Repeat, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_BE_URL;

const HistoryContent = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchOrderHistory = async (date) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/user/order-history`, {
        params: { date },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const orders = response.data.data || [];
      setHistoryData(orders);
    } catch (error) {
      toast.error("Unable to load order history.");
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrderHistory = async (orderId) => {
    try {
      await axios.delete(`${apiUrl}/api/user/order-history/delete`, {
        data: { order_id: orderId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Deleted order history successfully!");
      fetchOrderHistory(selectedDate);
    } catch (error) {
      toast.error("Failed to delete order history.");
      console.error(error);
    }
  };

 const handleReorderOrder = async (order) => {
  const unavailableProducts = order.order_details.filter(
    (detail) => !detail.product
  );

  if (unavailableProducts.length > 0) {
    const names = unavailableProducts.map((d) => d.product_name || "Không rõ").join(", ");
    toast.error(`Không thể đặt lại. Sản phẩm đã hết hàng hoặc không còn: ${names}`);
    return;
  }


  const products = order.order_details.map((detail) => ({
    product_id: detail.product_id,
    quantity: detail.quantity,
    unit_price: detail.unit_price,
  }));

  try {
    const response = await axios.post(
      "/api/user/orders/create",
      { products },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newOrderId = response.data.order_id;
    const {
      full_name,
      phone,
      address,
      province,
      district,
      ward,
    } = order;
// console.log("🟢 Sending PUT request to update order info with:");
//     console.log("Order ID:", newOrderId);
    console.log("Payload:", {
      full_name,
      phone,
      address,
      province,
      district,
      ward,
    });
    if (full_name && phone && address && province && district && ward) {
      await axios.put(
        `/api/user/orders/${newOrderId}/update-info`,
        {
          full_name,
          phone,
          address,
          province,
          district,
          ward,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    toast.success("Đặt lại đơn hàng thành công!");
    navigate(`/user/payment?orderId=${newOrderId}`);
  } catch (error) {
    toast.error("Đặt lại đơn hàng thất bại.");
    console.error(error);
  }
};


  useEffect(() => {
    if (selectedDate) {
      fetchOrderHistory(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="history-content">
      <h1 className="history-title">Purchase History</h1>
      <div className="history-container">
        <div className="date-selector">
          <label className="date-text">Select date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>

        {historyData.length === 0 ? (
          <p className="no-data-message">No orders found on this date.</p>
        ) : (
          <ul className="order-list">
            {historyData.map((order) => (
              <li key={order.id} className="order-item">
                <div className="order-products">
                  {order.order_details.map((detail) => (
                    <div key={detail.id} className="product-in-order">
                      <img
                        src={detail.product?.images?.[0]?.image_url || "/placeholder.svg"}
                        alt={detail.product?.name}
                        className="product-image-history"
                      />
                      <div className="product-info">
                        <p className="product-name">{detail.product?.name}</p>
                        <p className="product-quantity">Quantity: {detail.quantity}</p>
                        <p className="product-price">Unit Price: ${detail.unit_price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-actions">
                  <button
                    className="edit-icon"
                    onClick={() => handleReorderOrder(order)}
                  >
                    <Repeat className="reorder-icon" />
                  </button>

                  <button
                    className="edit-icon"
                    onClick={() => handleDeleteOrderHistory(order.id)}
                  >
                    <X className="delete-icon" />
                  </button>
                </div>
              </li>

            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryContent;