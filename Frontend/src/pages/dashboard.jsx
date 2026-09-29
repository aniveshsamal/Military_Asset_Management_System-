import { useState } from "react";

function Dashboard() {
  const [showMovement, setShowMovement] = useState(false);

  const stats = [
    {
      title: "Opening Balance",
      value: "12,450",
      icon: "bi-box-seam",
      color: "primary",
    },
    {
      title: "Purchases",
      value: "1,250",
      icon: "bi-cart-plus",
      color: "success",
    },
    {
      title: "Transfer In",
      value: "480",
      icon: "bi-arrow-down-left",
      color: "info",
    },
    {
      title: "Transfer Out",
      value: "320",
      icon: "bi-arrow-up-right",
      color: "warning",
    },
    {
      title: "Assigned",
      value: "2,180",
      icon: "bi-person-check",
      color: "secondary",
    },
    {
      title: "Expended",
      value: "640",
      icon: "bi-box-arrow-up-right",
      color: "danger",
    },
    {
      title: "Closing Balance",
      value: "13,220",
      icon: "bi-check-circle",
      color: "success",
    },
  ];

  const transactions = [
    {
      type: "Purchase",
      equipment: "Rifle",
      quantity: 150,
      base: "Base Alpha",
      date: "29 Sep 2026",
      status: "Completed",
    },
    {
      type: "Transfer In",
      equipment: "Ammunition",
      quantity: 500,
      base: "Base Alpha",
      date: "28 Sep 2026",
      status: "Completed",
    },
    {
      type: "Transfer Out",
      equipment: "Rifle",
      quantity: 80,
      base: "Base Alpha",
      date: "27 Sep 2026",
      status: "Completed",
    },
    {
      type: "Purchase",
      equipment: "Helmet",
      quantity: 200,
      base: "Base Bravo",
      date: "26 Sep 2026",
      status: "Completed",
    },
    {
      type: "Expenditure",
      equipment: "Ammunition",
      quantity: 120,
      base: "Base Alpha",
      date: "25 Sep 2026",
      status: "Completed",
    },
  ];

  return (
    <div className="container-fluid px-0">

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="text-white fw-bold mb-1">
            Dashboard
          </h3>

          <p className="text-secondary mb-0">
            Overview of military asset inventory and movements.
          </p>
        </div>

        <button className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Record Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-4">
              <label className="form-label text-secondary small">
                Date
              </label>

              <input
                type="date"
                className="form-control bg-black text-light border-secondary"
                defaultValue="2026-09-29"
              />
            </div>

            <div className="col-md-4">
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

            <div className="col-md-4">
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">

        {stats.map((stat) => (
          <div
            className="col-12 col-sm-6 col-xl"
            key={stat.title}
          >
            <div className="card bg-dark border-secondary h-100">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-start">

                  <div>
                    <p className="text-secondary small mb-2">
                      {stat.title}
                    </p>

                    <h4 className="text-white fw-bold mb-0">
                      {stat.value}
                    </h4>
                  </div>

                  <div
                    className={`bg-${stat.color} bg-opacity-25 text-${stat.color} rounded-3 d-flex align-items-center justify-content-center`}
                    style={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    <i className={`bi ${stat.icon} fs-5`}></i>
                  </div>

                </div>

              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Net Movement */}
      <div className="card bg-dark border-primary mb-4">
        <div className="card-body">

          <div className="row align-items-center">

            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3">

                <div
                  className="bg-primary bg-opacity-25 text-primary rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <i className="bi bi-arrow-left-right fs-4"></i>
                </div>

                <div>
                  <p className="text-secondary mb-1">
                    Net Movement
                  </p>

                  <h3 className="text-white fw-bold mb-0">
                    +1,410
                  </h3>

                  <small className="text-secondary">
                    Purchases + Transfer In − Transfer Out
                  </small>
                </div>

              </div>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowMovement(true)}
              >
                View Details
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary py-3">

          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="text-white mb-1">
                Recent Transactions
              </h5>

              <small className="text-secondary">
                Latest asset movements and activities
              </small>
            </div>

            <button className="btn btn-sm btn-outline-secondary">
              View All
            </button>

          </div>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover align-middle mb-0">

              <thead>
                <tr className="text-secondary">
                  <th className="px-4">Type</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Base</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {transactions.map((transaction, index) => (
                  <tr key={index}>

                    <td className="px-4">
                      <span
                        className={`badge ${
                          transaction.type === "Purchase"
                            ? "text-bg-success"
                            : transaction.type === "Transfer In"
                            ? "text-bg-info"
                            : transaction.type === "Transfer Out"
                            ? "text-bg-warning"
                            : "text-bg-danger"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td className="text-white">
                      {transaction.equipment}
                    </td>

                    <td className="text-white fw-semibold">
                      {transaction.quantity}
                    </td>

                    <td className="text-secondary">
                      {transaction.base}
                    </td>

                    <td className="text-secondary">
                      {transaction.date}
                    </td>

                    <td>
                      <span className="badge text-bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        {transaction.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      </div>

      {/* Net Movement Modal */}
      {showMovement && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content bg-dark border-secondary">

              <div className="modal-header border-secondary">

                <div>
                  <h5 className="modal-title text-white">
                    Net Movement Details
                  </h5>

                  <small className="text-secondary">
                    Asset movement breakdown
                  </small>
                </div>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowMovement(false)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="d-flex justify-content-between py-3 border-bottom border-secondary">
                  <span className="text-secondary">
                    Purchases
                  </span>

                  <span className="text-success fw-semibold">
                    +1,250
                  </span>
                </div>

                <div className="d-flex justify-content-between py-3 border-bottom border-secondary">
                  <span className="text-secondary">
                    Transfer In
                  </span>

                  <span className="text-info fw-semibold">
                    +480
                  </span>
                </div>

                <div className="d-flex justify-content-between py-3 border-bottom border-secondary">
                  <span className="text-secondary">
                    Transfer Out
                  </span>

                  <span className="text-warning fw-semibold">
                    -320
                  </span>
                </div>

                <div className="d-flex justify-content-between pt-3">
                  <span className="text-white fw-semibold">
                    Net Movement
                  </span>

                  <span className="text-primary fw-bold">
                    +1,410
                  </span>
                </div>

              </div>

              <div className="modal-footer border-secondary">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowMovement(false)}
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

export default Dashboard;