import { useEffect, useMemo, useState } from "react";
import apiRequest from "../services/api";

const emptyFilters = { startDate: "", endDate: "", action: "", status: "" };
const today = new Date().toISOString().slice(0, 10);

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/audit-logs")
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleLogs = useMemo(() => logs.filter((log) => {
    const eventDate = log.timestamp?.slice(0, 10) || "";
    return (!filters.startDate || eventDate >= filters.startDate)
      && (!filters.endDate || eventDate <= filters.endDate)
      && (!filters.action || log.action === filters.action)
      && (!filters.status || log.status === filters.status);
  }), [logs, filters]);

  const todayCount = logs.filter((log) => log.timestamp?.slice(0, 10) === today).length;
  const successfulCount = logs.filter((log) => log.status === "SUCCESS").length;
  const failedCount = logs.filter((log) => log.status === "FAILED").length;
  const actions = [...new Set(logs.map((log) => log.action).filter(Boolean))];
  const statuses = [...new Set(logs.map((log) => log.status).filter(Boolean))];

  const actionBadge = (action = "") => {
    if (action.includes("PURCHASE")) return "badge text-bg-primary";
    if (action.includes("TRANSFER")) return "badge text-bg-info";
    if (action.includes("ASSIGNMENT")) return "badge text-bg-success";
    if (action.includes("EXPENDITURE")) return "badge text-bg-danger";
    return "badge text-bg-secondary";
  };

  const exportLogs = () => {
    if (visibleLogs.length === 0) return;
    const headers = ["Timestamp", "User", "Action", "Entity", "Entity ID", "Base", "Status", "Details"];
    const rows = visibleLogs.map((log) => [
      log.timestamp,
      log.userName,
      log.action,
      log.entityType,
      log.entityId,
      log.baseName,
      log.status,
      log.details,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1"><i className="bi bi-journal-text me-2"></i>Audit Logs</h3>
          <p className="text-secondary mb-0">Track system activity and operational transactions.</p>
        </div>
        <button className="btn btn-outline-light" onClick={exportLogs} disabled={visibleLogs.length === 0}>
          <i className="bi bi-download me-2"></i>Export Logs
        </button>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3"><div className="card bg-dark border-secondary h-100"><div className="card-body"><small className="text-secondary">Total Events</small><h3 className="fw-bold mt-2 mb-0 text-white">{logs.length.toLocaleString()}</h3></div></div></div>
        <div className="col-12 col-sm-6 col-xl-3"><div className="card bg-dark border-secondary h-100"><div className="card-body"><small className="text-secondary">Today's Events</small><h3 className="fw-bold mt-2 mb-0 text-white">{todayCount.toLocaleString()}</h3></div></div></div>
        <div className="col-12 col-sm-6 col-xl-3"><div className="card bg-dark border-secondary h-100"><div className="card-body"><small className="text-secondary">Successful</small><h3 className="fw-bold mt-2 mb-0 text-white">{successfulCount.toLocaleString()}</h3></div></div></div>
        <div className="col-12 col-sm-6 col-xl-3"><div className="card bg-dark border-secondary h-100"><div className="card-body"><small className="text-secondary">Failed</small><h3 className="fw-bold mt-2 mb-0 text-white">{failedCount.toLocaleString()}</h3></div></div></div>
      </div>

      <div className="card bg-dark border-secondary mb-4"><div className="card-body">
        <div className="row g-3">
          <div className="col-12 col-md-3"><label className="form-label text-secondary">From Date</label><input type="date" className="form-control bg-dark text-light border-secondary" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} /></div>
          <div className="col-12 col-md-3"><label className="form-label text-secondary">To Date</label><input type="date" className="form-control bg-dark text-light border-secondary" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} /></div>
          <div className="col-12 col-md-3"><label className="form-label text-secondary">Action</label>
            <select className="form-select bg-dark text-light border-secondary" value={filters.action} onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value }))}>
              <option value="">All Actions</option>{actions.map((action) => <option key={action} value={action}>{action}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-3"><label className="form-label text-secondary">Status</label>
            <select className="form-select bg-dark text-light border-secondary" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All Statuses</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </div></div>

      <div className="card bg-dark border-secondary">
        <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
          <div><h5 className="mb-1 fw-semibold">Activity History</h5><small className="text-secondary">Immutable record of system and transaction activity</small></div>
          {!loading && <span className="text-secondary small">{visibleLogs.length} events</span>}
        </div>
        <div className="table-responsive"><table className="table table-dark table-hover align-middle mb-0">
          <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>Base</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="8" className="text-center py-5">Loading audit events...</td></tr>
              : visibleLogs.length === 0 ? <tr><td colSpan="8" className="text-center py-5 text-secondary">No audit events found.</td></tr>
                : visibleLogs.map((log) => (
                  <tr key={log.id}>
                    <td><div className="fw-semibold">{log.timestamp?.replace("T", " ") || "-"}</div></td>
                    <td>{log.userName || "System"}</td>
                    <td><span className={actionBadge(log.action)}>{log.action}</span></td>
                    <td>{log.entityType || "-"}</td><td>{log.entityId ?? "-"}</td><td>{log.baseName || "-"}</td>
                    <td><span className={`badge ${log.status === "SUCCESS" ? "text-bg-success" : "text-bg-danger"}`}>{log.status || "-"}</span></td>
                    <td><button className="btn btn-sm btn-outline-light" title="View event" onClick={() => setSelectedLog(log)}><i className="bi bi-eye"></i></button></td>
                  </tr>
                ))}
          </tbody>
        </table></div>
      </div>

      {selectedLog && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered"><div className="modal-content bg-dark text-light border-secondary">
            <div className="modal-header border-secondary"><div><h5 className="modal-title">Audit Event Details</h5><small className="text-secondary">Event {selectedLog.id}</small></div><button className="btn-close btn-close-white" onClick={() => setSelectedLog(null)}></button></div>
            <div className="modal-body"><dl className="row mb-0">
              <dt className="col-md-3">Timestamp</dt><dd className="col-md-9">{selectedLog.timestamp?.replace("T", " ") || "-"}</dd>
              <dt className="col-md-3">User</dt><dd className="col-md-9">{selectedLog.userName || "System"}</dd>
              <dt className="col-md-3">Action</dt><dd className="col-md-9"><span className={actionBadge(selectedLog.action)}>{selectedLog.action}</span></dd>
              <dt className="col-md-3">Entity</dt><dd className="col-md-9">{selectedLog.entityType || "-"} {selectedLog.entityId ?? ""}</dd>
              <dt className="col-md-3">Base</dt><dd className="col-md-9">{selectedLog.baseName || "-"}</dd>
              <dt className="col-md-3">Status</dt><dd className="col-md-9">{selectedLog.status || "-"}</dd>
              <dt className="col-md-3">Details</dt><dd className="col-md-9 text-break">{selectedLog.details || "-"}</dd>
            </dl></div>
            <div className="modal-footer border-secondary"><button className="btn btn-secondary" onClick={() => setSelectedLog(null)}>Close</button></div>
          </div></div>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
