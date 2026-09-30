import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../services/api";
import { getCurrentUser, isBaseScoped } from "../services/roleAccess";

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = {
  baseId: "",
  equipmentTypeId: "",
  quantity: "",
  reason: "",
  expenditureDate: today(),
  referenceNumber: "",
  personnelOrUnit: "",
  remarks: "",
};

const emptyFilters = {
  startDate: "",
  endDate: "",
  baseId: "",
  equipmentTypeId: "",
  reason: "",
};

function Expenditure() {
  const user = getCurrentUser();
  const baseScoped = isBaseScoped(user);
  const assignedBaseId = user.baseId == null ? "" : String(user.baseId);
  const [expenditures, setExpenditures] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({ ...emptyFilters, baseId: baseScoped ? assignedBaseId : "" });
  const [form, setForm] = useState({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "" });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([apiRequest("/bases"), apiRequest("/equipment-types"), apiRequest("/inventory")])
      .then(([baseData, equipmentData, inventoryData]) => {
        setBases(baseData);
        setEquipmentTypes(equipmentData);
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      })
      .catch((requestError) => setError(requestError.message));
  }, [refreshToken]);

  useEffect(() => {
    const loadExpenditures = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.set("startDate", filters.startDate || "1970-01-01");
        params.set("endDate", filters.endDate || today());
        if (filters.baseId) params.set("baseId", filters.baseId);
        if (filters.equipmentTypeId) params.set("equipmentTypeId", filters.equipmentTypeId);

        const data = await apiRequest(`/expenditures?${params.toString()}`);
        setExpenditures(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError.message);
        setExpenditures([]);
      } finally {
        setLoading(false);
      }
    };

    loadExpenditures();
  }, [filters.startDate, filters.endDate, filters.baseId, filters.equipmentTypeId, refreshToken]);

  const visibleRecords = useMemo(
    () => expenditures.filter((record) => !filters.reason || record.reason === filters.reason),
    [expenditures, filters.reason]
  );
  const quantityTotal = visibleRecords.reduce((total, record) => total + Number(record.quantity || 0), 0);
  const reasonCount = new Set(visibleRecords.map((record) => record.reason).filter(Boolean)).size;
  const reasonOptions = [...new Set(expenditures.map((record) => record.reason).filter(Boolean))];
  const inventoryForFormBase = inventory.filter((item) => String(item.baseId) === form.baseId);
  const availableInventory = inventoryForFormBase.filter((item) => Number(item.availableQuantity) > 0);
  const selectedInventory = inventoryForFormBase.find((item) => (
    String(item.equipmentTypeId) === form.equipmentTypeId
  ));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedInventory) {
      setError("No inventory record exists for this base and equipment. Record a purchase first.");
      return;
    }

    if (Number(form.quantity) > Number(selectedInventory.availableQuantity)) {
      setError(`Only ${selectedInventory.availableQuantity} units are available for expenditure.`);
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest("/expenditures", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          baseId: Number(form.baseId),
          equipmentTypeId: Number(form.equipmentTypeId),
          quantity: Number(form.quantity),
          reason: form.reason.trim(),
          referenceNumber: form.referenceNumber.trim() || null,
          personnelOrUnit: form.personnelOrUnit.trim() || null,
          remarks: form.remarks.trim() || null,
        }),
      });
      setShowModal(false);
      setForm({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "", expenditureDate: today() });
      setSuccess("Expenditure recorded successfully.");
      setRefreshToken((current) => current + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1"><i className="bi bi-box-arrow-down me-2"></i>Expenditure</h3>
          <p className="text-secondary mb-0">Track assets removed from available inventory.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(""); setForm({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "", expenditureDate: today() }); setShowModal(true); }}>
          <i className="bi bi-plus-lg me-2"></i>Record Expenditure
        </button>
      </div>

      {(error || success) && <div className={`alert ${error ? "alert-danger" : "alert-success"}`} role="alert">{error || success}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4"><div className="card bg-dark border-secondary h-100"><div className="card-body">
          <small className="text-secondary">Expenditure Records</small><h3 className="fw-bold mt-2 mb-0 text-white">{visibleRecords.length.toLocaleString()}</h3>
        </div></div></div>
        <div className="col-12 col-sm-6 col-xl-4"><div className="card bg-dark border-secondary h-100"><div className="card-body">
          <small className="text-secondary">Units Expended</small><h3 className="fw-bold mt-2 mb-0 text-white">{quantityTotal.toLocaleString()}</h3>
        </div></div></div>
        <div className="col-12 col-sm-6 col-xl-4"><div className="card bg-dark border-secondary h-100"><div className="card-body">
          <small className="text-secondary">Reasons Recorded</small><h3 className="fw-bold mt-2 mb-0 text-white">{reasonCount.toLocaleString()}</h3>
        </div></div></div>
      </div>

      <div className="alert alert-warning mb-4">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Recording an expenditure reduces inventory for the selected base and equipment type.
      </div>

      <div className="card bg-dark border-secondary mb-4"><div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-3"><label className="form-label text-secondary">From Date</label>
            <input type="date" className="form-control bg-dark text-light border-secondary" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} />
          </div>
          <div className="col-12 col-md-3"><label className="form-label text-secondary">To Date</label>
            <input type="date" className="form-control bg-dark text-light border-secondary" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} />
          </div>
          <div className="col-12 col-md-2"><label className="form-label text-secondary">Base</label>
            <select className="form-select bg-dark text-light border-secondary" value={filters.baseId} disabled={baseScoped} onChange={(event) => setFilters((current) => ({ ...current, baseId: event.target.value }))}>
              {!baseScoped && <option value="">All Bases</option>}
              {bases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-2"><label className="form-label text-secondary">Equipment</label>
            <select className="form-select bg-dark text-light border-secondary" value={filters.equipmentTypeId} onChange={(event) => setFilters((current) => ({ ...current, equipmentTypeId: event.target.value }))}>
              <option value="">All Equipment</option>{equipmentTypes.map((equipment) => <option key={equipment.id} value={equipment.id}>{equipment.name}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-2"><label className="form-label text-secondary">Reason</label>
            <select className="form-select bg-dark text-light border-secondary" value={filters.reason} onChange={(event) => setFilters((current) => ({ ...current, reason: event.target.value }))}>
              <option value="">All Reasons</option>{reasonOptions.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
            </select>
          </div>
        </div>
      </div></div>

      <div className="card bg-dark border-secondary">
        <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
          <div><h5 className="mb-1 fw-semibold">Expenditure History</h5><small className="text-secondary">Assets removed from available inventory</small></div>
          {!loading && <span className="text-secondary small">{visibleRecords.length} records</span>}
        </div>
        <div className="table-responsive"><table className="table table-dark table-hover align-middle mb-0">
          <thead><tr><th>ID</th><th>Date</th><th>Base</th><th>Equipment</th><th>Quantity</th><th>Reason</th><th>Reference</th><th>Recorded By</th><th></th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="9" className="text-center py-5">Loading expenditures...</td></tr>
              : visibleRecords.length === 0 ? <tr><td colSpan="9" className="text-center py-5 text-secondary">No expenditure records found.</td></tr>
                : visibleRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="fw-semibold">EXP-{String(record.id).padStart(5, "0")}</td>
                    <td>{record.expenditureDate}</td><td>{record.baseName}</td><td>{record.equipmentTypeName}</td>
                    <td className="fw-semibold">{Number(record.quantity).toLocaleString()}</td><td>{record.reason}</td>
                    <td>{record.referenceNumber || "-"}</td><td>{record.recordedBy || "-"}</td>
                    <td><button className="btn btn-sm btn-outline-light" title="View details" onClick={() => setSelectedRecord(record)}><i className="bi bi-eye"></i></button></td>
                  </tr>
                ))}
          </tbody>
        </table></div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered"><div className="modal-content bg-dark text-light border-secondary">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-secondary"><div><h5 className="modal-title">Record Expenditure</h5><small className="text-secondary">Record an inventory reduction</small></div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} disabled={submitting}></button>
              </div>
              <div className="modal-body"><div className="row g-3">
                {form.baseId && availableInventory.length === 0 && (
                  <div className="col-12">
                    <div className="alert alert-warning mb-0">
                      {inventoryForFormBase.length === 0
                        ? "No inventory is recorded for this base. Record a purchase before submitting an expenditure. "
                        : "No unassigned stock is available. Return assigned assets or record a purchase before submitting an expenditure. "}
                      <Link to="/purchases" onClick={() => setShowModal(false)}>Go to Purchases</Link>
                    </div>
                  </div>
                )}
                <div className="col-md-6"><label className="form-label">Base</label>
                  <select className="form-select bg-dark text-light border-secondary" value={form.baseId} disabled={baseScoped} onChange={(event) => setForm((current) => ({ ...current, baseId: event.target.value, equipmentTypeId: "", quantity: "" }))} required>
                    {!baseScoped && <option value="">Select base</option>}
                    {bases.map((base) => <option key={base.id} value={base.id}>{base.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6"><label className="form-label">Equipment Type</label>
                  <select className="form-select bg-dark text-light border-secondary" value={form.equipmentTypeId} onChange={(event) => setForm((current) => ({ ...current, equipmentTypeId: event.target.value }))} required>
                    <option value="">Select equipment</option>{equipmentTypes.filter((equipment) => availableInventory.some((item) => String(item.equipmentTypeId) === String(equipment.id))).map((equipment) => {
                      const stock = availableInventory.find((item) => String(item.equipmentTypeId) === String(equipment.id));
                      return <option key={equipment.id} value={equipment.id}>{equipment.name} ({stock.availableQuantity} available)</option>;
                    })}
                  </select>
                </div>
                <div className="col-md-6"><label className="form-label">Quantity</label>
                  <input type="number" min="1" max={selectedInventory?.availableQuantity} className="form-control bg-dark text-light border-secondary" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} required />
                  {selectedInventory && <small className="text-secondary">Available: {selectedInventory.availableQuantity}</small>}
                </div>
                <div className="col-md-6"><label className="form-label">Expenditure Date</label>
                  <input type="date" className="form-control bg-dark text-light border-secondary" value={form.expenditureDate} onChange={(event) => setForm((current) => ({ ...current, expenditureDate: event.target.value }))} required />
                </div>
                <div className="col-md-6"><label className="form-label">Reason</label>
                  <input className="form-control bg-dark text-light border-secondary" value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} required />
                </div>
                <div className="col-md-6"><label className="form-label">Reference Number</label>
                  <input className="form-control bg-dark text-light border-secondary" value={form.referenceNumber} onChange={(event) => setForm((current) => ({ ...current, referenceNumber: event.target.value }))} />
                </div>
                <div className="col-md-6"><label className="form-label">Personnel / Unit</label>
                  <input className="form-control bg-dark text-light border-secondary" value={form.personnelOrUnit} onChange={(event) => setForm((current) => ({ ...current, personnelOrUnit: event.target.value }))} />
                </div>
                <div className="col-12"><label className="form-label">Remarks</label>
                  <textarea className="form-control bg-dark text-light border-secondary" rows="3" value={form.remarks} onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))}></textarea>
                </div>
              </div></div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Recording..." : "Submit Expenditure"}</button>
              </div>
            </form>
          </div></div>
        </div>
      )}

      {selectedRecord && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered"><div className="modal-content bg-dark text-light border-secondary">
            <div className="modal-header border-secondary"><h5 className="modal-title">Expenditure Details</h5><button className="btn-close btn-close-white" onClick={() => setSelectedRecord(null)}></button></div>
            <div className="modal-body"><dl className="row mb-0">
              <dt className="col-5">Date</dt><dd className="col-7">{selectedRecord.expenditureDate}</dd>
              <dt className="col-5">Base</dt><dd className="col-7">{selectedRecord.baseName}</dd>
              <dt className="col-5">Equipment</dt><dd className="col-7">{selectedRecord.equipmentTypeName}</dd>
              <dt className="col-5">Quantity</dt><dd className="col-7">{selectedRecord.quantity}</dd>
              <dt className="col-5">Reason</dt><dd className="col-7">{selectedRecord.reason}</dd>
              <dt className="col-5">Reference</dt><dd className="col-7">{selectedRecord.referenceNumber || "-"}</dd>
              <dt className="col-5">Personnel / Unit</dt><dd className="col-7">{selectedRecord.personnelOrUnit || "-"}</dd>
              <dt className="col-5">Recorded By</dt><dd className="col-7">{selectedRecord.recordedBy || "-"}</dd>
              <dt className="col-5">Remarks</dt><dd className="col-7">{selectedRecord.remarks || "-"}</dd>
            </dl></div>
            <div className="modal-footer border-secondary"><button className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>Close</button></div>
          </div></div>
        </div>
      )}
    </div>
  );
}

export default Expenditure;
