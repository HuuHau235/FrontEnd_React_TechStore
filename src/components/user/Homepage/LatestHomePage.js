import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestHomePage = () => {
  const [allCards, setAllCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const navigate = useNavigate();

  const getRandomThree = (cards) => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/blogs/index");
        setAllCards(res.data);
        console.log("Raw response:", res.data);

        setVisibleCards(getRandomThree(res.data));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setVisibleCards((prev) => getRandomThree(allCards));
    }, 5 * 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

 return visibleCards.length === 0 ? null : (
  <div className="last-home-container">
    <div className="cards-container-last-home">
      {visibleCards.map((card) => (
        <div key={card.id} className="card-last-home">
          <img
            src={card.image_url || '/placeholder.svg'}
            alt="Blog"
            className="card-image-last-home"
          />
          <div className="card-meta-last-home">
            <div className="card-meta-detail-last-home">
              <i className="fa-solid fa-user icon-outline-last-home"></i>
              <span className="author-last-home">{card.author?.name}</span>
            </div>
            <div className="card-meta-detail-last-home">
              <i className="fa-solid fa-calendar icon-outline-last-home"></i>
              <span className="date-last-home">{card.publish_date?.slice(0, 10)}</span>
            </div>
          </div>

          <h3 className="card-title-last-home">{card.title}</h3>
          <p className="card-description-last-home">
            {card.content.slice(0, 100)}...
          </p>
          <button
            className="read-more-button-last-home"
            onClick={() => navigate(`/user/blog`)}
          >
            READ MORE{' '}
            <span className="arrow-icon-last-home">
              <ArrowRight color="#FF9000" size={16} />
            </span>
          </button>
        </div>
      ))}
    </div>
  </div>
);

};

export default LatestHomePage;
