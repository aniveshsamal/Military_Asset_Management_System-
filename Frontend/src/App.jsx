import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import Login from "./component/login";
import MainLayout from "./layouts/mainLayout";
import Dashboard from "./pages/dashboard";
import Purchases from "./pages/purchases";
import Transfers from "./pages/transfers";
import Assignments from "./pages/assignments";
import Expenditure from "./pages/expenditure";
import AuditLogs from "./pages/auditLogs";
import Users from "./pages/users";
import EquipmentTypes from "./pages/equipmentTypes";
import { getCurrentUser, getRoleHome, ROLE_ACCESS } from "./services/roleAccess";

function ProtectedRoute() {
  const location = useLocation();
  const user = getCurrentUser();
  const allowedPaths = ROLE_ACCESS[user.role] || [];

  if (!localStorage.getItem("token")) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return allowedPaths.includes(location.pathname)
    ? <Outlet />
    : <Navigate to={getRoleHome(user.role)} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/expenditure" element={<Expenditure />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/users" element={<Users />} />
            <Route path="/equipment-types" element={<EquipmentTypes />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
