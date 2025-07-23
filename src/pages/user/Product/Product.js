// import React, { useEffect, useState } from "react";
// import "./Product.css";
// import ProductSidebar from "../../../components/user/Product/ProductSidebar";
// import { FaShoppingCart, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import AddToWishlist from "../../../components/user/Button/AddToWishlist";
// import LoadingSpinner from "../../../components/common/LoadingSpinner";
// import AddToCart from "../../../components/user/Button/AddToCart";

// const ProductList = ({ searchQuery }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const itemsPerPage = 15;
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Lấy categoryId từ URL (query param)
//   const params = new URLSearchParams(location.search);
//   const categoryId = params.get("categoryId");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         let url = `https://backendlaraveltechstore-production.up.railway.app/api/products/list?page=${currentPage}&per_page=${itemsPerPage}`;
//          if (categoryId) {
//           url += `&category_id=${categoryId}`;
//         } else if (searchQuery) {
//           url += `&q=${searchQuery}`;
//         }
//         const response = await fetch(url);
//         if (!response.ok) throw new Error("Failed to fetch products");

//         const data = await response.json();
//         setProducts(data.data);
//         setTotalPages(data.last_page);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [currentPage, categoryId, searchQuery]);

//   const handleProductClick = (productId) => {
//     navigate(`/user/product-detail/${productId}`);
//   };

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="product-wrapper">
//       <div className="sidebar-section">
//         <ProductSidebar
//           selectedCategoryId={categoryId ? parseInt(categoryId) : null}
//           setSelectedCategoryId={(id) => {
//             setCurrentPage(1);
//             navigate(`/user/product?categoryId=${id}`);
//           }}
//         />
//       </div>

//       <div className="content-section">
//         <div className="product-list max-w-4xl mx-auto p-4">
//           {products.length === 0 ? (
//             <div>No products found.</div>
//           ) : (
//             products.map((product) => (
//               <div key={product.id} className="product-card-product-list border rounded-md shadow-sm p-4 flex items-center mb-4">
//                 {product.promotion_type && <div className="promotion-label-product-list">{product.promotion_type}</div>}
//                 <img
//                   src={product.images?.[0]?.image_url || "https://via.placeholder.com/165"}
//                   alt={product.name}
//                   className="w-24 h-24 object-cover mr-4"
//                   onClick={() => handleProductClick(product.id)}
//                 />
//                 <div className="product-details flex-1">
//                   <h3 className="text-gray-600 text-sm">{product.category}</h3>
//                   <h2 className="text-lg font-semibold">{product.name}</h2>
//                   <p className="text-sm text-gray-500">{product.description}</p>
//                 </div>
//                 <div className="actions">
//                   <div className="actions-container">
//                     <div className="price-wrapper">
//                       <span className="line-through">${product.old_price}</span>
//                       <span className="text-red-500">${product.price}</span>
//                     </div>
//                     <AddToCart product={product} className="bg-red-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-600 transition mb-2">

//                     <AddToCart
//                       product={product} 
//                       quantity={1}
//                       className="bg-red-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-600 transition mb-2"
//                     >
//                       <FaShoppingCart /> ADD TO CART
//                     </AddToCart>
//                     <AddToWishlist item={product} className="text-gray-500 flex items-center justify-center gap-2 hover:text-red-500 transition">
                    
//                     <AddToWishlist
//                       className="text-gray-500 flex items-center justify-center gap-2 hover:text-red-500 transition"
//                       item={product}
//                     >
//                       <FaHeart /> Wishlist
//                     </AddToWishlist>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="pagination">
//           <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//             <FaChevronLeft />
//           </button>
//           {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//             <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? "active" : ""}>
//               {page}
//             </button>
//           ))}
//           <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//             <FaChevronRight />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;

import React, { useEffect, useState } from "react";
import "./Product.css";
import ProductSidebar from "../../../components/user/Product/ProductSidebar";
import { FaShoppingCart, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import AddToWishlist from "../../../components/user/Button/AddToWishlist";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import AddToCart from "../../../components/user/Button/AddToCart";

const ProductList = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 15;
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lấy categoryId từ URL (query param)
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("categoryId");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `https://backend-laravel-techstore-4.onrender.com/api/products/list?page=${currentPage}&per_page=${itemsPerPage}`;
         if (categoryId) {
          url += `&category_id=${categoryId}`;
        } else if (searchQuery) {
          url += `&q=${searchQuery}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.data);
        setTotalPages(data.last_page);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, categoryId, searchQuery]);

  const handleProductClick = (productId) => {
    navigate(`/user/product-detail/${productId}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-wrapper">
      <div className="sidebar-section">
        <ProductSidebar
          selectedCategoryId={categoryId ? parseInt(categoryId) : null}
          setSelectedCategoryId={(id) => {
            setCurrentPage(1);
            navigate(`/user/product?categoryId=${id}`);
          }}
        />
      </div>

      <div className="content-section">
        <div className="product-list max-w-4xl mx-auto p-4">
          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card-product-list border rounded-md shadow-sm p-4 flex items-center mb-4">
                {product.promotion_type && <div className="promotion-label-product-list">{product.promotion_type}</div>}
                <img
                  src={product.images?.[0]?.image_url || "https://via.placeholder.com/165"}
                  alt={product.name}
                  className="w-24 h-24 object-cover mr-4"
                  onClick={() => handleProductClick(product.id)}
                />
                <div className="product-details flex-1">
                  <h3 className="text-gray-600 text-sm">{product.category}</h3>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
                <div className="actions">
                  <div className="actions-container">
                    <div className="price-wrapper">
                      <span className="line-through">${product.old_price}</span>
                      <span className="text-red-500">${product.price}</span>
                    </div>
                    <AddToCart product={product} className="bg-red-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-600 transition mb-2">
                      <FaShoppingCart /> ADD TO CART
                    </AddToCart>
                    <AddToWishlist item={product} className="text-gray-500 flex items-center justify-center gap-2 hover:text-red-500 transition">
                      <FaHeart /> Wishlist
                    </AddToWishlist>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? "active" : ""}>
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
