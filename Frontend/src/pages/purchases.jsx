import { useEffect, useMemo, useState } from "react";
import apiRequest from "../services/api";
import { getCurrentUser, isBaseScoped } from "../services/roleAccess";

const emptyForm = {
  baseId: "",
  equipmentTypeId: "",
  quantity: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  supplier: "",
  invoiceNumber: "",
  remarks: "",
};

function Purchases() {
  const user = getCurrentUser();
  const baseScoped = isBaseScoped(user);
  const assignedBaseId = user.baseId == null ? "" : String(user.baseId);
  const [purchases, setPurchases] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    baseId: baseScoped ? assignedBaseId : "",
    equipmentTypeId: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "",
    endDate: "",
    baseId: baseScoped ? assignedBaseId : "",
    equipmentTypeId: "",
  });

  const [form, setForm] = useState({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "" });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // --------------------------------------------------
  // Load bases and equipment types
  // --------------------------------------------------

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      setError("");

      const [basesData, equipmentData] = await Promise.all([
        apiRequest("/bases"),
        apiRequest("/equipment-types"),
      ]);

      setBases(basesData);
      setEquipmentTypes(equipmentData);
    } catch (err) {
      setError(err.message || "Failed to load reference data");
    }
  };

  // --------------------------------------------------
  // Load purchases
  // --------------------------------------------------

  useEffect(() => {
    loadPurchases(appliedFilters);
  }, [appliedFilters]);

  const loadPurchases = async (filterValues = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set(
        "startDate",
        filterValues.startDate || "1970-01-01"
      );
      params.set(
        "endDate",
        filterValues.endDate || new Date().toISOString().split("T")[0]
      );

      if (filterValues.baseId) {
        params.append("baseId", filterValues.baseId);
      }

      if (filterValues.equipmentTypeId) {
        params.append(
          "equipmentTypeId",
          filterValues.equipmentTypeId
        );
      }

      const queryString = params.toString();

      const query = queryString ? `?${queryString}` : "";
      const data = await apiRequest(`/purchases${query}`);

      setPurchases(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || "Failed to load purchase history");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Filter handlers
  // --------------------------------------------------

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      setError("From date cannot be after To date.");
      return;
    }

    setError("");
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      startDate: "",
      endDate: "",
      baseId: baseScoped ? assignedBaseId : "",
      equipmentTypeId: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setError("");
  };

  // --------------------------------------------------
  // Purchase form
  // --------------------------------------------------

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setError("");
    setSuccess("");

    setForm({
      ...emptyForm,
      baseId: baseScoped ? assignedBaseId : "",
      purchaseDate: new Date().toISOString().split("T")[0],
    });

    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (submitting) {
      return;
    }

    setShowModal(false);
    setForm({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "" });
  };

  const handleSubmitPurchase = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.baseId) {
      setError("Please select a base.");
      return;
    }

    if (!form.equipmentTypeId) {
      setError("Please select an equipment type.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (!form.purchaseDate) {
      setError("Please select a purchase date.");
      return;
    }

    try {
      setSubmitting(true);

      const requestBody = {
        baseId: Number(form.baseId),
        equipmentTypeId: Number(form.equipmentTypeId),
        quantity: Number(form.quantity),
        purchaseDate: form.purchaseDate,
        supplier: form.supplier.trim() || null,
        invoiceNumber: form.invoiceNumber.trim() || null,
        remarks: form.remarks.trim() || null,
      };

      await apiRequest("/purchases", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      setShowModal(false);
      setForm({ ...emptyForm, baseId: baseScoped ? assignedBaseId : "" });

      setSuccess("Purchase recorded successfully.");

      await loadPurchases(appliedFilters);
    } catch (err) {
      setError(
        err.message || "Failed to record purchase"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Summary calculations
  // --------------------------------------------------

  const totalQuantity = useMemo(() => {
    return purchases.reduce(
      (total, purchase) =>
        total + Number(purchase.quantity || 0),
      0
    );
  }, [purchases]);

  const purchaseRecordCount = purchases.length;

  const currentMonthQuantity = useMemo(() => {
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return purchases.reduce((total, purchase) => {
      if (!purchase.purchaseDate) {
        return total;
      }

      const date = new Date(
        `${purchase.purchaseDate}T00:00:00`
      );

      if (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth
      ) {
        return total + Number(purchase.quantity || 0);
      }

      return total;
    }, 0);
  }, [purchases]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(purchases.length / recordsPerPage)
  );

  const paginatedPurchases = useMemo(() => {
    const startIndex =
      (currentPage - 1) * recordsPerPage;

    return purchases.slice(
      startIndex,
      startIndex + recordsPerPage
    );
  }, [purchases, currentPage]);

  const startRecord =
    purchases.length === 0
      ? 0
      : (currentPage - 1) * recordsPerPage + 1;

  const endRecord = Math.min(
    currentPage * recordsPerPage,
    purchases.length
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // --------------------------------------------------
  // Export
  // --------------------------------------------------

  const handleExport = async () => {
    if (purchases.length === 0) {
      setError("There are no purchase records to export.");
      return;
    }

    try {
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Military Asset Management System";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Purchase History", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      worksheet.columns = [
        { header: "Purchase ID", key: "purchaseId", width: 18 },
        { header: "Purchase Date", key: "purchaseDate", width: 18 },
        { header: "Base", key: "base", width: 26 },
        { header: "Equipment Type", key: "equipment", width: 30 },
        { header: "Quantity", key: "quantity", width: 14 },
        { header: "Supplier", key: "supplier", width: 28 },
        { header: "Invoice / Reference", key: "reference", width: 24 },
        { header: "Recorded By", key: "createdBy", width: 24 },
      ];

      worksheet.addRows(purchases.map((purchase) => ({
        purchaseId: `PUR-${String(purchase.id).padStart(5, "0")}`,
        purchaseDate: purchase.purchaseDate
          ? new Date(`${purchase.purchaseDate}T00:00:00`)
          : null,
        base: purchase.baseName || "",
        equipment: purchase.equipmentTypeName || "",
        quantity: Number(purchase.quantity || 0),
        supplier: purchase.supplier || "",
        reference: purchase.invoiceNumber || "",
        createdBy: purchase.createdBy || "",
      })));

      worksheet.autoFilter = {
        from: "A1",
        to: `H${purchases.length + 1}`,
      };
      worksheet.getRow(1).height = 24;
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF244A64" },
        };
        cell.alignment = { vertical: "middle" };
      });
      worksheet.getColumn("purchaseDate").numFmt = "dd mmm yyyy";
      worksheet.getColumn("quantity").numFmt = "#,##0";

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "purchase-history.xlsx";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Unable to create the Excel purchase export.");
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1">Purchases</h3>
          <p className="text-secondary mb-0">
            Manage and track asset purchases
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={handleExport}
          >
            <i className="bi bi-download me-2"></i>
            Export
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenModal}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Record Purchase
          </button>
        </div>
      </div>

      {/* Alerts */}

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}

          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {success}

          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {/* Summary Cards */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="text-secondary small">
                Total Purchased Quantity
              </div>

              <div className="fs-3 fw-semibold mt-2 text-white">
                {totalQuantity.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="text-secondary small">
                Purchase Records
              </div>

              <div className="fs-3 fw-semibold mt-2 text-white">
                {purchaseRecordCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <div className="text-secondary small">
                Current Month Quantity
              </div>

              <div className="fs-3 fw-semibold mt-2 text-white">
                {currentMonthQuantity.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Filters */}

      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body">

          <div className="row g-3 align-items-end">

            <div className="col-md-3">
              <label className="form-label">
                From Date
              </label>

              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">
                To Date
              </label>

              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">
                Base
              </label>

              <select
                className="form-select bg-dark text-light border-secondary"
                name="baseId"
                value={filters.baseId}
                onChange={handleFilterChange}
                disabled={baseScoped}
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

            <div className="col-md-2">
              <label className="form-label">
                Equipment Type
              </label>

              <select
                className="form-select bg-dark text-light border-secondary"
                name="equipmentTypeId"
                value={filters.equipmentTypeId}
                onChange={handleFilterChange}
              >
                <option value="">
                  All Equipment
                </option>

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

            <div className="col-md-2 d-flex gap-2">

              <button
                type="button"
                className="btn btn-primary flex-grow-1"
                onClick={handleApplyFilters}
              >
                Apply
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleResetFilters}
                title="Reset filters"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* Purchase History */}

      <div className="card bg-dark border-secondary">

        <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">
              Purchase History
            </h5>

            <small className="text-secondary">
              All recorded asset purchases
            </small>
          </div>

          {!loading && (
            <span className="text-secondary small">
              {purchases.length} record
              {purchases.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-dark table-hover mb-0 align-middle">

              <thead>
                <tr>
                  <th>Purchase ID</th>
                  <th>Date</th>
                  <th>Base</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th>Reference</th>
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5"
                    >
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></div>

                      Loading purchases...
                    </td>
                  </tr>
                ) : paginatedPurchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5 text-secondary"
                    >
                      No purchase records found.
                    </td>
                  </tr>
                ) : (
                  paginatedPurchases.map((purchase) => (
                    <tr key={purchase.id}>

                      <td>
                        <span className="fw-semibold">
                          PUR-{String(purchase.id).padStart(5, "0")}
                        </span>
                      </td>

                      <td>
                        {purchase.purchaseDate || "-"}
                      </td>

                      <td>
                        {purchase.baseName || "-"}
                      </td>

                      <td>
                        {purchase.equipmentTypeName || "-"}
                      </td>

                      <td>
                        {Number(
                          purchase.quantity || 0
                        ).toLocaleString()}
                      </td>

                      <td>
                        {purchase.supplier || "-"}
                      </td>

                      <td>
                        {purchase.invoiceNumber || "-"}
                      </td>

                      <td>
                        {purchase.createdBy || "-"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          title="View purchase details"
                          onClick={() => {
                            window.alert(
                              purchase.remarks
                                ? `Remarks: ${purchase.remarks}`
                                : "No additional remarks."
                            );
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Pagination */}

        {!loading && purchases.length > 0 && (
          <div className="card-footer bg-transparent border-secondary d-flex justify-content-between align-items-center">

            <small className="text-secondary">
              Showing {startRecord}–{endRecord} of{" "}
              {purchases.length} records
            </small>

            <nav>
              <ul className="pagination pagination-sm mb-0">

                <li
                  className={`page-item ${
                    currentPage === 1
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link bg-dark text-light border-secondary"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                  >
                    Previous
                  </button>
                </li>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link bg-dark text-light border-secondary"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link bg-dark text-light border-secondary"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                  >
                    Next
                  </button>
                </li>

              </ul>
            </nav>

          </div>
        )}

      </div>

      {/* Record Purchase Modal */}

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >

            <div className="modal-content bg-dark text-light border-secondary">

              <div className="modal-header border-secondary">

                <div>
                  <h5 className="modal-title">
                    Record Purchase
                  </h5>

                  <small className="text-secondary">
                    Add a new asset purchase
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  disabled={submitting}
                ></button>

              </div>

              <form onSubmit={handleSubmitPurchase}>

                <div className="modal-body">

                  <div className="row g-3">

                    {/* Base */}

                    <div className="col-md-6">
                      <label className="form-label">
                        Base{" "}
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <select
                        className="form-select bg-dark text-light border-secondary"
                        name="baseId"
                        value={form.baseId}
                        onChange={handleFormChange}
                        disabled={baseScoped}
                        required
                      >
                        {!baseScoped && <option value="">Select Base</option>}

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

                    {/* Equipment */}

                    <div className="col-md-6">
                      <label className="form-label">
                        Equipment Type{" "}
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <select
                        className="form-select bg-dark text-light border-secondary"
                        name="equipmentTypeId"
                        value={form.equipmentTypeId}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">
                          Select Equipment
                        </option>

                        {equipmentTypes.map(
                          (equipment) => (
                            <option
                              key={equipment.id}
                              value={equipment.id}
                            >
                              {equipment.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Quantity */}

                    <div className="col-md-6">
                      <label className="form-label">
                        Quantity{" "}
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary"
                        name="quantity"
                        min="1"
                        value={form.quantity}
                        onChange={handleFormChange}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>

                    {/* Purchase Date */}

                    <div className="col-md-6">
                      <label className="form-label">
                        Purchase Date{" "}
                        <span className="text-danger">
                          *
                        </span>
                      </label>

                      <input
                        type="date"
                        className="form-control bg-dark text-light border-secondary"
                        name="purchaseDate"
                        value={form.purchaseDate}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    {/* Supplier */}

                    <div className="col-md-6">
                      <label className="form-label">
                        Supplier
                      </label>

                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        name="supplier"
                        value={form.supplier}
                        onChange={handleFormChange}
                        placeholder="Enter supplier name"
                      />
                    </div>

                    {/* Invoice */}

                    <div className="col-md-6">
                      <label className="form-label">
                        Invoice / Reference Number
                      </label>

                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        name="invoiceNumber"
                        value={form.invoiceNumber}
                        onChange={handleFormChange}
                        placeholder="Enter invoice/reference"
                      />
                    </div>

                    {/* Remarks */}

                    <div className="col-12">
                      <label className="form-label">
                        Remarks
                      </label>

                      <textarea
                        className="form-control bg-dark text-light border-secondary"
                        name="remarks"
                        rows="3"
                        value={form.remarks}
                        onChange={handleFormChange}
                        placeholder="Enter additional remarks"
                      ></textarea>
                    </div>

                    {/* Information */}

                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        Recording this purchase will automatically
                        increase the inventory quantity for the
                        selected base and equipment type.
                      </div>
                    </div>

                  </div>

                </div>

                <div className="modal-footer border-secondary">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Recording...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Record Purchase
                      </>
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Purchases;