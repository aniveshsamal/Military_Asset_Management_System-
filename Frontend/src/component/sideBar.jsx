import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import apiRequest from "../services/api";
import { getCurrentUser, getRoleLabel, ROLE_ACCESS } from "../services/roleAccess";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "bi-grid-1x2" },
  { name: "Purchases", path: "/purchases", icon: "bi-cart-plus" },
  { name: "Transfers", path: "/transfers", icon: "bi-arrow-left-right" },
  { name: "Assignments", path: "/assignments", icon: "bi-person-check" },
  { name: "Expenditure", path: "/expenditure", icon: "bi-box-arrow-up-right" },
  { name: "Audit Logs", path: "/audit-logs", icon: "bi-journal-text" },
  { name: "Users", path: "/users", icon: "bi-people" },
  { name: "Equipment Types", path: "/equipment-types", icon: "bi-tags" },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const user = getCurrentUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(user);
  const [profileForm, setProfileForm] = useState({ name: user.name || "", email: user.email || "" });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const displayName = user.name || user.email || "User";
  const visibleMenuItems = menuItems.filter((item) =>
    ROLE_ACCESS[user.role]?.includes(item.path)
  );

  const closeSidebar = () => {
    setAccountMenuOpen(false);
    onClose();
  };

  const handleOpenProfile = async () => {
    setAccountMenuOpen(false);
    setProfileOpen(true);
    setProfileEditing(false);
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const currentProfile = await apiRequest("/profile");
      setProfile(currentProfile);
      setProfileForm({ name: currentProfile.name || "", email: currentProfile.email || "" });
    } catch (requestError) {
      setProfileError(requestError.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({ name: profile.name || "", email: profile.email || "" });
    setProfileEditing(false);
    setProfileError("");
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileSaving(true);

    try {
      const updatedProfile = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
        }),
      });
      const updatedUser = {
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
        baseId: updatedProfile.baseId,
      };

      localStorage.setItem("token", updatedProfile.token);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfile((current) => ({ ...current, ...updatedUser }));
      setProfileForm({ name: updatedProfile.name, email: updatedProfile.email });
      setProfileEditing(false);
      setProfileSuccess("Profile updated successfully.");
      window.dispatchEvent(new Event("user-profile-updated"));
    } catch (requestError) {
      setProfileError(requestError.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeSidebar();
    navigate("/", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`position-fixed top-0 start-0 d-flex flex-column bg-dark border-end border-secondary h-100 ${
          isOpen ? "translate-sidebar" : ""
        }`}
        style={{
          width: "260px",
          zIndex: 1050,
          transition: "transform 0.3s ease",
        }}
      >
        {/* Brand */}
        <div className="d-flex align-items-center gap-3 px-4 py-4 border-bottom border-secondary">
          <div
            className="bg-primary rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px", flexShrink: 0 }}
          >
            <i className="bi bi-shield-check fs-4 text-white"></i>
          </div>

          <div>
            <h6 className="text-white fw-bold mb-0">
              Asset Command
            </h6>
            <small className="text-secondary">
              Management System
            </small>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 pt-4">
          <small className="text-secondary fw-semibold px-3">
            WORKSPACE
          </small>

          <nav className="nav flex-column gap-2 mt-3">
            {visibleMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-3 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-secondary"
                  }`
                }
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span className="fw-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-auto p-3 border-top border-secondary">
          <div className="position-relative">
            {accountMenuOpen && (
              <div
                id="sidebar-account-menu"
                className="position-absolute bottom-100 start-0 w-100 bg-dark border border-secondary rounded p-3 mb-2 shadow"
                role="menu"
              >
                <div className="border-bottom border-secondary pb-3 mb-2">
                  <div className="text-white fw-semibold text-break">{displayName}</div>
                  {user.email && <div className="small text-secondary text-break">{user.email}</div>}
                  <span className="badge text-bg-secondary mt-2">{getRoleLabel(user.role)}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-dark w-100 text-start"
                  onClick={handleOpenProfile}
                  role="menuitem"
                >
                  <i className="bi bi-person-vcard me-2" aria-hidden="true"></i>
                  Profile
                </button>
                <button
                  type="button"
                  className="btn btn-dark w-100 text-start"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <i className="bi bi-box-arrow-left me-2" aria-hidden="true"></i>
                  Logout
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn btn-dark d-flex align-items-center gap-3 w-100 text-start px-2 py-3"
              aria-label="Open account menu"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              aria-controls="sidebar-account-menu"
              onClick={() => setAccountMenuOpen((open) => !open)}
            >
              <span
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "38px", height: "38px" }}
              >
                <i className="bi bi-person-fill text-white" aria-hidden="true"></i>
              </span>

              <span className="flex-grow-1 overflow-hidden">
                <span className="text-white small fw-semibold d-block text-truncate">{displayName}</span>
                <span className="text-secondary small d-block">{getRoleLabel(user.role)}</span>
              </span>

              <i className="bi bi-three-dots-vertical text-secondary" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </aside>

      {profileOpen && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-dialog-title"
          style={{ backgroundColor: "rgba(0,0,0,0.72)", zIndex: 1100 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !profileSaving) setProfileOpen(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-secondary">
              <div className="modal-header border-secondary">
                <div>
                  <h5 className="modal-title text-white" id="profile-dialog-title">My Profile</h5>
                  <small className="text-secondary">View and update your account details</small>
                </div>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setProfileOpen(false)} disabled={profileSaving}></button>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="modal-body">
                  {profileError && <div className="alert alert-danger" role="alert">{profileError}</div>}
                  {profileSuccess && <div className="alert alert-success" role="status">{profileSuccess}</div>}
                  {profileLoading ? (
                    <div className="text-center py-4 text-secondary">Loading profile...</div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="profile-name">Full Name</label>
                        <input id="profile-name" className="form-control bg-black text-light border-secondary" value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} maxLength={100} disabled={!profileEditing || profileSaving} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="profile-email">Email</label>
                        <input id="profile-email" type="email" className="form-control bg-black text-light border-secondary" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} maxLength={150} disabled={!profileEditing || profileSaving} required />
                        <small className="text-secondary">Changing your email also updates your sign-in address.</small>
                      </div>
                      <div className="row g-3">
                        <div className="col-6"><small className="text-secondary d-block">Role</small><span>{getRoleLabel(profile.role)}</span></div>
                        <div className="col-6"><small className="text-secondary d-block">Base</small><span>{profile.baseName || (profile.role === "ADMIN" ? "All bases" : "Not assigned")}</span></div>
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setProfileOpen(false)} disabled={profileSaving}>Close</button>
                  {!profileLoading && (profileEditing ? (
                    <>
                      <button type="button" className="btn btn-outline-light" onClick={handleCancelProfileEdit} disabled={profileSaving}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={profileSaving}>{profileSaving ? "Saving..." : "Save Changes"}</button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-primary" onClick={() => { setProfileError(""); setProfileEditing(true); }}>Edit Profile</button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;