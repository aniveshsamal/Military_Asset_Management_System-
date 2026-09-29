import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../component/sideBar";
import TopNavbar from "../component/topNavBar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-vh-100 bg-black">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className="min-vh-100 d-flex flex-column"
        style={{ marginLeft: "260px" }}
      >
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>

      {/* Responsive sidebar */}
      <style>
        {`
          @media (max-width: 991.98px) {
            aside {
              transform: translateX(-100%);
            }

            aside.translate-sidebar {
              transform: translateX(0);
            }

            .min-vh-100.d-flex.flex-column {
              margin-left: 0 !important;
            }
          }
        `}
      </style>

    </div>
  );
}

export default MainLayout;