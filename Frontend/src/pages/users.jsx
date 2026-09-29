import { useState } from "react";

function Users() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: "USR-001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@milasset.local",
      role: "Admin",
      base: "All Bases",
      status: "Active",
      lastLogin: "2026-09-29 10:42",
    },
    {
      id: "USR-002",
      name: "Vikram Singh",
      email: "vikram.singh@milasset.local",
      role: "Base Commander",
      base: "Base Alpha",
      status: "Active",
      lastLogin: "2026-09-29 10:18",
    },
    {
      id: "USR-003",
      name: "Amit Sharma",
      email: "amit.sharma@milasset.local",
      role: "Logistics Officer",
      base: "Base Bravo",
      status: "Active",
      lastLogin: "2026-09-29 09:55",
    },
    {
      id: "USR-004",
      name: "Suresh Das",
      email: "suresh.das@milasset.local",
      role: "Base Commander",
      base: "Base Charlie",
      status: "Active",
      lastLogin: "2026-09-28 18:42",
    },
    {
      id: "USR-005",
      name: "Manoj Verma",
      email: "manoj.verma@milasset.local",
      role: "Logistics Officer",
      base: "Base Alpha",
      status: "Inactive",
      lastLogin: "2026-09-24 14:21",
    },
  ];

  const roleBadge = (role) => {
    if (role === "Admin") {
      return "badge text-bg-danger";
    }

    if (role === "Base Commander") {
      return "badge text-bg-primary";
    }

    return "badge text-bg-info";
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-people me-2"></i>
            Users & Access Control
          </h3>

          <p className="text-secondary mb-0">
            Manage users, roles, and base-level access.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-person-plus me-2"></i>
          Add User
        </button>

      </div>

      {/* Role Cards */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-semibold mb-0">
                  Admin
                </h5>

                <i className="bi bi-shield-lock text-danger fs-4"></i>
              </div>

              <p className="text-secondary small mb-3">
                Full system administration and access to all bases.
              </p>

              <span className="badge text-bg-danger">
                Full Access
              </span>

            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-semibold mb-0">
                  Base Commander
                </h5>

                <i className="bi bi-building text-primary fs-4"></i>
              </div>

              <p className="text-secondary small mb-3">
                Manage inventory and operations for the assigned base.
              </p>

              <span className="badge text-bg-primary">
                Base Scoped
              </span>

            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-semibold mb-0">
                  Logistics Officer
                </h5>

                <i className="bi bi-box-seam text-info fs-4"></i>
              </div>

              <p className="text-secondary small mb-3">
                Manage permitted logistics activities such as purchases and transfers.
              </p>

              <span className="badge text-bg-info">
                Limited Access
              </span>

            </div>
          </div>
        </div>

      </div>

      {/* Permission Matrix */}
      <div className="card bg-dark border-secondary mb-4">

        <div className="card-header bg-transparent border-secondary py-3">
          <h5 className="mb-1 fw-semibold">
            Role Permissions
          </h5>

          <small className="text-secondary">
            Application-level permission model
          </small>
        </div>

        <div className="table-responsive">

          <table className="table table-dark table-hover align-middle mb-0">

            <thead>
              <tr>
                <th>Permission</th>
                <th>Admin</th>
                <th>Base Commander</th>
                <th>Logistics Officer</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>View Dashboard</td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
              </tr>

              <tr>
                <td>Manage Purchases</td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
              </tr>

              <tr>
                <td>Manage Transfers</td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
              </tr>

              <tr>
                <td>Manage Assignments</td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-x-circle-fill text-danger"></i></td>
              </tr>

              <tr>
                <td>Manage Expenditure</td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-x-circle-fill text-danger"></i></td>
              </tr>

              <tr>
                <td>View Audit Logs</td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-x-circle-fill text-danger"></i></td>
              </tr>

              <tr>
                <td>Manage Users</td>
                <td><i className="bi bi-check-circle-fill text-success"></i></td>
                <td><i className="bi bi-x-circle-fill text-danger"></i></td>
                <td><i className="bi bi-x-circle-fill text-danger"></i></td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* Filters */}
      <div className="card bg-dark border-secondary mb-4">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-12 col-md-4">

              <label className="form-label text-secondary">
                Search User
              </label>

              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Name or email"
              />

            </div>

            <div className="col-12 col-md-4">

              <label className="form-label text-secondary">
                Role
              </label>

              <select className="form-select bg-dark text-light border-secondary">
                <option>All Roles</option>
                <option>Admin</option>
                <option>Base Commander</option>
                <option>Logistics Officer</option>
              </select>

            </div>

            <div className="col-12 col-md-4">

              <label className="form-label text-secondary">
                Status
              </label>

              <select className="form-select bg-dark text-light border-secondary">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

          </div>

        </div>

      </div>

      {/* Users Table */}
      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary py-3">

          <div>
            <h5 className="mb-1 fw-semibold">
              System Users
            </h5>

            <small className="text-secondary">
              User accounts and assigned access scope
            </small>
          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-dark table-hover align-middle mb-0">

            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Base</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  <td>

                    <div className="fw-semibold">
                      {user.name}
                    </div>

                    <small className="text-secondary">
                      {user.email}
                    </small>

                  </td>

                  <td>
                    <span className={roleBadge(user.role)}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.base}
                  </td>

                  <td>

                    {user.status === "Active" ? (
                      <span className="badge text-bg-success">
                        Active
                      </span>
                    ) : (
                      <span className="badge text-bg-secondary">
                        Inactive
                      </span>
                    )}

                  </td>

                  <td>
                    {user.lastLogin}
                  </td>

                  <td className="text-end">

                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => setSelectedUser(user)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Add User Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >

          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content bg-dark text-light border-secondary">

              <div className="modal-header border-secondary">

                <div>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-person-plus me-2"></i>
                    Add User
                  </h5>

                  <small className="text-secondary">
                    Create a new system account
                  </small>
                </div>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter full name"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter email"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Role
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Select Role</option>
                      <option>Admin</option>
                      <option>Base Commander</option>
                      <option>Logistics Officer</option>
                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Assigned Base
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Select Base</option>
                      <option>All Bases</option>
                      <option>Base Alpha</option>
                      <option>Base Bravo</option>
                      <option>Base Charlie</option>
                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Temporary Password
                    </label>

                    <input
                      type="password"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Set temporary password"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Account Status
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>

                  </div>

                </div>

                <div className="alert alert-warning mt-4 mb-0">
                  <i className="bi bi-shield-exclamation me-2"></i>

                  Role and base restrictions must also be enforced by
                  the backend. Frontend controls alone are not security.
                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-primary">
                  <i className="bi bi-person-plus me-2"></i>
                  Create User
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content bg-dark text-light border-secondary">

              <div className="modal-header border-secondary">

                <h5 className="modal-title">
                  User Details
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedUser(null)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row g-3">

                  <div className="col-12">
                    <small className="text-secondary">
                      User ID
                    </small>

                    <div className="fw-semibold">
                      {selectedUser.id}
                    </div>
                  </div>

                  <div className="col-12">
                    <small className="text-secondary">
                      Name
                    </small>

                    <div>
                      {selectedUser.name}
                    </div>
                  </div>

                  <div className="col-12">
                    <small className="text-secondary">
                      Email
                    </small>

                    <div>
                      {selectedUser.email}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Role
                    </small>

                    <div className="mt-1">
                      <span className={roleBadge(selectedUser.role)}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Status
                    </small>

                    <div className="mt-1">
                      <span
                        className={
                          selectedUser.status === "Active"
                            ? "badge text-bg-success"
                            : "badge text-bg-secondary"
                        }
                      >
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <small className="text-secondary">
                      Assigned Base
                    </small>

                    <div>
                      {selectedUser.base}
                    </div>
                  </div>

                  <div className="col-12">
                    <small className="text-secondary">
                      Last Login
                    </small>

                    <div>
                      {selectedUser.lastLogin}
                    </div>
                  </div>

                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Users;