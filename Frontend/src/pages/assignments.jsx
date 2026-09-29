import { useState } from "react";

function Assignments() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const assignments = [
    {
      id: "ASN-1001",
      date: "2026-09-28",
      personnel: "Rahul Sharma",
      serviceNo: "MIL-20451",
      base: "Base Alpha",
      equipment: "5.56mm Rifle",
      quantity: 1,
      status: "Active",
    },
    {
      id: "ASN-1002",
      date: "2026-09-27",
      personnel: "Amit Kumar",
      serviceNo: "MIL-19872",
      base: "Base Bravo",
      equipment: "Radio Set",
      quantity: 2,
      status: "Active",
    },
    {
      id: "ASN-1003",
      date: "2026-09-25",
      personnel: "Vikram Singh",
      serviceNo: "MIL-18742",
      base: "Base Alpha",
      equipment: "Night Vision Device",
      quantity: 1,
      status: "Active",
    },
    {
      id: "ASN-1004",
      date: "2026-09-22",
      personnel: "Arjun Das",
      serviceNo: "MIL-17631",
      base: "Base Charlie",
      equipment: "Field Laptop",
      quantity: 1,
      status: "Returned",
    },
    {
      id: "ASN-1005",
      date: "2026-09-20",
      personnel: "Rohit Verma",
      serviceNo: "MIL-16529",
      base: "Base Bravo",
      equipment: "Radio Set",
      quantity: 1,
      status: "Active",
    },
  ];

  const openDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  return (
    <div className="container-fluid py-4">

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-person-check me-2"></i>
            Assignments
          </h3>

          <p className="text-secondary mb-0">
            Manage equipment assigned to personnel across bases.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Assign Asset
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
                    Total Assignments
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">248</h3>
                </div>

                <div className="text-primary fs-3">
                  <i className="bi bi-person-check"></i>
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
                    Active Assignments
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">214</h3>
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
                    Returned
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">34</h3>
                </div>

                <div className="text-warning fs-3">
                  <i className="bi bi-arrow-return-left"></i>
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
                    Personnel
                  </small>
                  <h3 className="fw-bold mt-2 mb-0">192</h3>
                </div>

                <div className="text-info fs-3">
                  <i className="bi bi-people"></i>
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
                Status
              </label>

              <select className="form-select bg-dark text-light border-secondary">
                <option>All Status</option>
                <option>Active</option>
                <option>Returned</option>
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Assignment Table */}
      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 fw-semibold">
                Current Assignments
              </h5>

              <small className="text-secondary">
                Equipment currently assigned to personnel
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
                <th>Assignment ID</th>
                <th>Date</th>
                <th>Personnel</th>
                <th>Base</th>
                <th>Equipment</th>
                <th>Qty</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>

              {assignments.map((assignment) => (

                <tr key={assignment.id}>

                  <td className="fw-semibold">
                    {assignment.id}
                  </td>

                  <td>
                    {assignment.date}
                  </td>

                  <td>
                    <div className="fw-semibold">
                      {assignment.personnel}
                    </div>

                    <small className="text-secondary">
                      {assignment.serviceNo}
                    </small>
                  </td>

                  <td>
                    {assignment.base}
                  </td>

                  <td>
                    {assignment.equipment}
                  </td>

                  <td>
                    {assignment.quantity}
                  </td>

                  <td>

                    {assignment.status === "Active" ? (
                      <span className="badge text-bg-success">
                        Active
                      </span>
                    ) : (
                      <span className="badge text-bg-secondary">
                        Returned
                      </span>
                    )}

                  </td>

                  <td className="text-end">

                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => openDetails(assignment)}
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
              Showing 1–5 of 248 assignments
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

      {/* Assign Asset Modal */}
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
                    <i className="bi bi-person-check me-2"></i>
                    Assign Asset
                  </h5>

                  <small className="text-secondary">
                    Issue equipment to personnel
                  </small>
                </div>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Assignment does not mean the asset is expended.
                  The asset remains part of the assigned inventory.
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
                      Personnel
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Select Personnel</option>
                      <option>Rahul Sharma</option>
                      <option>Amit Kumar</option>
                      <option>Vikram Singh</option>
                      <option>Arjun Das</option>
                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Service Number
                    </label>

                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="MIL-XXXXX"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Equipment Type
                    </label>

                    <select className="form-select bg-dark text-light border-secondary">
                      <option>Select Equipment</option>
                      <option>5.56mm Rifle</option>
                      <option>Radio Set</option>
                      <option>Night Vision Device</option>
                      <option>Field Laptop</option>
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
                      placeholder="1"
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Assignment Date
                    </label>

                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Reference Number
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
                      placeholder="Additional remarks..."
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

                <button className="btn btn-primary">
                  <i className="bi bi-check-lg me-2"></i>
                  Assign Asset
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Details Modal */}
      {selectedAssignment && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content bg-dark text-light border-secondary">

              <div className="modal-header border-secondary">

                <h5 className="modal-title">
                  Assignment Details
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedAssignment(null)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row g-3">

                  <div className="col-6">
                    <small className="text-secondary">
                      Assignment ID
                    </small>
                    <div className="fw-semibold">
                      {selectedAssignment.id}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Date
                    </small>
                    <div>
                      {selectedAssignment.date}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Personnel
                    </small>
                    <div>
                      {selectedAssignment.personnel}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Service Number
                    </small>
                    <div>
                      {selectedAssignment.serviceNo}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Base
                    </small>
                    <div>
                      {selectedAssignment.base}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Equipment
                    </small>
                    <div>
                      {selectedAssignment.equipment}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Quantity
                    </small>
                    <div>
                      {selectedAssignment.quantity}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Status
                    </small>
                    <div>
                      <span className="badge text-bg-success">
                        {selectedAssignment.status}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedAssignment(null)}
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

export default Assignments;