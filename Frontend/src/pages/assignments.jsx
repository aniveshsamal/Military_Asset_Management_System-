import { useEffect, useMemo, useState } from "react";
import apiRequest from "../services/api";
import { getCurrentUser, isBaseScoped } from "../services/roleAccess";

const emptyForm = {
  baseId: "",
  equipmentTypeId: "",
  personnelName: "",
  quantity: "",
  assignmentDate: new Date().toISOString().split("T")[0],
  remarks: "",
};

function Assignments() {
  const user = getCurrentUser();
  const baseScoped = isBaseScoped(user);
  const assignedBaseId = user.baseId == null ? "" : String(user.baseId);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    baseId: baseScoped ? assignedBaseId : "",
    equipmentTypeId: "",
    status: "",
  });
  const [form, setForm] = useState({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([apiRequest("/bases"), apiRequest("/equipment-types")])
      .then(([baseData, equipmentData]) => {
        setBases(baseData);
        setEquipmentTypes(equipmentData);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("startDate", filters.startDate || "1970-01-01");
        params.set("endDate", filters.endDate || new Date().toISOString().split("T")[0]);

        if (filters.baseId) params.set("baseId", filters.baseId);
        if (filters.equipmentTypeId) params.set("equipmentTypeId", filters.equipmentTypeId);

        const data = await apiRequest(`/assignments?${params.toString()}`);
        setAssignments(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError.message);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [filters.startDate, filters.endDate, filters.baseId, filters.equipmentTypeId, refreshToken]);

  const visibleAssignments = useMemo(
    () => assignments.filter((assignment) => !filters.status || assignment.status === filters.status),
    [assignments, filters.status]
  );
  const activeCount = assignments.filter((assignment) => assignment.status === "ACTIVE").length;
  const returnedCount = assignments.filter((assignment) => assignment.status === "RETURNED").length;
  const personnelCount = new Set(assignments.map((assignment) => assignment.personnelName)).size;

  const openDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await apiRequest("/assignments", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          baseId: Number(form.baseId),
          equipmentTypeId: Number(form.equipmentTypeId),
          quantity: Number(form.quantity),
        }),
      });
      setShowModal(false);
      setForm({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "" });
      setSuccess("Assignment recorded successfully.");
      setRefreshToken((current) => current + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (assignmentId) => {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/assignments/${assignmentId}/return`, { method: "PUT" });
      setAssignments((current) => current.map((assignment) => (
        assignment.id === assignmentId
          ? { ...assignment, status: "RETURNED" }
          : assignment
      )));
        setRefreshToken((current) => current + 1);
      setSuccess("Assignment returned successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h3 className="text-white fw-bold mb-1">
            <i className="bi bi-person-check me-2"></i>
            Assignments
          </h3>

          <p className="text-secondary mb-0">
            Manage equipment assigned to personnel across bases.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setForm({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "" });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Assign Asset
        </button>

      </div>

      {(error || success) && (
        <div className={`alert ${error ? "alert-danger" : "alert-success"}`} role="alert">
          {error || success}
        </div>
      )}

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
                  <h3 className="fw-bold mt-2 mb-0 text-white">{assignments.length}</h3>
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
                  <h3 className="fw-bold mt-2 mb-0 text-white">{activeCount}</h3>
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
                  <h3 className="fw-bold mt-2 mb-0 text-white">{returnedCount}</h3>
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
                  <h3 className="fw-bold mt-2 mb-0 text-white">{personnelCount}</h3>
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
              <label className="form-label text-secondary">From Date</label>
              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
                value={filters.startDate}
                onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label text-secondary">To Date</label>
              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
                value={filters.endDate}
                onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label text-secondary">Base</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={filters.baseId}
                disabled={baseScoped}
                onChange={(event) => setFilters((current) => ({ ...current, baseId: event.target.value }))}
              >
                {!baseScoped && <option value="">All Bases</option>}
                {bases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label text-secondary">Equipment Type</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={filters.equipmentTypeId}
                onChange={(event) => setFilters((current) => ({ ...current, equipmentTypeId: event.target.value }))}
              >
                <option value="">All Equipment</option>
                {equipmentTypes.map((equipment) => <option key={equipment.id} value={equipment.id}>{equipment.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label text-secondary">Status</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="RETURNED">Returned</option>
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

              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Loading assignments...</td></tr>
              ) : visibleAssignments.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-secondary">No assignments found.</td></tr>
              ) : visibleAssignments.map((assignment) => (

                <tr key={assignment.id}>

                  <td className="fw-semibold">
                    ASN-{String(assignment.id).padStart(5, "0")}
                  </td>

                  <td>
                    {assignment.assignmentDate}
                  </td>

                  <td>
                    <div className="fw-semibold">
                      {assignment.personnelName}
                    </div>
                  </td>

                  <td>
                    {assignment.baseName}
                  </td>

                  <td>
                    {assignment.equipmentTypeName}
                  </td>

                  <td>
                    {assignment.quantity}
                  </td>

                  <td>

                    {assignment.status === "ACTIVE" ? (
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
                    {assignment.status === "ACTIVE" && (
                      <button
                        className="btn btn-sm btn-outline-warning ms-2"
                        onClick={() => handleReturn(assignment.id)}
                      >
                        Return
                      </button>
                    )}

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
              {loading ? "Loading records..." : `${visibleAssignments.length} assignment${visibleAssignments.length === 1 ? "" : "s"}`}
            </small>

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

                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={form.baseId}
                      disabled={baseScoped}
                      onChange={(event) => setForm((current) => ({ ...current, baseId: event.target.value }))}
                      required
                    >
                      {!baseScoped && <option value="">Select Base</option>}
                      {bases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Personnel
                    </label>

                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter personnel name"
                      value={form.personnelName}
                      onChange={(event) => setForm((current) => ({ ...current, personnelName: event.target.value }))}
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Equipment Type
                    </label>

                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={form.equipmentTypeId}
                      onChange={(event) => setForm((current) => ({ ...current, equipmentTypeId: event.target.value }))}
                      required
                    >
                      <option value="">Select Equipment</option>
                      {equipmentTypes.map((equipment) => <option key={equipment.id} value={equipment.id}>{equipment.name}</option>)}
                    </select>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter quantity"
                      value={form.quantity}
                      onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Assignment Date
                    </label>

                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                      value={form.assignmentDate}
                      onChange={(event) => setForm((current) => ({ ...current, assignmentDate: event.target.value }))}
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
                      value={form.remarks}
                      onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))}
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

                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                  <i className="bi bi-check-lg me-2"></i>
                  {submitting ? "Saving..." : "Assign Asset"}
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
                      {selectedAssignment.assignmentDate}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Personnel
                    </small>
                    <div>
                      {selectedAssignment.personnelName}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Base
                    </small>
                    <div>
                      {selectedAssignment.baseName}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">
                      Equipment
                    </small>
                    <div>
                      {selectedAssignment.equipmentTypeName}
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
                      <span className={`badge ${selectedAssignment.status === "ACTIVE" ? "text-bg-success" : "text-bg-secondary"}`}>
                        {selectedAssignment.status === "ACTIVE" ? "Active" : "Returned"}
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