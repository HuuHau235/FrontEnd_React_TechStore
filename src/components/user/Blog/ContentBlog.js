import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowRight, ArrowLeft } from "lucide-react";

const ContentBlog = ({ selectedCategoryId, onSearchResult }) => {
  const [cards, setCards] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const cardsPerPage = 9;

  const location = useLocation();
  const searchQueryFromBar = location.state?.searchQuery || "";

  useEffect(() => {
    setSearchItem(searchQueryFromBar);
  }, [searchQueryFromBar]);

  useEffect(() => {
    axios
      .get("https://backend-laravel-techstore-4.onrender.com/api/user/blogs/index")
    
      .then((res) => {
        setCards(res.data);
        setIsDataFetched(true);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchItem.toLowerCase()) ||
      card.content.toLowerCase().includes(searchItem.toLowerCase());

    const matchesCategory =
      selectedCategoryId === null || card.category_id === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (isDataFetched && typeof onSearchResult === "function") {
      onSearchResult(filteredCards.length > 0);
    }
  }, [filteredCards, onSearchResult, isDataFetched, searchItem, selectedCategoryId]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchItem(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="blog-container">
      <div className="search-container-blog">
        <input
          type="text"
          placeholder="Search..."
          className="search-input-blog"
          onChange={handleSearchChange}
          value={searchItem}
        />
        <i className="fa-solid fa-magnifying-glass search-icon-blog"></i>
      </div>

      <div className="cards-container-blog">
        {filteredCards.length === 0 ? (
          <p className="no-results-message">No matching articles found</p>
        ) : (
         currentCards
  .filter((card) => card.author) 
  .map((card) => (
    <div
      key={card.id}
      className={`card-blog ${card.isActive ? "active-card" : ""}`}
    >
      <img
        src={card.image_url || "/placeholder.svg"}
        alt="Blog"
        className="card-image-blog"
      />
      <div className="card-meta-blog">
        <div className="card-meta-detail">
          <i className="fa-solid fa-user icon-outline"></i>
          <span className="author">{card.author?.name}</span>
        </div>
        <div className="card-meta-detail">
          <i className="fa-solid fa-calendar icon-outline"></i>
          <span className="date">{card.publish_date?.slice(0, 10)}</span>
        </div>
      </div>

      <h3 className={`card-title-blog ${expandedCardId === card.id ? "expanded" : ""}`}>
        {card.title}
      </h3>
      <p className={`card-description-blog ${expandedCardId === card.id ? "expanded" : ""}`}>
        {card.content}
      </p>
      <button
        className="read-more-button"
        onClick={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
      >
        {expandedCardId === card.id ? "SHOW LESS" : "READ MORE"}{" "}
        <span className="arrow-icon">
          <ArrowRight color="#FF9000" size={16} />
        </span>
      </button>
    </div>
  ))

        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-blog">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          >
            <ArrowLeft className="arrow-icon" size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = (i + 1).toString().padStart(2, "0");
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(i + 1)}
                className={`pagination-button ${
                  currentPage === i + 1 ? "active-page" : ""
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="pagination-button"
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          >
            <ArrowRight className="arrow-icon" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentBlog;
