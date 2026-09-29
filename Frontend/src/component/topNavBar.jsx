import { useLocation } from "react-router-dom";

const pageHeadings = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your asset operations",
  },
  "/purchases": {
    title: "Purchases",
    subtitle: "Record and review asset purchases",
  },
  "/transfers": {
    title: "Transfers",
    subtitle: "Manage inter-base movements",
  },
  "/assignments": {
    title: "Assignments",
    subtitle: "Track personnel assignments",
  },
  "/expenditure": {
    title: "Expenditure",
    subtitle: "Track expended assets",
  },
  "/audit-logs": {
    title: "Audit Logs",
    subtitle: "Review system activity",
  },
  "/users": {
    title: "Users",
    subtitle: "Manage accounts and roles",
  },
};

function TopNavbar({ onMenuClick }) {
  const location = useLocation();
  const heading = pageHeadings[location.pathname] ?? {
    title: "Asset Command",
    subtitle: "Management System",
  };

  return (
    <nav className="navbar bg-dark border-bottom border-secondary px-3 px-md-4 py-3">
      <div className="d-flex align-items-center gap-3">

        <button
          type="button"
          className="btn btn-outline-secondary d-lg-none"
          onClick={onMenuClick}
        >
          <i className="bi bi-list fs-5"></i>
        </button>

        <div>
          <h5 className="text-white fw-semibold mb-0">
            {heading.title}
          </h5>

          <small className="text-secondary d-none d-sm-block">
            {heading.subtitle}
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">

        {/* Base Selector */}
        <div className="d-none d-md-flex align-items-center gap-2">
          <i className="bi bi-geo-alt text-primary"></i>

          <select
            className="form-select form-select-sm bg-black text-light border-secondary"
            style={{ width: "150px" }}
            defaultValue="all"
          >
            <option value="all">All Bases</option>
            <option value="base1">Base Alpha</option>
            <option value="base2">Base Bravo</option>
            <option value="base3">Base Charlie</option>
          </select>
        </div>

        {/* Notifications */}
        <button className="btn btn-dark position-relative">
          <i className="bi bi-bell fs-5 text-secondary"></i>
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "9px" }}
          >
            3
          </span>
        </button>

        {/* Profile */}
        <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3">
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px" }}
          >
            <span className="text-white fw-semibold small">AS</span>
          </div>

          <div className="d-none d-md-block">
            <div className="text-white small fw-semibold">
              Anivesh Samal
            </div>
            <small className="text-secondary">
              Administrator
            </small>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default TopNavbar;