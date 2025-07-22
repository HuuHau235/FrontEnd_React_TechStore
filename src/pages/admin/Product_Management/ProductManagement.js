import React, { useEffect, useState } from "react";
import "./ProductManagement.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EditProductForm from "../../../pages/admin/Product_Management/EditProduct";
import AddProductForm from "../../../pages/admin/Product_Management/AddProductForm";
import { toast } from "react-toastify";
import { Box, NotebookPen, TriangleAlert, X } from "lucide-react";

const ProductManagement = ({ categoryId = null }) => {
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [stats, setStats] = useState({
    total_stock: 0,
    in_stock_quantity: 0,
    low_stock_quantity: 0,
    out_of_stock_quantity: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/admin/products/stock-statistics");
        if (data.status) setStats(data.data);
        else setStatsError("Failed to load statistics");
      } catch (err) {
        setStatsError(err.message || "Error fetching statistics");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/admin/group-by-category");
        const updatedGroups = data.data.map((group, index) => ({
          ...group,
          category_id: index + 1,
        }));
        setGroupedProducts(updatedGroups);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;
  try {
    await axios.delete(`https://backendlaraveltechstore-production.up.railway.app/api/admin/products/${id}`);
    setGroupedProducts((prev) =>
      prev.map((group) => ({
        ...group,
        products: group.products.filter((p) => p.id !== id),
      }))
    );
    toast.success("Product deleted successfully");
  } catch (err) {
    console.error("Delete failed:", err);
    toast.error("Failed to delete the product");
  }
};


  const openEditForm = (product) => setEditingId(product.id);
  const closeEditForm = () => setEditingId(null);

  const handleProductUpdate = (updatedProduct) => {
    setGroupedProducts((prev) => {
      const currentCategoryId = updatedProduct.category_id;
      const updatedGroups = [...prev];

      for (let group of updatedGroups) {
        const index = group.products.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) {
          group.products.splice(index, 1);
          break;
        }
      }

      const targetGroup = updatedGroups.find((g) => g.category_id === currentCategoryId);
      if (targetGroup) {
        targetGroup.products.push(updatedProduct);
      } else {
        updatedGroups.push({
          category_id: currentCategoryId,
          category: updatedProduct.category_name || "Unknown Category",
          products: [updatedProduct],
        });
      }

      return updatedGroups;
    });
    setEditingId(null);
  };

 const handleProductAdd = (newProduct) => {
  setGroupedProducts((prev) => {
    const updatedGroups = [...prev];
    const targetGroup = updatedGroups.find((g) => g.category_id === newProduct.category_id);

    if (targetGroup) {
      const alreadyExists = targetGroup.products.some((p) => p.id === newProduct.id);
      if (!alreadyExists) {
        targetGroup.products.push(newProduct);
      }
    } else {
      updatedGroups.push({
        category_id: newProduct.category_id,
        category: newProduct.category_name || "Unknown Category",
        products: [newProduct],
      });
    }

    return updatedGroups;
  });
  setIsAdding(false);
};


  if (loading) return <LoadingSpinner />;

const statsDisplay = [
  { title: "Total Products", value: stats.total_stock, icon: <Box size={35}/> },
  { title: "In Stock", value: stats.in_stock_quantity, icon: <NotebookPen size={35}/> },
  { title: "Low Stock", value: stats.low_stock_quantity, icon: <TriangleAlert size={35}/> },
  { title: "Out Of Stock", value: stats.out_of_stock_quantity, icon: <X size={35}/> },
];

  const selectedGroup = groupedProducts.find((g) => Number(g.category_id) === Number(categoryId));
  const selectedCategoryName = categoryId === null ? "All" : selectedGroup ? selectedGroup.category : "Unknown";

  const productsList = (groupedProducts || []).flatMap((g) =>
    (g.products || []).map((p) => ({
      ...p,
      categoryName: g.category,
      category_id: g.category_id,
    }))
  );

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || p.status === statusFilter;
    const matchesCategory = categoryId === null || p.category_id === categoryId;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="product-management">
       <div className="header">
        <h1>Product Management</h1>
      </div>

      <div className="category-section">
        <h2>Category: {selectedCategoryName}</h2>
        <p>Overview of products in {selectedCategoryName}</p>
      </div>

      <div className="stats-grid">
        {statsLoading && <div>Loading statistics...</div>}
        {statsError && <div style={{ color: "red" }}>{statsError}</div>}
        {!statsLoading &&
          !statsError &&
          statsDisplay.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
              </div>
              <div className="stat-icon">{stat.icon}</div>
            </div>
          ))}
      </div>

      <div className="controls">
        <div className="controls-left">
          <div className="search-container-product">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option>All Statuses</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
            </select>
          </div>
        </div>
        <button className="add-product-btn" onClick={() => setIsAdding(true)}>+ Add New Product</button>
      </div>


      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={(product.images && product.images[0]?.image_url) || "/placeholder.svg"}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.categoryName || "N/A"}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.status === "In Stock" ? "in-stock" :
                    product.status === "Low Stock" ? "low-stock" : "out-of-stock"
                    }`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <FaEdit onClick={() => openEditForm(product)} style={{ cursor: "pointer", color: "#2E4258" }} />
                  <FaTrash onClick={() => handleDelete(product.id)} style={{ marginLeft: 10, cursor: "pointer", color: "#DC3545" }} />
                </td>
              </tr>
            ))}
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

      {editingId !== null && (
        <EditProductForm
          id={editingId}
          onCancel={closeEditForm}
          onSave={handleProductUpdate}
        />
      )}

      {isAdding && (
        <AddProductForm
          onCancel={() => setIsAdding(false)}
          onSave={handleProductAdd}
        />
      )}
    </div>
  );
};

export default ProductManagement;
