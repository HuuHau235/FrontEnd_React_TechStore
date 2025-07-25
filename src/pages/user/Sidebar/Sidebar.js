import React from "react";
import { Link } from "react-router-dom";
import { User, FileText } from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ username, email, avatar, activeMenu }) => {
  return (
    <div className="profile-sidebar">
      <div className="profile-info">
        <img
          src={avatar || "https://via.placeholder.com/150"} 
          alt="User Avatar"
          className="avatar"
        />
        <div>
          <h2>{username}</h2>
          <p>{email}</p>
        </div>
      </div>
      <ul className="menu">
        <li className={`menu-item ${activeMenu === "profile" ? "active" : ""}`}>
          <Link to="/user/profile" className="menu-link">
            <User className="menu-icon" />
            My Profile
          </Link>
        </li>
        <li className={`menu-item ${activeMenu === "history" ? "active" : ""}`}>
          <Link to="/user/history" className="menu-link">
            <FileText className="menu-icon" />
            My Orders
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
