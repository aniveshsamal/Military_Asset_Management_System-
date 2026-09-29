import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./component/login";
import MainLayout from "./layouts/mainLayout";
import Dashboard from "./pages/dashboard";
import Purchases from "./pages/purchases";
import Transfers from "./pages/transfers";
import Assignments from "./pages/assignments";
import Expenditure from "./pages/expenditure";
import AuditLogs from "./pages/auditLogs";
import Users from "./pages/users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/expenditure" element={<Expenditure />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/users" element={<Users />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
