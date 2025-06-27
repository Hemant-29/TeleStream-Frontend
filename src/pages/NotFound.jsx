import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col items-center w-dvw p-10 pt-20">
          <h1 className="font-bold text-5xl font-mono">404 </h1>
          <h1 className="font-bold text-5xl font-mono text-center">
            Page Not Found
          </h1>
        </div>
      </div>
    </>
  );
};

export default NotFound;
