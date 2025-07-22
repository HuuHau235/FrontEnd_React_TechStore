import React, { useEffect, useState } from "react";
import axios from "axios";

const BlogSlideBar = ({ selectedCategoryId, setSelectedCategoryId }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const latestRes = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/blogs/status");
        setBlogPosts(latestRes.data);
        console.log("Latest blog data:", latestRes.data);
        const allBlogRes = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/blogs/index");
        const allImages = allBlogRes.data.filter(blog => blog.image_url);
        const shuffled = [...allImages].sort(() => 0.5 - Math.random());
        setGalleryImages(shuffled.slice(0, 6));
      } catch (err) {
        console.error("Error fetching blog data:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoryRes = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/blogs/categories");
        setCategories(categoryRes.data);
       console.log("Categories fetched:", categoryRes.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchBlogs();
    fetchCategories();
  }, []);

  return (
    <div className="mobile-interface">
      <div className="section">
        <h2 className="section-title">CATEGORIES</h2>
        <ul className="category-list">
          <li className="category-item-blog">
            <label className="category-label">
              <input
                type="radio"
                name="category"
                className="radio-category-list"
                checked={selectedCategoryId === null}
                onChange={() => setSelectedCategoryId(null)}
              />
              <span>All</span>
            </label>
          </li>
          {categories.map((category) => (
            <li key={category.id} className="category-item-blog">
              <label className="category-label">
                <input
                  type="radio"
                  name="category"
                  className="radio-category-list"
                  checked={selectedCategoryId === category.id}
                  onChange={() => setSelectedCategoryId(category.id)}
                />
                <span>{category.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">LATEST BLOG</h2>
        <div className="blog-list">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-item">
              <img src={post.image_url} alt={post.title} className="blog-image" />
              <div className="blog-content">
                <p className="blog-title">{post.title}</p>
                <p className="blog-date">{post.publish_date?.slice(0, 10)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">GALLERY</h2>
        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={image.image_url} alt="Gallery" className="gallery-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSlideBar;
