import { useState } from "react";

function Expenditure() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const expenditures = [
    {
      id: "EXP-1001",
      date: "2026-09-28",
      base: "Base Alpha",
      equipment: "5.56mm Ammunition",
      quantity: 120,
      reason: "Training Exercise",
      reference: "TRN-2026-091",
      status: "Approved",
    },
    {
      id: "EXP-1002",
      date: "2026-09-27",
      base: "Base Bravo",
      equipment: "Medical Supplies",
      quantity: 25,
      reason: "Operational Use",
      reference: "OPS-2026-087",
      status: "Approved",
    },
    {
      id: "EXP-1003",
      date: "2026-09-25",
      base: "Base Alpha",
      equipment: "Radio Battery",
      quantity: 8,
      reason: "Damaged",
      reference: "DMG-2026-021",
      status: "Approved",
    },
    {
      id: "EXP-1004",
      date: "2026-09-23",
      base: "Base Charlie",
      equipment: "Field Equipment",
      quantity: 3,
      reason: "Lost",
      reference: "LST-2026-014",
      status: "Pending",
    },
    {
      id: "EXP-1005",
      date: "2026-09-20",
      base: "Base Bravo",
      equipment: "5.56mm Ammunition",
      quantity: 80,
      reason: "Training Exercise",
      reference: "TRN-2026-084",
      status: "Approved",
    },
  ];

  const openDetails = (record) => {
    setSelectedRecord(record);
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-box-arrow-down me-2"></i>
            Expenditure
          </h3>

          <p className="text-secondary mb-0">
            Track assets consumed, damaged, lost, or removed from inventory.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Record Expenditure
        </button>

      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-secondary">
                    Total Expended
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">
                    236
                  </h3>
                </div>

                <div className="text-danger fs-3">
                  <i className="bi bi-box-arrow-down"></i>
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
                    Operational Use
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">
                    168
                  </h3>
                </div>

                <div className="text-primary fs-3">
                  <i className="bi bi-activity"></i>
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
                    Damaged / Lost
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">
                    31
                  </h3>
                </div>

                <div className="text-warning fs-3">
                  <i className="bi bi-exclamation-triangle"></i>
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
                    Pending Approval
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">
                    37
                  </h3>
                </div>

                <div className="text-info fs-3">
                  <i className="bi bi-clock-history"></i>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Important Inventory Rule */}
      <div className="alert alert-warning mb-4">
        <i className="bi bi-exclamation-triangle me-2"></i>

        Recording an approved expenditure reduces the available inventory
        for the selected base and equipment type.
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
                Base
              </label>

              <select className="form-select bg-dark text-light border-secondary">
                <option>All Bases</option>
                <option>Base Alpha</option>
                <option>Base Bravo</option>
                <option>Base Charlie</option>
              </select>

            </div>

            <div className="col-12 col-md-3">

              <label className="form-label text-secondary">
                Reason
              </label>

              <select className="form-select bg-dark text-light border-secondary">
                <option>All Reasons</option>
                <option>Operational Use</option>
                <option>Training Exercise</option>
                <option>Damaged</option>
                <option>Lost</option>
              </select>

            </div>

          </div>

        </div>

      </div>

      {/* Table */}
      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary py-3">

          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="mb-1 fw-semibold">
                Expenditure History
              </h5>

              <small className="text-secondary">
                Assets removed from available inventory
              </small>
            </div>

            <button className="btn btn-outline-light btn-sm">
              <i className="bi bi-download me-2"></i>
              Export
            </button>

          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-dark table-hover align-middle mb-0">

            <thead>
              <tr>
                <th>Expenditure ID</th>
                <th>Date</th>
                <th>Base</th>
                <th>Equipment</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Reference</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>

              {expenditures.map((record) => (

                <tr key={record.id}>

                  <td className="fw-semibold">
                    {record.id}
                  </td>

                  <td>
                    {record.date}
                  </td>

                  <td>
                    {record.base}
                  </td>

                  <td>
                    {record.equipment}
                  </td>

                  <td className="fw-semibold">
                    {record.quantity}
                  </td>

                  <td>
                    {record.reason}
                  </td>

                  <td>
                    {record.reference}
                  </td>

                  <td>

                    {record.status === "Approved" ? (
                      <span className="badge text-bg-success">
                        Approved
                      </span>
                    ) : (
                      <span className="badge text-bg-warning">
                        Pending
                      </span>
                    )}

                  </td>

                  <td className="text-end">

                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => openDetails(record)}
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
              Showing 1–5 of 236 records
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

      {/* Record Expenditure Modal */}
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
                    <i className="bi bi-box-arrow-down me-2"></i>
                    Record Expenditure
                  </h5>

                  <small className="text-secondary">
                    Remove assets from available inventory
                  </small>
                </div>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="alert alert-danger">
                  <i className="bi bi-shield-exclamation me-2"></i>

                  This transaction will reduce the available inventory
                  after approval.
                </div>

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label">
                      Base
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Select Base</option>
                      <option>Base Alpha</option>
                      <option>Base Bravo</option>
                      <option>Base Charlie</option>
                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Equipment Type
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Select Equipment</option>
                      <option>5.56mm Ammunition</option>
                      <option>Medical Supplies</option>
                      <option>Radio Battery</option>
                      <option>Field Equipment</option>
                    </select>

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter quantity"
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Expenditure Date
                    </label>

                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Reason
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Select Reason</option>
                      <option>Operational Use</option>
                      <option>Training Exercise</option>
                      <option>Damaged</option>
                      <option>Lost</option>
                      <option>Expired</option>
                      <option>Other</option>
                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Reference Number
                    </label>

                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter reference number"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Personnel / Unit
                    </label>

                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Optional"
                    />

                  </div>

                  <div className="col-12">

                    <label className="form-label">
                      Remarks
                    </label>

                    <textarea
                      rows="3"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Explain the expenditure..."
                    ></textarea>

                  </div>

                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-danger">
                  <i className="bi bi-check-lg me-2"></i>
                  Submit Expenditure
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Details Modal */}
      {selectedRecord && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content bg-dark text-light border-secondary">

              <div className="modal-header border-secondary">

                <h5 className="modal-title">
                  Expenditure Details
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedRecord(null)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row g-3">

                  <div className="col-6">
                    <small className="text-secondary">
                      Expenditure ID
                    </small>
                    <div className="fw-semibold">
                      {selectedRecord.id}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Date
                    </small>
                    <div>
                      {selectedRecord.date}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Base
                    </small>
                    <div>
                      {selectedRecord.base}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Equipment
                    </small>
                    <div>
                      {selectedRecord.equipment}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Quantity
                    </small>
                    <div className="fw-semibold">
                      {selectedRecord.quantity}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Reason
                    </small>
                    <div>
                      {selectedRecord.reason}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Reference
                    </small>
                    <div>
                      {selectedRecord.reference}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Status
                    </small>
                    <div>
                      <span
                        className={
                          selectedRecord.status === "Approved"
                            ? "badge text-bg-success"
                            : "badge text-bg-warning"
                        }
                      >
                        {selectedRecord.status}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRecord(null)}
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

export default Expenditure;