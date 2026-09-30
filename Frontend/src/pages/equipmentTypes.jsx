import { useEffect, useState } from "react";
import apiRequest from "../services/api";

const emptyForm = { name: "", description: "" };

function EquipmentTypes() {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isCurrent = true;

    apiRequest("/equipment-types")
      .then((data) => {
        if (isCurrent) setEquipmentTypes(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [refreshKey]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await apiRequest("/equipment-types", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
        }),
      });
      setForm(emptyForm);
      setSuccess("Equipment type created successfully.");
      setLoading(true);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="text-white fw-bold mb-1"><i className="bi bi-tags me-2"></i>Equipment Types</h3>
        <p className="text-secondary mb-0">Manage the catalog used by purchases, transfers, assignments, and expenditures.</p>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="status">{success}</div>}

      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <section className="card bg-dark border-secondary h-100">
            <div className="card-header bg-transparent border-secondary">
              <h5 className="text-white text-center mb-0">Add Equipment Type</h5>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label" htmlFor="equipment-name">Name</label>
                  <input
                    id="equipment-name"
                    className="form-control bg-black text-light border-secondary"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="equipment-description">Description</label>
                  <textarea
                    id="equipment-description"
                    className="form-control bg-black text-light border-secondary"
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={4}
                    maxLength={500}
                  />
                </div>
              </div>
              <div className="card-footer bg-transparent border-secondary text-end">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <i className="bi bi-plus-lg me-2"></i>{submitting ? "Creating..." : "Create Type"}
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="col-12 col-xl-8">
          <section className="card bg-dark border-secondary">
            <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <div><h5 className="mb-1">Equipment Catalog</h5><small className="text-secondary">Available equipment types</small></div>
              {!loading && <span className="text-secondary small">{equipmentTypes.length} types</span>}
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead><tr><th>Name</th><th>Description</th><th>Status</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3" className="text-center py-5">Loading equipment types...</td></tr>
                  ) : equipmentTypes.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-5 text-secondary">No equipment types found.</td></tr>
                  ) : equipmentTypes.map((equipment) => (
                    <tr key={equipment.id}>
                      <td className="fw-semibold">{equipment.name}</td>
                      <td>{equipment.description || "-"}</td>
                      <td><span className={`badge ${equipment.active ? "text-bg-success" : "text-bg-secondary"}`}>{equipment.active ? "Active" : "Inactive"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EquipmentTypes;