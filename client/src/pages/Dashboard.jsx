import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashBoardSideBar from "../components/DashBoardSideBar";
import DashBoardProfile from "../components/DashBoardProfile";

function Dashboard() {
  const [tab, setTab] = useState("");
  const location = useLocation();
  useEffect(
    useCallback(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }),
    [location.search]
  );
  return (
    <div className=" min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}
        <DashBoardSideBar />
      </div>

      {/* profile... */}
      {tab === "profile" && <DashBoardProfile />}
    </div>
  );
}

export default Dashboard;
