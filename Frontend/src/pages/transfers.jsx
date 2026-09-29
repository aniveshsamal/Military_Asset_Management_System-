import { useState } from "react";

function Transfers() {
  const [showModal, setShowModal] = useState(false);

  const transfers = [
    {
      id: "TRF-00125",
      date: "29 Sep 2026",
      from: "Base Alpha",
      to: "Base Bravo",
      equipment: "Rifle",
      quantity: 80,
      reference: "TR-2026-0915",
      status: "Completed",
    },
    {
      id: "TRF-00124",
      date: "28 Sep 2026",
      from: "Base Charlie",
      to: "Base Alpha",
      equipment: "Ammunition",
      quantity: 300,
      reference: "TR-2026-0911",
      status: "Completed",
    },
    {
      id: "TRF-00123",
      date: "26 Sep 2026",
      from: "Base Bravo",
      to: "Base Charlie",
      equipment: "Helmet",
      quantity: 100,
      reference: "TR-2026-0903",
      status: "Completed",
    },
    {
      id: "TRF-00122",
      date: "24 Sep 2026",
      from: "Base Alpha",
      to: "Base Charlie",
      equipment: "Rifle",
      quantity: 50,
      reference: "TR-2026-0889",
      status: "Completed",
    },
    {
      id: "TRF-00121",
      date: "22 Sep 2026",
      from: "Base Bravo",
      to: "Base Alpha",
      equipment: "Ammunition",
      quantity: 250,
      reference: "TR-2026-0872",
      status: "Completed",
    },
  ];

  return (
    <div className="container-fluid px-0">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">

        <div>
          <h3 className="text-white fw-bold mb-1">
            Transfers
          </h3>

          <p className="text-secondary mb-0">
            Manage asset movements between military bases.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-arrow-left-right me-2"></i>
          New Transfer
        </button>

      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-secondary small mb-1">
                    Total Transfers
                  </p>

                  <h4 className="text-white fw-bold mb-0">
                    86
                  </h4>
                </div>

                <div className="bg-primary bg-opacity-25 text-primary rounded-3 p-3">
                  <i className="bi bi-arrow-left-right fs-4"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-secondary small mb-1">
                    Transfer In
                  </p>

                  <h4 className="text-success fw-bold mb-0">
                    +480
                  </h4>
                </div>

                <div className="bg-success bg-opacity-25 text-success rounded-3 p-3">
                  <i className="bi bi-arrow-down-left fs-4"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-secondary small mb-1">
                    Transfer Out
                  </p>

                  <h4 className="text-warning fw-bold mb-0">
                    -320
                  </h4>
                </div>

                <div className="bg-warning bg-opacity-25 text-warning rounded-3 p-3">
                  <i className="bi bi-arrow-up-right fs-4"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="card bg-dark border-secondary mb-4">

        <div className="card-header bg-transparent border-secondary">
          <h6 className="text-white mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filters
          </h6>
        </div>

        <div className="card-body">

          <div className="row g-3">

            <div className="col-md-3">
              <label className="form-label text-secondary small">
                From Date
              </label>

              <input
                type="date"
                className="form-control bg-black text-light border-secondary"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-secondary small">
                To Date
              </label>

              <input
                type="date"
                className="form-control bg-black text-light border-secondary"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-secondary small">
                From Base
              </label>

              <select className="form-select bg-black text-light border-secondary">
                <option>All Bases</option>
                <option>Base Alpha</option>
                <option>Base Bravo</option>
                <option>Base Charlie</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label text-secondary small">
                Equipment Type
              </label>

              <select className="form-select bg-black text-light border-secondary">
                <option>All Equipment</option>
                <option>Rifle</option>
                <option>Ammunition</option>
                <option>Helmet</option>
                <option>Vehicle</option>
              </select>
            </div>

          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">

            <button className="btn btn-outline-secondary">
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Reset
            </button>

            <button className="btn btn-primary">
              <i className="bi bi-search me-2"></i>
              Apply Filters
            </button>

          </div>

        </div>
      </div>

      {/* Transfer History */}
      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary py-3">

          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="text-white mb-1">
                Transfer History
              </h5>

              <small className="text-secondary">
                Complete record of asset movements between bases
              </small>
            </div>

            <button className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-download me-2"></i>
              Export
            </button>

          </div>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle mb-0">

              <thead>
                <tr className="text-secondary">

                  <th className="px-4">Transfer ID</th>
                  <th>Date</th>
                  <th>From</th>
                  <th></th>
                  <th>To</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Action</th>

                </tr>
              </thead>

              <tbody>

                {transfers.map((transfer) => (

                  <tr key={transfer.id}>

                    <td className="px-4">
                      <span className="text-primary fw-semibold">
                        {transfer.id}
                      </span>
                    </td>

                    <td className="text-secondary">
                      {transfer.date}
                    </td>

                    <td className="text-white">
                      {transfer.from}
                    </td>

                    <td className="text-primary text-center">
                      <i className="bi bi-arrow-right"></i>
                    </td>

                    <td className="text-white">
                      {transfer.to}
                    </td>

                    <td className="text-white">
                      {transfer.equipment}
                    </td>

                    <td className="text-white fw-semibold">
                      {transfer.quantity}
                    </td>

                    <td className="text-secondary">
                      {transfer.reference}
                    </td>

                    <td>
                      <span className="badge text-bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        {transfer.status}
                      </span>
                    </td>

                    <td>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        <div className="card-footer bg-transparent border-secondary">

          <div className="d-flex justify-content-between align-items-center">

            <small className="text-secondary">
              Showing 1–5 of 86 records
            </small>

            <nav>
              <ul className="pagination pagination-sm mb-0">

                <li className="page-item disabled">
                  <button className="page-link bg-dark text-secondary border-secondary">
                    Previous
                  </button>
                </li>

                <li className="page-item active">
                  <button className="page-link bg-primary border-primary">
                    1
                  </button>
                </li>

                <li className="page-item">
                  <button className="page-link bg-dark text-secondary border-secondary">
                    2
                  </button>
                </li>

                <li className="page-item">
                  <button className="page-link bg-dark text-secondary border-secondary">
                    3
                  </button>
                </li>

                <li className="page-item">
                  <button className="page-link bg-dark text-secondary border-secondary">
                    Next
                  </button>
                </li>

              </ul>
            </nav>

          </div>

        </div>

      </div>

      {/* New Transfer Modal */}
      {showModal && (

        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered modal-lg">

            <div className="modal-content bg-dark border-secondary">

              <div className="modal-header border-secondary">

                <div>
                  <h5 className="modal-title text-white">
                    New Asset Transfer
                  </h5>

                  <small className="text-secondary">
                    Transfer assets between bases
                  </small>
                </div>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>

              </div>

              <div className="modal-body">

                {/* Source / Destination */}
                <div className="row g-3">

                  <div className="col-md-5">

                    <label className="form-label text-light">
                      From Base{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <select className="form-select bg-black text-light border-secondary">

                      <option value="">
                        Select Source Base
                      </option>

                      <option>
                        Base Alpha
                      </option>

                      <option>
                        Base Bravo
                      </option>

                      <option>
                        Base Charlie
                      </option>

                    </select>

                  </div>

                  <div className="col-md-2 d-flex align-items-end justify-content-center pb-2">

                    <div className="text-primary fs-4">
                      <i className="bi bi-arrow-right"></i>
                    </div>

                  </div>

                  <div className="col-md-5">

                    <label className="form-label text-light">
                      To Base{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <select className="form-select bg-black text-light border-secondary">

                      <option value="">
                        Select Destination Base
                      </option>

                      <option>
                        Base Alpha
                      </option>

                      <option>
                        Base Bravo
                      </option>

                      <option>
                        Base Charlie
                      </option>

                    </select>

                  </div>

                  {/* Equipment */}
                  <div className="col-md-6">

                    <label className="form-label text-light">
                      Equipment Type{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <select className="form-select bg-black text-light border-secondary">

                      <option>
                        Select Equipment
                      </option>

                      <option>Rifle</option>
                      <option>Ammunition</option>
                      <option>Helmet</option>
                      <option>Vehicle</option>

                    </select>

                  </div>

                  {/* Quantity */}
                  <div className="col-md-6">

                    <label className="form-label text-light">
                      Quantity{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="form-control bg-black text-light border-secondary"
                      placeholder="Enter quantity"
                    />

                  </div>

                  {/* Date */}
                  <div className="col-md-6">

                    <label className="form-label text-light">
                      Transfer Date{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <input
                      type="date"
                      className="form-control bg-black text-light border-secondary"
                    />

                  </div>

                  {/* Reference */}
                  <div className="col-md-6">

                    <label className="form-label text-light">
                      Reference Number
                    </label>

                    <input
                      type="text"
                      className="form-control bg-black text-light border-secondary"
                      placeholder="Enter reference number"
                    />

                  </div>

                  {/* Remarks */}
                  <div className="col-12">

                    <label className="form-label text-light">
                      Remarks
                    </label>

                    <textarea
                      className="form-control bg-black text-light border-secondary"
                      rows="3"
                      placeholder="Enter transfer remarks..."
                    ></textarea>

                  </div>

                </div>

                {/* Warning */}
                <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-warning mt-4 mb-0">

                  <i className="bi bi-exclamation-triangle me-2"></i>

                  The source base inventory will be reduced and the
                  destination base inventory will be increased after
                  this transfer is recorded.

                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  <i className="bi bi-arrow-left-right me-2"></i>
                  Create Transfer
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Transfers;