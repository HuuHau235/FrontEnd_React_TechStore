import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Product.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


axios.defaults.withCredentials = true;

const AddProductForm = ({ onCancel, onSave }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    old_price: "",
    promotion_type: "",
    description: "",
    category_id: "",
    stock: "",
    image_url: "",
  });

  const [categories, setCategories] = useState([]);
  const [promotionTypes, setPromotionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const getStatusFromStock = (stock) => {
    const s = Number(stock);
    if (s <= 0) return "Out of Stock";
    if (s < 10) return "Low Stock";
    return "In Stock";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, promoRes] = await Promise.all([
          axios.get("https://backend-laravel-techstore-4.onrender.com/api/admin/categories"),
          axios.get("https://backend-laravel-techstore-4.onrender.com/api/admin/promotion-types"),
        ]);
        setCategories(categoryRes.data.data || []);
        setPromotionTypes(promoRes.data.data || []);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load categories or promotion types");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.category_id) return toast.error("Please select a category.");

    setSaving(true);
    try {
      const dataToSend = {
        ...product,
        price: parseFloat(product.price),
        old_price: parseFloat(product.old_price || 0),
        stock: Number(product.stock),
        category_id: Number(product.category_id),
        status: getStatusFromStock(product.stock),
      };

      console.log("📦 Sending to API:", dataToSend);

      const res = await axios.post(
        "https://backend-laravel-techstore-4.onrender.com/api/admin/create/products",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const createdProduct = {
        ...res.data.data,
        images: [{ image_url: product.image_url }],
        category_name:
          categories.find((c) => c.id === Number(product.category_id))?.name || "Unknown",
      };

      toast.success("Product created successfully!");
      onSave(createdProduct);
      onCancel();
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
       toast.error(err.response?.data?.message || "❌ Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="edit-product-overlay">
      <div className="edit-product-modal">
        <form onSubmit={handleSubmit} className="edit-product-form">
          <div className="close-icon" onClick={onCancel}>
            <FaTimes />
          </div>
          <h2 className="title-form">Add New Product</h2>

          <label>
            <span>Product Name</span>
            <input name="name" value={product.name} onChange={handleChange} required />
          </label>

          <label>
            <span>Price</span>
            <input name="price" type="number" step="0.1" min ="0" value={product.price} onChange={handleChange} required />
          </label>

          <label>
            <span>Old Price</span>
            <input name="old_price" type="number" step="0.1" min ="0" value={product.old_price} onChange={handleChange} />
          </label>

          <label>
            <span>Promotion Type</span>
            <select name="promotion_type" value={product.promotion_type} onChange={handleChange}>
              <option value="">Select Promotion Type</option>
              {promotionTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Description</span>
            <textarea name="description" value={product.description} onChange={handleChange} rows={3} />
          </label>

          <label>
            <span>Category</span>
            <select name="category_id" value={product.category_id} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              console.log("Categories:", categories);
            </select>
          </label>

          <label>
            <span>Stock</span>
            <input name="stock" type="number" value={product.stock} onChange={handleChange} required />
          </label>

          <label>
            <span>Status</span>
            <input name="status" value={getStatusFromStock(product.stock)} readOnly disabled />
          </label>

          <label>
            <span>Image URL</span>
            <input name="image_url" value={product.image_url} onChange={handleChange} />
          </label>

          {product.image_url && (
            <div className="image-preview">
              <img
                src={product.image_url}
                alt="Product"
                width="120"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.svg";
                }}
              />
            </div>
          )}

          <div className="btn-button">
            <button type="submit" className="save-btn-form" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="cancel-btn-form" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
