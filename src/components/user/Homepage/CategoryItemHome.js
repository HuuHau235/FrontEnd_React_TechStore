import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryItemHome = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
         const response = await axios.get("https://backend-laravel-techstore-4.onrender.com/api/user/product/categories");
        setCategories(response.data.data);

      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/user/product?categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`);
  };

 return (
  <>
    {categories.length > 0 && (
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id, category.name)}
          >
            <div className="category-icon">
              <img src={category.image_url} alt={category.name} className="category-image" />
            </div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    )}
  </>
);
};

export default CategoryItemHome;