import { useState } from "react";

function AuditLogs() {
  const [selectedLog, setSelectedLog] = useState(null);

  const logs = [
    {
      id: "LOG-1001",
      timestamp: "2026-09-29 10:42:18",
      user: "Rajesh Kumar",
      role: "Admin",
      action: "PURCHASE_CREATED",
      entity: "Purchase",
      entityId: "PUR-1024",
      base: "Base Alpha",
      status: "Success",
      details: "Purchased 500 units of 5.56mm Ammunition",
    },
    {
      id: "LOG-1002",
      timestamp: "2026-09-29 10:18:42",
      user: "Vikram Singh",
      role: "Base Commander",
      action: "TRANSFER_CREATED",
      entity: "Transfer",
      entityId: "TRF-0842",
      base: "Base Alpha",
      status: "Success",
      details: "Transferred 20 Radio Sets to Base Bravo",
    },
    {
      id: "LOG-1003",
      timestamp: "2026-09-29 09:55:31",
      user: "Amit Sharma",
      role: "Logistics Officer",
      action: "ASSIGNMENT_CREATED",
      entity: "Assignment",
      entityId: "ASN-1005",
      base: "Base Bravo",
      status: "Success",
      details: "Assigned 1 Radio Set to MIL-16529",
    },
    {
      id: "LOG-1004",
      timestamp: "2026-09-29 09:31:12",
      user: "Vikram Singh",
      role: "Base Commander",
      action: "EXPENDITURE_CREATED",
      entity: "Expenditure",
      entityId: "EXP-1001",
      base: "Base Alpha",
      status: "Success",
      details: "Recorded 120 units for Training Exercise",
    },
    {
      id: "LOG-1005",
      timestamp: "2026-09-29 08:44:09",
      user: "Amit Sharma",
      role: "Logistics Officer",
      action: "LOGIN",
      entity: "User",
      entityId: "USR-004",
      base: "Base Bravo",
      status: "Success",
      details: "User successfully authenticated",
    },
    {
      id: "LOG-1006",
      timestamp: "2026-09-28 18:21:44",
      user: "Unknown",
      role: "-",
      action: "LOGIN_FAILED",
      entity: "User",
      entityId: "-",
      base: "-",
      status: "Failed",
      details: "Invalid credentials",
    },
  ];

  const actionBadge = (action) => {
    if (action.includes("PURCHASE")) {
      return "badge text-bg-primary";
    }

    if (action.includes("TRANSFER")) {
      return "badge text-bg-info";
    }

    if (action.includes("ASSIGNMENT")) {
      return "badge text-bg-success";
    }

    if (action.includes("EXPENDITURE")) {
      return "badge text-bg-danger";
    }

    if (action.includes("LOGIN")) {
      return "badge text-bg-secondary";
    }

    return "badge text-bg-dark";
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-journal-text me-2"></i>
            Audit Logs
          </h3>

          <p className="text-secondary mb-0">
            Track system activity and operational transactions.
          </p>
        </div>

        <button className="btn btn-outline-light">
          <i className="bi bi-download me-2"></i>
          Export Logs
        </button>

      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-secondary">
                    Total Events
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    12,842
                  </h3>
                </div>

                <div className="text-primary fs-3">
                  <i className="bi bi-list-check"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-secondary">
                    Today's Events
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    184
                  </h3>
                </div>

                <div className="text-info fs-3">
                  <i className="bi bi-calendar-day"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-secondary">
                    Successful
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    12,701
                  </h3>
                </div>

                <div className="text-success fs-3">
                  <i className="bi bi-check-circle"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-secondary">
                    Failed Events
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    141
                  </h3>
                </div>

                <div className="text-danger fs-3">
                  <i className="bi bi-x-circle"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="card bg-dark border-secondary mb-4">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-12 col-md-3">

              <label className="form-label text-secondary">
                From Date
              </label>

              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
              />

            </div>

            <div className="col-12 col-md-3">

              <label className="form-label text-secondary">
                To Date
              </label>

              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
              />

            </div>

            <div className="col-12 col-md-3">

              <label className="form-label text-secondary">
                Action
              </label>

              <select className="form-select bg-dark text-light border-secondary">
                <option>All Actions</option>
                <option>Purchase</option>
                <option>Transfer</option>
                <option>Assignment</option>
                <option>Expenditure</option>
                <option>Login</option>
              </select>

            </div>

            <div className="col-12 col-md-3">

              <label className="form-label text-secondary">
                Status
              </label>

              <select className="form-select bg-dark text-light border-secondary">
                <option>All Status</option>
                <option>Success</option>
                <option>Failed</option>
              </select>

            </div>

          </div>

        </div>

      </div>

      {/* Audit Table */}
      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary py-3">

          <div>
            <h5 className="mb-1 fw-semibold">
              Activity History
            </h5>

            <small className="text-secondary">
              Immutable record of system and transaction activity
            </small>
          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-dark table-hover align-middle mb-0">

            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Base</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>

              {logs.map((log) => (

                <tr key={log.id}>

                  <td>
                    <div className="fw-semibold">
                      {log.timestamp.split(" ")[0]}
                    </div>

                    <small className="text-secondary">
                      {log.timestamp.split(" ")[1]}
                    </small>
                  </td>

                  <td>

                    <div className="fw-semibold">
                      {log.user}
                    </div>

                    <small className="text-secondary">
                      {log.role}
                    </small>

                  </td>

                  <td>
                    <span className={actionBadge(log.action)}>
                      {log.action}
                    </span>
                  </td>

                  <td>
                    {log.entity}
                  </td>

                  <td>
                    {log.entityId}
                  </td>

                  <td>
                    {log.base}
                  </td>

                  <td>

                    {log.status === "Success" ? (
                      <span className="badge text-bg-success">
                        Success
                      </span>
                    ) : (
                      <span className="badge text-bg-danger">
                        Failed
                      </span>
                    )}

                  </td>

                  <td className="text-end">

                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => setSelectedLog(log)}
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

        {/* Pagination */}
        <div className="card-footer bg-transparent border-secondary">

          <div className="d-flex justify-content-between align-items-center">

            <small className="text-secondary">
              Showing 1–6 of 12,842 events
            </small>

            <div className="btn-group btn-group-sm">

              <button className="btn btn-outline-secondary">
                Previous
              </button>

              <button className="btn btn-primary">
                1
              </button>

              <button className="btn btn-outline-secondary">
                2
              </button>

              <button className="btn btn-outline-secondary">
                3
              </button>

              <button className="btn btn-outline-secondary">
                Next
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Details Modal */}
      {selectedLog && (
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
                    Audit Event Details
                  </h5>

                  <small className="text-secondary">
                    {selectedLog.id}
                  </small>
                </div>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedLog(null)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row g-3">

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Event ID
                    </small>

                    <div className="fw-semibold">
                      {selectedLog.id}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Timestamp
                    </small>

                    <div>
                      {selectedLog.timestamp}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      User
                    </small>

                    <div>
                      {selectedLog.user}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Role
                    </small>

                    <div>
                      {selectedLog.role}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Action
                    </small>

                    <div className="mt-1">
                      <span className={actionBadge(selectedLog.action)}>
                        {selectedLog.action}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Status
                    </small>

                    <div className="mt-1">
                      {selectedLog.status === "Success" ? (
                        <span className="badge text-bg-success">
                          Success
                        </span>
                      ) : (
                        <span className="badge text-bg-danger">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Entity
                    </small>

                    <div>
                      {selectedLog.entity}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Entity ID
                    </small>

                    <div>
                      {selectedLog.entityId}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary">
                      Base
                    </small>

                    <div>
                      {selectedLog.base}
                    </div>
                  </div>

                  <div className="col-12">

                    <small className="text-secondary">
                      Event Details
                    </small>

                    <div className="border border-secondary rounded p-3 mt-1">
                      {selectedLog.details}
                    </div>

                  </div>

                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedLog(null)}
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

export default AuditLogs;