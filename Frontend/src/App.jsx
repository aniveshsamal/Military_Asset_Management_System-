import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/mainLayout";
import Dashboard from "./pages/dashboard";
import Purchases from "./pages/purchases";

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