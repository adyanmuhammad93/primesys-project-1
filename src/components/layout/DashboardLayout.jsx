import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <div className="grow bg-slate-100">
        <div className="mx-auto w-[90%] max-w-7xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
