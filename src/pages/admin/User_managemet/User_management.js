import React, { useEffect, useState } from "react";
import "./UserManagement.css";
import { FaEdit } from "react-icons/fa";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  // const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          setUsers(data.data);
        } else {
          console.error("API returned unexpected format", data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdateUser = () => {
    fetch(`http://localhost:8000/api/admin/update-user/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === editingUser.id ? editingUser : user
            )
          );
          setEditingUser(null);
          alert("Update successful!");
        } else {
          alert("Update failed!");
        }
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("An error occurred while updating.");
      });
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage);
  // const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUsers.includes(u.id));

  // const toggleUserSelection = (userId) => {
  //   setSelectedUsers((prevSelected) =>
  //     prevSelected.includes(userId)
  //       ? prevSelected.filter((id) => id !== userId)
  //       : [...prevSelected, userId]
  //   );
  // };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <p>
        Manage all users in one place. Control access, assign roles, and monitor
        activity across your platform.
      </p>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((u, index) => (
                <tr key={index}>
                  <td>{u.id}</td>
                  <td>{u.username || u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.address}</td>
                  <td>{u.phone || u.phone_number}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => setEditingUser(u)}><FaEdit /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", gap: "8px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {editingUser && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h3>Edit User</h3>
            <label>Username:
              <input
                type="text"
                value={editingUser.name || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
            </label>
            <label>Email:
              <input
                type="email"
                value={editingUser.email || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </label>
            <label>Role:
              <input
                type="text"
                value={editingUser.role || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              />
            </label>
            <label>Address:
              <input
                type="text"
                value={editingUser.address || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, address: e.target.value })
                }
              />
            </label>
            <label>Phone:
              <input
                type="text"
                value={editingUser.phone || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />
            </label>
            <div className="form-actions">
              <button onClick={handleUpdateUser}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
