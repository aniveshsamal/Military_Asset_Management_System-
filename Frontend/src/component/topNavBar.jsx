import { useEffect, useState } from "react";
import { getCurrentUser, getRoleLabel } from "../services/roleAccess";

function TopNavbar({ onMenuClick }) {
  const [user, setUser] = useState(getCurrentUser);

  useEffect(() => {
    const updateUser = () => setUser(getCurrentUser());
    window.addEventListener("user-profile-updated", updateUser);
    return () => window.removeEventListener("user-profile-updated", updateUser);
  }, []);
  const displayName = user.name || user.email || "User";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const roleLabel = getRoleLabel(user.role);

  return (
    <nav className="navbar bg-dark border-bottom border-secondary px-3 px-md-4 py-3">
      <button
        type="button"
        className="btn btn-outline-secondary d-lg-none"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <i className="bi bi-list fs-5"></i>
      </button>

      <div className="d-flex align-items-center gap-3 ms-auto">
        {/* Profile */}
        <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3">
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px" }}
          >
            <span className="text-white fw-semibold small">{initials}</span>
          </div>

          <div className="d-none d-md-block">
            <div className="text-white small fw-semibold">
              {displayName}
            </div>
            <small className="text-secondary">
              {roleLabel}
            </small>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default TopNavbar;