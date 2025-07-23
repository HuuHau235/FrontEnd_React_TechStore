import React, { useEffect, useState } from "react";
import "./OrderManagement.css";
import { FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;

  useEffect(() => {
    setLoading(true);
    fetch("https://backend-laravel-techstore-4.onrender.com/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          setOrders(data.data);
        } else {
          toast.error("Unexpected API response", data);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch orders", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDeleteOrder = (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    fetch(`https://backend-laravel-techstore-4.onrender.com/api/admin/orders/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setOrders((prev) => prev.filter((o) => o.id !== id));
          toast.success("Order deleted successfully.");
        } else {
          toast.error("Failed to delete order.");
        }
      })
      .catch((err) => {
        toast.error("Delete error:", err);
        toast.error("An error occurred while deleting the order.");
      });
  };
    const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case "pending":
        return "status-badge pending";
        case "completed":
        return "status-badge completed";
        case "processing":
        return "status-badge processing"; 
        case "cancelled":
        return "status-badge cancelled";
        default:
        return "status-badge";
    }
    };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="order-management">
      <h2>Order Management</h2>
      <p>Manage all orders in the system.</p>

      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Status</th>
              <th>Shipping</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user_name}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                        {order.status}
                    </span>
                  </td>                  
                  <td>{order.shipping_option}</td>  
                  <td>{order.total_amount.toLocaleString()}</td>
                  <td>{order.order_date}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="delete-btn" onClick={() => handleDeleteOrder(order.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No orders available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
