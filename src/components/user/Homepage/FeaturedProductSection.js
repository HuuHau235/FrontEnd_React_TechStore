import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const FeaturedProductSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/product/promoted");
        const allPromoted = res.data?.data || [];

        const featured = allPromoted
          .filter((product) => product.promotion_type === 'featured product')
          .map((product) => ({
            ...product,
            image: product.images?.[0]?.image_url || 'https://placehold.co/300x200',
            onSale: true,
            rating: product.rating || 0,
            category: product.category?.slug || ''
          }));

        setProducts(featured);
      } catch (error) {
        console.error("❌ Error fetching featured products:", error);
      }
    };
    fetchFeaturedProducts();

    const interval = setInterval(fetchFeaturedProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleBrowseAll = () => {
    navigate('/user/Product');
  };

  const handleProductClick = (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        toast.warning("Please login to view product details!");
        return;
    }

    navigate(`/user/product-detail/${productId}`);
};


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star-featured ${index < Math.round(rating) ? 'filled-featured' : ''}`}>
        ★
      </span>
    ));
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
  <div className="product-showcase-featured">
    <div className="showcase-container-featured">
      <div className="featured-section-featured">
        <div className="main-content-featured">
          {filteredProducts.length > 0 && (
            <>
              <div className="category-tabs-featured">
                <h2 className="featured-title-featured">Featured Products</h2>
                <div className="category-buttons-featured">
                  <button
                    className="category-tab-featured browse-all-btn-featured"
                    onClick={handleBrowseAll}
                  >
                    Browse All Product <ArrowRight className="arrow-icon-featured" size={16} />
                  </button>
                </div>
              </div>

              <div className="products-grid-featured">
                {filteredProducts.slice(0, 10).map((product) => (
                  <div
                    key={product.id}
                    className="product-card-featured"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.status && product.status !== "null" && (
                      <div className="sale-badge-featured">{product.status}</div>
                    )}

                    <div className="product-image-featured">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info-featured">
                      <div className="product-rating-featured">
                        {renderStars(product.rating)}
                      </div>
                      <h3 className="product-name-featured">{product.name}</h3>
                      <div className="product-price-featured">
                        <span className="current-price-featured">${product.price}</span>
                        {product.old_price && (
                          <span className="original-price-featured">${product.old_price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default FeaturedProductSection;
