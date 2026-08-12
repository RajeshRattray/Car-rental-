import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllUsers, toggleUserStatus } from "../../utils/api";
import { format } from "date-fns";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleUserStatus(id);
      toast.success(data.message);
      fetchUsers();
    } catch { toast.error("Failed to update user"); }
  };

  return (
    <div>
      <span className="section-label">Admin</span>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", marginBottom: "2rem" }}>Manage Users</h1>

      {loading ? <div className="loading"><div className="spinner" /></div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text3)" }}>No users found</td></tr>
              )}
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--gold)", fontSize: "0.9rem" }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text2)" }}>{u.email}</td>
                  <td style={{ color: "var(--text2)" }}>{u.phone || "—"}</td>
                  <td style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{format(new Date(u.createdAt), "MMM d, yyyy")}</td>
                  <td>
                    <span className={`car-card-badge ${u.isActive ? "badge-available" : "badge-unavailable"}`}>
                      {u.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td>
                    <button className={`btn btn-sm ${u.isActive ? "btn-danger" : "btn-success"}`} onClick={() => handleToggle(u._id)}>
                      {u.isActive ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
