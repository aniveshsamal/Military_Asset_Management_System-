import { useEffect, useMemo, useState } from "react";
import apiRequest from "../services/api";

const roles = ["ADMIN", "BASE_COMMANDER", "LOGISTICS_OFFICER"];

const roleLabel = (role) => ({
  ADMIN: "Admin",
  BASE_COMMANDER: "Base Commander",
  LOGISTICS_OFFICER: "Logistics Officer",
}[role] || role);

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "",
  baseId: "",
  active: true,
};

function Users() {
  const [users, setUsers] = useState([]);
  const [bases, setBases] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "", active: "" });
  const [form, setForm] = useState(emptyForm);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
        apiRequest("/users"),
        apiRequest("/bases"),
    ]).then(([userData, baseData]) => {
      if (cancelled) return;
      setUsers(Array.isArray(userData) ? userData : []);
      setBases(Array.isArray(baseData) ? baseData : []);
    }).catch((requestError) => {
      if (cancelled) return;
      setError(requestError.message);
      setUsers([]);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [refreshToken]);

  const visibleUsers = useMemo(() => users.filter((user) => {
    const search = filters.search.trim().toLowerCase();
    const matchesSearch = !search
      || user.name?.toLowerCase().includes(search)
      || user.email?.toLowerCase().includes(search);
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = filters.active === ""
      || String(user.active) === filters.active;
    return matchesSearch && matchesRole && matchesStatus;
  }), [users, filters]);

  const roleBadge = (role) => {
    if (role === "ADMIN") return "badge text-bg-danger";
    if (role === "BASE_COMMANDER") return "badge text-bg-primary";
    return "badge text-bg-info";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          base: form.baseId ? { id: Number(form.baseId) } : null,
          active: form.active,
        }),
      });
      setShowModal(false);
      setForm(emptyForm);
      setSuccess("User created successfully.");
      setLoading(true);
      setError("");
      setRefreshToken((current) => current + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const roleCounts = roles.map((role) => ({
    role,
    count: users.filter((user) => user.role === role).length,
  }));

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1"><i className="bi bi-people me-2"></i>Users &amp; Access Control</h3>
          <p className="text-secondary mb-0">Manage user accounts and assigned access scope.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(""); setShowModal(true); }}>
          <i className="bi bi-person-plus me-2"></i>Add User
        </button>
      </div>

      {(error || success) && <div className={`alert ${error ? "alert-danger" : "alert-success"}`} role="alert">{error || success}</div>}

      <div className="row g-3 mb-4">
        {roleCounts.map(({ role, count }) => (
          <div className="col-12 col-md-4" key={role}>
            <div className="card bg-dark border-secondary h-100"><div className="card-body d-flex justify-content-between align-items-center">
              <div><small className="text-secondary">{roleLabel(role)}</small><h3 className="fw-bold mt-2 mb-0 text-white">{count.toLocaleString()}</h3></div>
              <span className={roleBadge(role)}>{count === 1 ? "account" : "accounts"}</span>
            </div></div>
          </div>
        ))}
      </div>

      <div className="card bg-dark border-secondary mb-4"><div className="card-body"><div className="row g-3">
        <div className="col-12 col-md-4"><label className="form-label text-secondary">Search User</label>
          <input type="search" className="form-control bg-dark text-light border-secondary" placeholder="Name or email" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
        </div>
        <div className="col-12 col-md-4"><label className="form-label text-secondary">Role</label>
          <select className="form-select bg-dark text-light border-secondary" value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}>
            <option value="">All Roles</option>{roles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-4"><label className="form-label text-secondary">Status</label>
          <select className="form-select bg-dark text-light border-secondary" value={filters.active} onChange={(event) => setFilters((current) => ({ ...current, active: event.target.value }))}>
            <option value="">All Statuses</option><option value="true">Active</option><option value="false">Inactive</option>
          </select>
        </div>
      </div></div></div>

      <div className="card bg-dark border-secondary">
        <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
          <div><h5 className="mb-1 fw-semibold">System Users</h5><small className="text-secondary">User accounts and assigned access scope</small></div>
          {!loading && <span className="text-secondary small">{visibleUsers.length} users</span>}
        </div>
        <div className="table-responsive"><table className="table table-dark table-hover align-middle mb-0">
          <thead><tr><th>User</th><th>Role</th><th>Base</th><th>Status</th><th className="text-end">Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="text-center py-5">Loading users...</td></tr>
              : visibleUsers.length === 0 ? <tr><td colSpan="5" className="text-center py-5 text-secondary">No users found.</td></tr>
                : visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td><div className="fw-semibold">{user.name}</div><small className="text-secondary">{user.email}</small></td>
                    <td><span className={roleBadge(user.role)}>{roleLabel(user.role)}</span></td>
                    <td>{user.baseName || "All Bases"}</td>
                    <td><span className={`badge ${user.active ? "text-bg-success" : "text-bg-secondary"}`}>{user.active ? "Active" : "Inactive"}</span></td>
                    <td className="text-end"><button className="btn btn-sm btn-outline-light" onClick={() => setSelectedUser(user)}><i className="bi bi-eye me-1"></i>View</button></td>
                  </tr>
                ))}
          </tbody>
        </table></div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered"><div className="modal-content bg-dark text-light border-secondary">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-secondary"><div><h5 className="modal-title">Add User</h5><small className="text-secondary">Create a system account</small></div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} disabled={submitting}></button>
              </div>
              <div className="modal-body"><div className="row g-3">
                <div className="col-md-6"><label className="form-label">Full Name</label><input className="form-control bg-dark text-light border-secondary" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></div>
                <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control bg-dark text-light border-secondary" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required /></div>
                <div className="col-md-6"><label className="form-label">Role</label>
                  <select className="form-select bg-dark text-light border-secondary" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} required>
                    <option value="">Select role</option>{roles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}
                  </select>
                </div>
                <div className="col-md-6"><label className="form-label">Assigned Base</label>
                  <select className="form-select bg-dark text-light border-secondary" value={form.baseId} onChange={(event) => setForm((current) => ({ ...current, baseId: event.target.value }))}>
                    <option value="">No base assigned</option>{bases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6"><label className="form-label">Temporary Password</label><input type="password" className="form-control bg-dark text-light border-secondary" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required /></div>
                <div className="col-md-6"><label className="form-label">Account Status</label>
                  <select className="form-select bg-dark text-light border-secondary" value={String(form.active)} onChange={(event) => setForm((current) => ({ ...current, active: event.target.value === "true" }))}>
                    <option value="true">Active</option><option value="false">Inactive</option>
                  </select>
                </div>
              </div></div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Creating..." : "Create User"}</button>
              </div>
            </form>
          </div></div>
        </div>
      )}

      {selectedUser && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered"><div className="modal-content bg-dark text-light border-secondary">
            <div className="modal-header border-secondary"><h5 className="modal-title">User Details</h5><button className="btn-close btn-close-white" onClick={() => setSelectedUser(null)}></button></div>
            <div className="modal-body"><dl className="row mb-0">
              <dt className="col-5">User ID</dt><dd className="col-7">{selectedUser.id}</dd>
              <dt className="col-5">Name</dt><dd className="col-7">{selectedUser.name}</dd>
              <dt className="col-5">Email</dt><dd className="col-7">{selectedUser.email}</dd>
              <dt className="col-5">Role</dt><dd className="col-7">{roleLabel(selectedUser.role)}</dd>
              <dt className="col-5">Status</dt><dd className="col-7">{selectedUser.active ? "Active" : "Inactive"}</dd>
              <dt className="col-5">Assigned Base</dt><dd className="col-7">{selectedUser.baseName || "All Bases"}</dd>
            </dl></div>
            <div className="modal-footer border-secondary"><button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button></div>
          </div></div>
        </div>
      )}
    </div>
  );
}

export default Users;
