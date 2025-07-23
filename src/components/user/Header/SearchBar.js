import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../pages/user/Header/Header.css";
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const trimmed = searchQuery.trim();
    if (trimmed === "") return;

    try {
      const res = await axios.get("https://backend-laravel-techstore-4.onrender.com/api/products/list");
      const products = res.data?.data || []; 

      const keyword = trimmed.toLowerCase();
      
      const productMatch = products.find(
        (p) =>
          p.name?.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword)
      );

      if (productMatch) {
        console.log("✅ Find products:", productMatch);
        return navigate("/user/Product", {
          state: { searchQuery: trimmed },
        });
      }

      alert("No matching products found.");
    } catch (error) {
      console.error("❌ Error while searching for product:", error);
      alert("An error occurred while searching for the product.");
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="search-container">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <button type="submit" className="search-button">
        <Search size={18} />
      </button>
    </form>
  );
}

export default SearchBar;
