import { useState } from "react";

function Purchases() {
  const [showModal, setShowModal] = useState(false);

  const purchases = [
    {
      id: "PUR-00125",
      date: "29 Sep 2026",
      base: "Base Alpha",
      equipment: "Rifle",
      quantity: 150,
      supplier: "Defence Equipment Ltd.",
      reference: "INV-2026-0912",
      status: "Completed",
    },
    {
      id: "PUR-00124",
      date: "28 Sep 2026",
      base: "Base Bravo",
      equipment: "Ammunition",
      quantity: 500,
      supplier: "National Defence Supplies",
      reference: "INV-2026-0908",
      status: "Completed",
    },
    {
      id: "PUR-00123",
      date: "26 Sep 2026",
      base: "Base Alpha",
      equipment: "Helmet",
      quantity: 200,
      supplier: "Military Gear Corp.",
      reference: "INV-2026-0897",
      status: "Completed",
    },
    {
      id: "PUR-00122",
      date: "24 Sep 2026",
      base: "Base Charlie",
      equipment: "Vehicle",
      quantity: 12,
      supplier: "Defence Vehicles Ltd.",
      reference: "INV-2026-0875",
      status: "Completed",
    },
    {
      id: "PUR-00121",
      date: "22 Sep 2026",
      base: "Base Bravo",
      equipment: "Rifle",
      quantity: 100,
      supplier: "Defence Equipment Ltd.",
      reference: "INV-2026-0864",
      status: "Completed",
    },
  ];

  return (
    <div className="container-fluid px-0">

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">

        <div>
          <h3 className="text-white fw-bold mb-1">
            Purchases
          </h3>

          <p className="text-secondary mb-0">
            Record and manage asset purchases across bases.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Record Purchase
        </button>

      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-secondary small mb-1">
                    Total Purchases
                  </p>

                  <h4 className="text-white fw-bold mb-0">
                    962
                  </h4>
                </div>

                <div className="bg-success bg-opacity-25 text-success rounded-3 p-3">
                  <i className="bi bi-cart-check fs-4"></i>
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
                    Purchase Records
                  </p>

                  <h4 className="text-white fw-bold mb-0">
                    125
                  </h4>
                </div>

                <div className="bg-primary bg-opacity-25 text-primary rounded-3 p-3">
                  <i className="bi bi-receipt fs-4"></i>
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
                    Current Month
                  </p>

                  <h4 className="text-white fw-bold mb-0">
                    962
                  </h4>
                </div>

                <div className="bg-info bg-opacity-25 text-info rounded-3 p-3">
                  <i className="bi bi-calendar-check fs-4"></i>
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
                Base
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

          <div className="d-flex justify-content-end mt-3 gap-2">

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

      {/* Purchase History */}
      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary py-3">

          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="text-white mb-1">
                Purchase History
              </h5>

              <small className="text-secondary">
                All recorded asset purchases
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

                  <th className="px-4">
                    Purchase ID
                  </th>

                  <th>Date</th>

                  <th>Base</th>

                  <th>Equipment</th>

                  <th>Quantity</th>

                  <th>Supplier</th>

                  <th>Reference</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>
              </thead>

              <tbody>

                {purchases.map((purchase) => (

                  <tr key={purchase.id}>

                    <td className="px-4">
                      <span className="text-primary fw-semibold">
                        {purchase.id}
                      </span>
                    </td>

                    <td className="text-secondary">
                      {purchase.date}
                    </td>

                    <td className="text-white">
                      {purchase.base}
                    </td>

                    <td className="text-white">
                      {purchase.equipment}
                    </td>

                    <td className="text-white fw-semibold">
                      {purchase.quantity}
                    </td>

                    <td className="text-secondary">
                      {purchase.supplier}
                    </td>

                    <td className="text-secondary">
                      {purchase.reference}
                    </td>

                    <td>
                      <span className="badge text-bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        {purchase.status}
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

        {/* Pagination */}
        <div className="card-footer bg-transparent border-secondary">

          <div className="d-flex justify-content-between align-items-center">

            <small className="text-secondary">
              Showing 1–5 of 125 records
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

      {/* Record Purchase Modal */}
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
                    Record Purchase
                  </h5>

                  <small className="text-secondary">
                    Add a new asset purchase
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row g-3">

                  {/* Base */}
                  <div className="col-md-6">

                    <label className="form-label text-light">
                      Base <span className="text-danger">*</span>
                    </label>

                    <select className="form-select bg-black text-light border-secondary">
                      <option value="">
                        Select Base
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

                      <option value="">
                        Select Equipment
                      </option>

                      <option>
                        Rifle
                      </option>

                      <option>
                        Ammunition
                      </option>

                      <option>
                        Helmet
                      </option>

                      <option>
                        Vehicle
                      </option>

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
                      Purchase Date{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <input
                      type="date"
                      className="form-control bg-black text-light border-secondary"
                    />

                  </div>

                  {/* Supplier */}
                  <div className="col-md-6">

                    <label className="form-label text-light">
                      Supplier
                    </label>

                    <input
                      type="text"
                      className="form-control bg-black text-light border-secondary"
                      placeholder="Enter supplier name"
                    />

                  </div>

                  {/* Reference */}
                  <div className="col-md-6">

                    <label className="form-label text-light">
                      Invoice / Reference Number
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
                      placeholder="Enter additional information..."
                    ></textarea>

                  </div>

                </div>

                {/* Warning */}
                <div className="alert alert-info bg-info bg-opacity-10 border-info text-info mt-4 mb-0">

                  <i className="bi bi-info-circle me-2"></i>

                  Recording this purchase will increase the inventory
                  balance of the selected base.

                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  <i className="bi bi-check-lg me-2"></i>
                  Record Purchase
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Purchases;