import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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

        <Route element={<MainLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/purchases"
            element={<Purchases />}
          />

          <Route
            path="/transfers"
            element={<Transfers />}
          />

          <Route
            path="/assignments"
            element={<Assignments />}
          />

          <Route
            path="/expenditure"
            element={<Expenditure />}
          />

          <Route
            path="/audit-logs"
            element={<AuditLogs />}
          />

          <Route
            path="/users"
            element={<Users />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;