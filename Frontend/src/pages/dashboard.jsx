
import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { getCurrentUser, isBaseScoped } from "../services/roleAccess";

function Dashboard() {
  const today = new Date().toISOString().split("T")[0];
  const user = getCurrentUser();
  const baseScoped = isBaseScoped(user);
  const assignedBaseId = user.baseId == null ? "" : String(user.baseId);

  const [showMovement, setShowMovement] = useState(false);

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedBase, setSelectedBase] = useState(baseScoped ? assignedBaseId : "");
  const [selectedEquipment, setSelectedEquipment] = useState("");

  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const [dashboard, setDashboard] = useState({
    openingBalance: 0,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    netMovement: 0,
    assigned: 0,
    expended: 0,
    closingBalance: 0,
  });

  const [movement, setMovement] = useState({
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    netMovement: 0,
  });

  const [loading, setLoading] = useState(true);
  const [movementLoading, setMovementLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = [
    {
      title: "Opening Balance",
      value: dashboard.openingBalance,
      icon: "bi-box-seam",
      color: "primary",
    },
    {
      title: "Purchases",
      value: dashboard.purchases,
      icon: "bi-cart-plus",
      color: "success",
    },
    {
      title: "Transfer In",
      value: dashboard.transferIn,
      icon: "bi-arrow-down-left",
      color: "info",
    },
    {
      title: "Transfer Out",
      value: dashboard.transferOut,
      icon: "bi-arrow-up-right",
      color: "warning",
    },
    {
      title: "Assigned",
      value: dashboard.assigned,
      icon: "bi-person-check",
      color: "secondary",
    },
    {
      title: "Expended",
      value: dashboard.expended,
      icon: "bi-box-arrow-up-right",
      color: "danger",
    },
    {
      title: "Closing Balance",
      value: dashboard.closingBalance,
      icon: "bi-check-circle",
      color: "success",
    },
  ];

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [selectedDate, selectedBase, selectedEquipment]);

  const loadFilterData = async () => {
    try {
      const [baseData, equipmentData] = await Promise.all([
        apiRequest("/bases"),
        apiRequest("/equipment-types"),
      ]);

      setBases(baseData);
      setEquipmentTypes(equipmentData);
    } catch (error) {
      setError(error.message);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (selectedBase) {
        params.append("baseId", selectedBase);
      }

      if (selectedEquipment) {
        params.append("equipmentTypeId", selectedEquipment);
      }

      if (selectedDate) {
        params.append("startDate", selectedDate);
        params.append("endDate", selectedDate);
      }

      const data = await apiRequest(
        `/dashboard?${params.toString()}`
      );

      setDashboard(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMovementDetails = async () => {
    setMovementLoading(true);

    try {
      const params = new URLSearchParams();

      if (selectedBase) {
        params.append("baseId", selectedBase);
      }

      if (selectedEquipment) {
        params.append("equipmentTypeId", selectedEquipment);
      }

      if (selectedDate) {
        params.append("startDate", selectedDate);
        params.append("endDate", selectedDate);
      }

      const data = await apiRequest(
        `/dashboard/movement-details?${params.toString()}`
      );

      setMovement(data);
      setShowMovement(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setMovementLoading(false);
    }
  };

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

      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

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
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-secondary small">
                Base
              </label>

              <select
                className="form-select bg-black text-light border-secondary"
                value={baseScoped ? assignedBaseId : selectedBase}
                disabled={baseScoped}
                onChange={(e) =>
                  setSelectedBase(e.target.value)
                }
              >
                {!baseScoped && <option value="">All Bases</option>}

                {bases.map((base) => (
                  <option
                    key={base.id}
                    value={base.id}
                  >
                    {base.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label text-secondary small">
                Equipment Type
              </label>

              <select
                className="form-select bg-black text-light border-secondary"
                value={selectedEquipment}
                onChange={(e) =>
                  setSelectedEquipment(e.target.value)
                }
              >
                <option value="">All Equipment</option>

                {equipmentTypes.map((equipment) => (
                  <option
                    key={equipment.id}
                    value={equipment.id}
                  >
                    {equipment.name}
                  </option>
                ))}
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
                      {loading ? "..." : stat.value}
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
                    {loading
                      ? "..."
                      : `+${dashboard.netMovement}`}
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
                onClick={loadMovementDetails}
                disabled={movementLoading}
              >
                {movementLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    View Details
                    <i className="bi bi-arrow-right ms-2"></i>
                  </>
                )}
              </button>
            </div>

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
                    +{movement.purchases}
                  </span>
                </div>

                <div className="d-flex justify-content-between py-3 border-bottom border-secondary">
                  <span className="text-secondary">
                    Transfer In
                  </span>

                  <span className="text-info fw-semibold">
                    +{movement.transferIn}
                  </span>
                </div>

                <div className="d-flex justify-content-between py-3 border-bottom border-secondary">
                  <span className="text-secondary">
                    Transfer Out
                  </span>

                  <span className="text-warning fw-semibold">
                    -{movement.transferOut}
                  </span>
                </div>

                <div className="d-flex justify-content-between pt-3">
                  <span className="text-white fw-semibold">
                    Net Movement
                  </span>

                  <span className="text-primary fw-bold">
                    {movement.netMovement >= 0 ? "+" : ""}
                    {movement.netMovement}
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
