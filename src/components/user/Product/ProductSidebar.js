// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../../../components/user/Product/ProductSidebar.css";

// const ProductSidebar = ({ selectedCategoryId, setSelectedCategoryId }) => {
//   const [categories, setCategories] = useState([]);
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const fetchTopProducts = async () => {
//     try {
//       const response = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/products/top-five");
//       setProducts(response.data);
//     } catch (err) {
//       console.error("Error fetching top products:", err);
//     }
//   };
// const fetchGalleryImages = async () => {
//   try {
//     const response = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/products/top-images");
//     console.log("Products data:", response.data); 

//     const images = response.data.map(item => item.image_url);

//     setGalleryImages(images.slice(0, 12));
//   } catch (err) {
//     console.error("Error fetching gallery images:", err);
//   }
// };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/products/all-categories");
//       setCategories(response.data);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/products/all-categories");
//         setCategories(response.data);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       }
//     };

//     const fetchTopProducts = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/products/top-five");
//         setProducts(response.data);
//       } catch (err) {
//         console.error("Error fetching top products:", err);
//       }
//     };

//     const fetchGalleryImages = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/products/top-images");
//         const images = response.data.map(item => item.image_url);
//         setGalleryImages(images.slice(0, 12));
//       } catch (err) {
//         console.error("Error fetching gallery images:", err);
//       }
//     };

//     fetchCategories();
//     fetchTopProducts();
//     fetchGalleryImages();
//   }, []);


//   const handleCategoryClick = async (categoryId) => {
//     setSelectedCategoryId(categoryId);

//     try {
//       const response = await axios.get(
//         categoryId
//           ? `https://backendlaraveltechstore-production.up.railway.app/api/products/top-five?category_id=${categoryId}`
//           : "https://backendlaraveltechstore-production.up.railway.app/api/products/top-five"
//       );
//       setProducts(response.data);
//     } catch (err) {
//       console.error("Error fetching products by category:", err);
//     }
//     const params = new URLSearchParams();
// if (categoryId) {
//   params.set("categoryId", categoryId);
// }
// navigate(`/user/product?${params.toString()}`);
//   };

//   return (
//     <div className="mobile-interface">
//       <div className="section">
//         <h2 className="section-title">CATEGORIES</h2>
//         <ul className="category-list">
//           <li className="category-item-slidebar">
//             <label className="category-label">
//               <input
//                 type="radio"
//                 name="category"
//                 className="radio-category-list"
//                 checked={selectedCategoryId === null}
//                 onChange={() => handleCategoryClick(null)}
//               />
//               <span>All</span>
//             </label>
//           </li>
//           {categories.map((category) => (
//             <li key={category.id} className="category-item-slidebar">
//               <label className="category-label">
//                 <input
//                   type="radio"
//                   name="category"
//                   className="radio-category-list"
//                   checked={parseInt(selectedCategoryId) === category.id}
//                   onChange={() => handleCategoryClick(category.id)}
//                 />
//                 <span>{category.name}</span>
//               </label>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="section">
//         <h2 className="section-title">BEST DEALS</h2>
//         <div className="product-list">
//           {products.map((product) => (
//             <div key={product.id} className="product-item">
//               <img
//                 src={product.images?.[0]?.image_url || "https://via.placeholder.com/150"}
//                 alt={product.name}
//                 className="product-image"
//               />
//               <div className="product-content">
//                 <p className="product-name">{product.name}</p>
//                 <p className="product-price">{product.price}$</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="section">
//         <h2 className="section-title">GALLERIES</h2>
//         <div className="gallery-grid">
//           {galleryImages.map((url, index) => (
//             <div key={index} className="gallery-item">
//               <img src={url} alt="Gallery" className="gallery-image" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductSidebar;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../components/user/Product/ProductSidebar.css";

const ProductSidebar = ({ selectedCategoryId, setSelectedCategoryId }) => {
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTopProducts = async () => {
    try {
      const response = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/products/top-five");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching top products:", err);
    }
  };
const fetchGalleryImages = async () => {
  try {
    const response = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/products/top-images");
    console.log("Products data:", response.data); 

    const images = response.data.map(item => item.image_url);

    setGalleryImages(images.slice(0, 12));
  } catch (err) {
    console.error("Error fetching gallery images:", err);
  }
};

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/products/all-categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/all-categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchTopProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/top-five");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching top products:", err);
      }
    };

    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/top-images");
        const images = response.data.map(item => item.image_url);
        setGalleryImages(images.slice(0, 12));
      } catch (err) {
        console.error("Error fetching gallery images:", err);
      }
    };

    fetchCategories();
    fetchTopProducts();
    fetchGalleryImages();
  }, []);


  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);

    try {
      const response = await axios.get(
        categoryId
          ? `https://backendlaraveltechstore-production.up.railway.app/api/products/top-five?category_id=${categoryId}`
          : "https://backendlaraveltechstore-production.up.railway.app/api/products/top-five"
      );
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products by category:", err);
    }
    const params = new URLSearchParams();
if (categoryId) {
  params.set("categoryId", categoryId);
}
navigate(`/user/product?${params.toString()}`);
  };

  return (
    <div className="mobile-interface">
      <div className="section">
        <h2 className="section-title">CATEGORIES</h2>
        <ul className="category-list">
          <li className="category-item-slidebar">
            <label className="category-label">
              <input
                type="radio"
                name="category"
                className="radio-category-list"
                checked={selectedCategoryId === null}
                onChange={() => handleCategoryClick(null)}
              />
              <span>All</span>
            </label>
          </li>
          {categories.map((category) => (
            <li key={category.id} className="category-item-slidebar">
              <label className="category-label">
                <input
                  type="radio"
                  name="category"
                  className="radio-category-list"
                  checked={parseInt(selectedCategoryId) === category.id}
                  onChange={() => handleCategoryClick(category.id)}
                />
                <span>{category.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">BEST DEALS</h2>
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img
                src={product.images?.[0]?.image_url || "https://via.placeholder.com/150"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-content">
                <p className="product-name">{product.name}</p>
                <p className="product-price">{product.price}$</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">GALLERIES</h2>
        <div className="gallery-grid">
          {galleryImages.map((url, index) => (
            <div key={index} className="gallery-item">
              <img src={url} alt="Gallery" className="gallery-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSidebar;
