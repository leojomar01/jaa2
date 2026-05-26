import React from "react";

export default function DashboardHeader({
  sortBy,
  setSortBy,
}) {
  return (
    <div className="mb-8 flex items-center justify-between flex-wrap gap-4">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-4xl font-black text-white">
          TASK DASHBOARD
        </h1>

        <p className="text-slate-400 mt-2">
          Production Monitoring System
        </p>
      </div>

     
    </div>
  );
}