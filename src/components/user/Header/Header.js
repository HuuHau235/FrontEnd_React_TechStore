import { NavLink, useNavigate } from "react-router-dom"
import "../../../pages/user/Header/Header.css"
import { useCart } from "../../../context/CartContext"
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import {
  ShoppingCart, Heart, User, ChevronDown, Phone,
  Twitter, Facebook, Youtube, Instagram, MessageCircleHeart,
  CreditCard, House, AlignJustify, Archive, Search,
} from "lucide-react";
import Logout from "../../auth/logout/Logout";

function Header({ onSearch }) {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { cartItems } = useCart();
  const itemCount = cartItems?.length || 0;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/user/product?categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`);
  };
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const fetchWishlistCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userIdRes = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/getUserId", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const userId = userIdRes.data.userId;

      const response = await fetch(`https://backendlaraveltechstore-production.up.railway.app/api/user/wishlist/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Nếu data là mảng
      setWishlistCount(data.length);

      // Nếu data có dạng: { wishlist: [...] }
      // setWishlistCount(data.wishlist.length);

    } catch (error) {
      console.error("Failed to fetch wishlist count:", error);
    }
  };



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/product/categories");
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://backendlaraveltechstore-production.up.railway.appapi/products/top-images");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    fetchWishlistCount();

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  return (
    <header className="store-header">
      <div className="promo-banner">
        <div className="container banner-content">
          <div className="black-friday-label">
            <span className="black-label">Black</span>
            <span className="friday-label">Friday</span>
          </div>
          <div className="promo-text">
            Up to <span className="discount-percentage">59%</span> OFF
          </div>
          <button className="shop-now-btn">SHOP NOW</button>
        </div>
      </div>

      <div className="welcome-bar">
        <div className="container welcome-content">
          <div className="welcome-text">Welcome to TechStore.</div>
          <div className="social-links-icon">
            <span>Follow us:</span>
            <a href="https://x.com/"><Twitter size={18} color="#FFF" /></a>
            <a href="https://www.facebook.com/?locale=vi_VN"><Facebook size={18} color="#FFF" /></a>
            <a href="https://tabler.io/icons/icon/message-circle-heart"><MessageCircleHeart size={18} color="#FFF" /></a>
            <a href="https://creditcard.com.vn/"><CreditCard size={18} color="#FFF" /></a>
            <a href="https://www.youtube.com/?app=desktop&hl=vi"><Youtube size={18} color="#FFF" /></a>
            <a href="https://www.instagram.com/"><Instagram size={18} color="#FFF" /></a>
          </div>
        </div>
      </div>

      <div className="main-nav">
        <div className="container nav-content">
          <div className="logo">
            <img src="/assets/images/logo.png" alt="Logo" style={{ width: "100px", height: "50px" }} />
          </div>
          <div className="search-container">
            <SearchBar
              onResults={(results, query) => {
                setSearchResults(results);
                setSearchQuery(query);
              }}
            />
          </div>

          <div className="nav-icons">
            <a href={isLoggedIn ? "/user/shopping_cart" : "#"} onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = "/signin";
              }
            }} className="icon-link">
              <ShoppingCart size={20} />
              {token && itemCount > 0 && (
                <span className="badge">{itemCount}</span>
              )}
            </a>
            <a href={isLoggedIn ? "/user/wishlist" : "#"} onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = "/signin";
              }
            }} className="icon-link">
              <Heart size={20} />
              <span className="badge">{wishlistCount}</span>
            </a>

            <li className="user-dropdown">
              <a href={isLoggedIn ? "/user/profile" : "/signin"} className="icon-link">
                <User size={20} />
              </a>
              {isLoggedIn && (
                <ul className="dropdown-menu">
                  <li>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      Logout();
                    }}>Logout</a>
                  </li>
                </ul>
              )}
            </li>
          </div>
        </div>
        <div className="category-nav">
          <div className="container category-content">

            <div
              className="category-dropdown"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="dropdown-wrapper">
                <button className="dropdown-btn">
                  All Category <ChevronDown />
                </button>

                <div className={`dropdown-menu horizontal-menu ${isDropdownOpen ? 'active' : ''}`}>
                  {Array.isArray(categories) && categories.map((category) => (
                    <div
                      key={category.id}
                      className="dropdown-item"
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      <img
                        src={category.image_url || "https://via.placeholder.com/50"}
                        alt={category.name}
                        className="category-image"
                      />
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <nav className="main-menus">
              <ul className="menu-items">
                <li className="menu-item-header">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "menu-link-header active" : "menu-link-header"
                    }
                  >
                    <House size={18} /> Homepage
                  </NavLink>
                </li>
                <li className="menu-item-header">
                  <NavLink
                    to="/user/Product"
                    className={({ isActive }) =>
                      isActive ? "menu-link-header active" : "menu-link-header"
                    }
                  >
                    <AlignJustify size={18} /> Product List
                  </NavLink>
                </li>
                <li className="menu-item-header">
                  <NavLink
                    to="/user/blog"
                    className={({ isActive }) =>
                      isActive ? "menu-link-header active" : "menu-link-header"
                    }
                  >
                    <Archive size={18} /> Blog
                  </NavLink>
                </li>
                <li className="menu-item-header">
                  <NavLink
                    to="/user/about_us"
                    className={({ isActive }) =>
                      isActive ? "menu-link-header active" : "menu-link-header"
                    }
                  >
                    <Archive size={18} /> About Us
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="contact-phone">
              <Phone size={18} />
              <span className="phone-number">+1-202-555-0104</span>
            </div>
          </div>
        </div>
        {searchResults.length > 0 && (
          <div className="search-results-container">
            <h3 style={{ marginLeft: "1rem" }}>Search results for: "{searchQuery}"</h3>
            <div className="results-grid">
              {searchResults.map((item) => (
                <div key={item.id} className="result-card">
                  <img src={item.image} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p>{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {searchResults.length > 0 && (
        <div className="search-results-container">
          <h3 style={{ marginLeft: "1rem" }}>
            Search results for: "{searchQuery}"
          </h3>
          <div className="results-grid">
            {searchResults.map((item) => (
              <div key={item.id} className="result-card">
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p>{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )
      }

    </header >
  );
}

export default Header;