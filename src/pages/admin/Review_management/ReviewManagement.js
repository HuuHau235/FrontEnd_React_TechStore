import React, { useEffect, useState } from "react";
import "./ReviewManagement.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 7;

  useEffect(() => {
    setLoading(true);
    fetch("https://backend-laravel-techstore-4.onrender.com/api/admin/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          setReviews(data.data);
        } else {

          toast.error("Unexpected response", data);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch reviews", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDeleteReview = (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    fetch(`https://backend-laravel-techstore-4.onrender.com/api/admin/delete-reviews/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setReviews((prev) => prev.filter((r) => r.id !== id));
          toast.success("Review deleted successfully.");
        } else {
          toast.error("Failed to delete the review.");
        }
      })
      .catch((err) => {
        toast.error("Error deleting review:", err);
        toast.error("An error occurred while deleting the review.");
      });
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="review-management">
      <h2>Review Management</h2>
      <p>Manage all user reviews in the system.</p>

      <div className="table-wrapper">
        <table className="review-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Review Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.name}</td>
                  <td>{review.email}</td>
                  <td>{review.comment}</td>
                  <td>{review.rating}</td>
                  <td>{review.review_date}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No reviews available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       <div className="pagination-controls">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
