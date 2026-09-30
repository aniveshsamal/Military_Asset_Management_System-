import { useEffect, useMemo, useState } from "react";
import apiRequest from "../services/api";
import { getCurrentUser, isBaseScoped } from "../services/roleAccess";

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = {
  fromBaseId: "",
  toBaseId: "",
  equipmentTypeId: "",
  quantity: "",
  transferDate: today(),
  referenceNumber: "",
  remarks: "",
};

const emptyFilters = {
  startDate: "",
  endDate: "",
  baseId: "",
  equipmentTypeId: "",
};

function Transfers() {
  const user = getCurrentUser();
  const baseScoped = isBaseScoped(user);
  const assignedBaseId = user.baseId == null ? "" : String(user.baseId);
  const [transfers, setTransfers] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [filters, setFilters] = useState({ ...emptyFilters, baseId: baseScoped ? assignedBaseId : "" });
  const [form, setForm] = useState({ ...emptyForm, fromBaseId: baseScoped ? assignedBaseId : "" });
  const [direction, setDirection] = useState("OUTGOING");
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    const loadTransfers = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("startDate", filters.startDate || "1970-01-01");
        params.set("endDate", filters.endDate || today());
        if (filters.baseId) params.set("baseId", filters.baseId);
        if (filters.equipmentTypeId) params.set("equipmentTypeId", filters.equipmentTypeId);

        const data = await apiRequest(`/transfers?${params.toString()}`);
        setTransfers(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError.message);
        setTransfers([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransfers();
  }, [filters.startDate, filters.endDate, filters.baseId, filters.equipmentTypeId, refreshToken]);

  const totalQuantity = useMemo(
    () => transfers.reduce((total, transfer) => total + Number(transfer.quantity || 0), 0),
    [transfers]
  );
  const routeCount = useMemo(
    () => new Set(transfers.map((transfer) => `${transfer.fromBaseId}-${transfer.toBaseId}`)).size,
    [transfers]
  );
  const sourceBases = bases.filter((base) => !baseScoped || (
    direction === "INCOMING"
      ? String(base.id) !== assignedBaseId
      : String(base.id) === assignedBaseId
  ));
  const destinationBases = bases.filter((base) => !baseScoped || (
    direction === "INCOMING"
      ? String(base.id) === assignedBaseId
      : String(base.id) !== assignedBaseId
  ));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.fromBaseId === form.toBaseId) {
      setError("Source and destination bases must be different.");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/transfers", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          fromBaseId: Number(form.fromBaseId),
          toBaseId: Number(form.toBaseId),
          equipmentTypeId: Number(form.equipmentTypeId),
          quantity: Number(form.quantity),
          referenceNumber: form.referenceNumber.trim() || null,
          remarks: form.remarks.trim() || null,
        }),
      });
      setShowModal(false);
      setForm({ ...emptyForm, fromBaseId: baseScoped ? assignedBaseId : "", transferDate: today() });
      setSuccess("Transfer recorded successfully.");
      setRefreshToken((current) => current + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-0 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="text-white fw-bold mb-1">Transfers</h3>
          <p className="text-secondary mb-0">Manage asset movements between military bases.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(""); setDirection("OUTGOING"); setForm({ ...emptyForm, fromBaseId: baseScoped ? assignedBaseId : "", toBaseId: "", transferDate: today() }); setShowModal(true); }}>
          <i className="bi bi-arrow-left-right me-2"></i>New Transfer
        </button>
      </div>

      {(error || success) && (
        <div className={`alert ${error ? "alert-danger" : "alert-success"}`} role="alert">
          {error || success}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100"><div className="card-body">
            <p className="text-secondary small mb-1">Transfer Records</p>
            <h4 className="text-white fw-bold mb-0">{transfers.length.toLocaleString()}</h4>
          </div></div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100"><div className="card-body">
            <p className="text-secondary small mb-1">Units Moved</p>
            <h4 className="text-success fw-bold mb-0">{totalQuantity.toLocaleString()}</h4>
          </div></div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100"><div className="card-body">
            <p className="text-secondary small mb-1">Routes Used</p>
            <h4 className="text-info fw-bold mb-0">{routeCount.toLocaleString()}</h4>
          </div></div>
        </div>
      </div>

      <div className="card bg-dark border-secondary mb-4">
        <div className="card-header bg-transparent border-secondary"><h6 className="text-white mb-0">Filters</h6></div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label text-secondary small">From Date</label>
              <input type="date" className="form-control bg-black text-light border-secondary" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} />
            </div>
            <div className="col-md-3">
              <label className="form-label text-secondary small">To Date</label>
              <input type="date" className="form-control bg-black text-light border-secondary" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} />
            </div>
            <div className="col-md-2">
              <label className="form-label text-secondary small">Base</label>
              <select className="form-select bg-black text-light border-secondary" value={filters.baseId} disabled={baseScoped} onChange={(event) => setFilters((current) => ({ ...current, baseId: event.target.value }))}>
                {!baseScoped && <option value="">All Bases</option>}
                {bases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-secondary small">Equipment Type</label>
              <select className="form-select bg-black text-light border-secondary" value={filters.equipmentTypeId} onChange={(event) => setFilters((current) => ({ ...current, equipmentTypeId: event.target.value }))}>
                <option value="">All Equipment</option>
                {equipmentTypes.map((equipment) => <option key={equipment.id} value={equipment.id}>{equipment.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={() => setFilters(emptyFilters)}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-dark border-secondary">
        <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
          <div><h5 className="text-white mb-1">Transfer History</h5><small className="text-secondary">Recorded movements between bases</small></div>
          {!loading && <span className="text-secondary small">{transfers.length} records</span>}
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead><tr><th className="px-4">Transfer ID</th><th>Date</th><th>From</th><th></th><th>To</th><th>Equipment</th><th>Quantity</th><th>Reference</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-5">Loading transfers...</td></tr>
              ) : transfers.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-5 text-secondary">No transfer records found.</td></tr>
              ) : transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td className="px-4"><span className="text-primary fw-semibold">TRF-{String(transfer.id).padStart(5, "0")}</span></td>
                  <td className="text-secondary">{transfer.transferDate}</td>
                  <td className="text-white">{transfer.fromBaseName}</td>
                  <td className="text-primary text-center"><i className="bi bi-arrow-right"></i></td>
                  <td className="text-white">{transfer.toBaseName}</td>
                  <td className="text-white">{transfer.equipmentTypeName}</td>
                  <td className="text-white fw-semibold">{Number(transfer.quantity).toLocaleString()}</td>
                  <td className="text-secondary">{transfer.referenceNumber || "-"}</td>
                  <td><button className="btn btn-sm btn-outline-secondary" title="View details" onClick={() => setSelectedTransfer(transfer)}><i className="bi bi-eye"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg"><div className="modal-content bg-dark text-light border-secondary">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-secondary">
                <div><h5 className="modal-title">New Asset Transfer</h5><small className="text-secondary">Move inventory between bases</small></div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} disabled={submitting}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {baseScoped && (
                    <div className="col-12">
                      <label className="form-label">Transfer direction</label>
                      <div className="btn-group w-100" role="group" aria-label="Transfer direction">
                        <button type="button" className={`btn ${direction === "OUTGOING" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => { setDirection("OUTGOING"); setForm((current) => ({ ...current, fromBaseId: assignedBaseId, toBaseId: "" })); }}>Send from my base</button>
                        <button type="button" className={`btn ${direction === "INCOMING" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => { setDirection("INCOMING"); setForm((current) => ({ ...current, fromBaseId: "", toBaseId: assignedBaseId })); }}>Receive to my base</button>
                      </div>
                    </div>
                  )}
                  <div className="col-md-6"><label className="form-label">From Base</label>
                    <select className="form-select bg-black text-light border-secondary" value={form.fromBaseId} disabled={baseScoped && direction === "OUTGOING"} onChange={(event) => setForm((current) => ({ ...current, fromBaseId: event.target.value }))} required>
                      {!(baseScoped && direction === "OUTGOING") && <option value="">Select source base</option>}
                      {baseScoped && direction === "OUTGOING" && !assignedBaseId && <option value="">No assigned base</option>}
                      {sourceBases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6"><label className="form-label">To Base</label>
                    <select className="form-select bg-black text-light border-secondary" value={form.toBaseId} disabled={baseScoped && direction === "INCOMING"} onChange={(event) => setForm((current) => ({ ...current, toBaseId: event.target.value }))} required>
                      {!(baseScoped && direction === "INCOMING") && <option value="">Select destination base</option>}
                      {baseScoped && direction === "INCOMING" && !assignedBaseId && <option value="">No assigned base</option>}
                      {destinationBases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6"><label className="form-label">Equipment Type</label>
                    <select className="form-select bg-black text-light border-secondary" value={form.equipmentTypeId} onChange={(event) => setForm((current) => ({ ...current, equipmentTypeId: event.target.value }))} required>
                      <option value="">Select equipment</option>{equipmentTypes.map((equipment) => <option key={equipment.id} value={equipment.id}>{equipment.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6"><label className="form-label">Quantity</label>
                    <input type="number" min="1" className="form-control bg-black text-light border-secondary" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} required />
                  </div>
                  <div className="col-md-6"><label className="form-label">Transfer Date</label>
                    <input type="date" className="form-control bg-black text-light border-secondary" value={form.transferDate} onChange={(event) => setForm((current) => ({ ...current, transferDate: event.target.value }))} required />
                  </div>
                  <div className="col-md-6"><label className="form-label">Reference Number</label>
                    <input className="form-control bg-black text-light border-secondary" value={form.referenceNumber} onChange={(event) => setForm((current) => ({ ...current, referenceNumber: event.target.value }))} />
                  </div>
                  <div className="col-12"><label className="form-label">Remarks</label>
                    <textarea className="form-control bg-black text-light border-secondary" rows="3" value={form.remarks} onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Recording..." : "Create Transfer"}</button>
              </div>
            </form>
          </div></div>
        </div>
      )}

      {selectedTransfer && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="modal-dialog modal-dialog-centered"><div className="modal-content bg-dark text-light border-secondary">
            <div className="modal-header border-secondary"><h5 className="modal-title">Transfer Details</h5><button className="btn-close btn-close-white" onClick={() => setSelectedTransfer(null)}></button></div>
            <div className="modal-body"><dl className="row mb-0">
              <dt className="col-5">Date</dt><dd className="col-7">{selectedTransfer.transferDate}</dd>
              <dt className="col-5">Route</dt><dd className="col-7">{selectedTransfer.fromBaseName} to {selectedTransfer.toBaseName}</dd>
              <dt className="col-5">Equipment</dt><dd className="col-7">{selectedTransfer.equipmentTypeName}</dd>
              <dt className="col-5">Quantity</dt><dd className="col-7">{selectedTransfer.quantity}</dd>
              <dt className="col-5">Reference</dt><dd className="col-7">{selectedTransfer.referenceNumber || "-"}</dd>
              <dt className="col-5">Created By</dt><dd className="col-7">{selectedTransfer.createdBy || "-"}</dd>
              <dt className="col-5">Remarks</dt><dd className="col-7">{selectedTransfer.remarks || "-"}</dd>
            </dl></div>
            <div className="modal-footer border-secondary"><button className="btn btn-secondary" onClick={() => setSelectedTransfer(null)}>Close</button></div>
          </div></div>
        </div>
      )}
    </div>
  );
}

export default Transfers;
