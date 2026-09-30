
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";
import { getRoleHome } from "../services/roleAccess";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
          baseId: data.baseId,
        })
      );

      navigate(getRoleHome(data.role), { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-light">
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">

          {/* Left Section */}
          <div className="col-lg-7 d-none d-lg-flex flex-column justify-content-center p-5 bg-dark">

            <div className="mb-5">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="bg-primary rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-shield-check fs-3"></i>
                </div>

                <div>
                  <h4 className="mb-0 fw-bold">
                    Military Asset Management
                  </h4>

                  <small className="text-secondary">
                    Secure Logistics Platform
                  </small>
                </div>
              </div>

              <h1 className="display-4 fw-bold mb-4">
                Manage assets.
                <br />
                <span className="text-primary">
                  Maintain readiness.
                </span>
              </h1>

              <p
                className="text-secondary fs-5"
                style={{ maxWidth: "600px" }}
              >
                A centralized platform for managing military assets,
                purchases, transfers, assignments, and expenditures
                across multiple bases.
              </p>
            </div>

            {/* Features */}
            <div
              className="row g-3"
              style={{ maxWidth: "650px" }}
            >
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-primary">
                    <i className="bi bi-box-seam fs-4"></i>
                  </div>

                  <div>
                    <div className="fw-semibold">
                      Asset Management
                    </div>

                    <small className="text-secondary">
                      Track assets and inventory
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-primary">
                    <i className="bi bi-arrow-left-right fs-4"></i>
                  </div>

                  <div>
                    <div className="fw-semibold">
                      Base Transfers
                    </div>

                    <small className="text-secondary">
                      Manage inter-base movements
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-primary">
                    <i className="bi bi-person-check fs-4"></i>
                  </div>

                  <div>
                    <div className="fw-semibold">
                      Assignments
                    </div>

                    <small className="text-secondary">
                      Track personnel assignments
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-primary">
                    <i className="bi bi-journal-text fs-4"></i>
                  </div>

                  <div>
                    <div className="fw-semibold">
                      Audit Logging
                    </div>

                    <small className="text-secondary">
                      Maintain complete activity records
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 text-secondary small">
              <i className="bi bi-shield-lock me-2"></i>
              Secure role-based access control
            </div>
          </div>

          {/* Right Login Section */}
          <div className="col-lg-5 d-flex align-items-center justify-content-center bg-black p-4">

            <div
              className="w-100"
              style={{ maxWidth: "440px" }}
            >

              {/* Mobile Brand */}
              <div className="d-lg-none text-center mb-5">
                <div
                  className="bg-primary rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "55px", height: "55px" }}
                >
                  <i className="bi bi-shield-check fs-3"></i>
                </div>

                <h4 className="fw-bold mb-1">
                  Military Asset Management
                </h4>

                <p className="text-secondary mb-0">
                  Secure Logistics Platform
                </p>
              </div>

              {/* Login Card */}
              <div className="card bg-dark border-secondary shadow-lg">
                <div className="card-body p-4 p-md-5">

                  <div className="mb-4">
                    <span className="badge bg-primary bg-opacity-25 text-primary mb-3 px-3 py-2">
                      <i className="bi bi-lock-fill me-2"></i>
                      Secure Login
                    </span>

                    <h2 className="fw-bold mb-2">
                      Welcome back
                    </h2>

                    <p className="text-secondary mb-0">
                      Sign in to access the asset management system.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      className="alert alert-danger py-2"
                      role="alert"
                    >
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label text-light">
                        Email address
                      </label>

                      <div className="input-group">
                        <span className="input-group-text bg-black border-secondary text-secondary">
                          <i className="bi bi-envelope"></i>
                        </span>

                        <input
                          type="email"
                          className="form-control bg-black text-light border-secondary"
                          placeholder="name@organization.com"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <label className="form-label text-light">
                        Password
                      </label>

                      <div className="input-group">
                        <span className="input-group-text bg-black border-secondary text-secondary">
                          <i className="bi bi-key"></i>
                        </span>

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          className="form-control bg-black text-light border-secondary"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          required
                        />

                        <button
                          type="button"
                          className="btn btn-dark border border-secondary text-secondary"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                        >
                          <i
                            className={
                              showPassword
                                ? "bi bi-eye-slash"
                                : "bi bi-eye"
                            }
                          ></i>
                        </button>
                      </div>
                    </div>

                    {/* Remember */}
                    <div className="d-flex justify-content-between align-items-center mb-4">

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) =>
                            setRememberMe(
                              e.target.checked
                            )
                          }
                        />

                        <label
                          className="form-check-label text-secondary"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>

                    </div>

                    {/* Sign In */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <i className="bi bi-arrow-right ms-2"></i>
                        </>
                      )}
                    </button>

                  </form>

                  {/* Security Information */}
                  <div className="border-top border-secondary mt-4 pt-4">
                    <div className="d-flex gap-3">
                      <i className="bi bi-shield-lock text-primary fs-5"></i>

                      <div>
                        <small className="text-light d-block fw-semibold">
                          Protected Access
                        </small>

                        <small className="text-secondary">
                          Your account is protected by role-based
                          access control.
                        </small>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <p className="text-center text-secondary small mt-4 mb-0">
                © 2026 Military Asset Management System
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
