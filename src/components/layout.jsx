import React, { useState } from "react";
import { Sidebar, Header } from "@components";
import { Outlet } from "react-router-dom";

export const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 bg-bodyBG scroll-hide">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
