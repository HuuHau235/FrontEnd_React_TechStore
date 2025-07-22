import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../../pages/user/Product/Product.css";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_BE_URL;

const ReviewsTab = () => {
  const { id: productId } = useParams(); 
  const [ reviews, setReviews ] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/reviews/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Reviews API response:", res.data); 
        setReviews(res.data.data);
      } catch (error) {
        toast.error("Unable to load product reviews.");
        console.error("An error occurred while retrieving reviews:", error);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">🗨️ Customer Reviews</h3>

      <div className="reviews-scrollable">
        {reviews.length === 0 ? (
          <p>No customer reviews available.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-avatar">{getInitials(review.user?.name || "U")}</div>
              <div className="review-content">
                <div className="review-header">
                  <strong>{review.user?.name || "User"}</strong>
                  <span className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`star ${i < review.rating ? "filled" : ""}`}>★</span>
                    ))}
                  </span>
                  <span className="review-date">
                    {new Date(review.review_date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p>{review.comment}</p>
                {review.image_url && (
                  <img src={review.image_url} alt="Review" className="review-image" style={{width: '80px', height: '80px'}} />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;

