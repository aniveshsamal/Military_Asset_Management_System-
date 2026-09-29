import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "bi-grid-1x2" },
  { name: "Purchases", path: "/purchases", icon: "bi-cart-plus" },
  { name: "Transfers", path: "/transfers", icon: "bi-arrow-left-right" },
  { name: "Assignments", path: "/assignments", icon: "bi-person-check" },
  { name: "Expenditure", path: "/expenditure", icon: "bi-box-arrow-up-right" },
  { name: "Audit Logs", path: "/audit-logs", icon: "bi-journal-text" },
  { name: "Users", path: "/users", icon: "bi-people" },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={onClose}
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
            {menuItems.map((item) => (
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
          <div className="d-flex align-items-center gap-3 px-2 py-3">
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px" }}
            >
              <i className="bi bi-person-fill text-white"></i>
            </div>

            <div className="flex-grow-1">
              <div className="text-white small fw-semibold">
                Administrator
              </div>
              <small className="text-secondary">
                System Admin
              </small>
            </div>

            <i className="bi bi-three-dots-vertical text-secondary"></i>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary w-100 text-start"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;