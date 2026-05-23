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

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* SORT DROPDOWN */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="
            h-12 px-4 rounded-2xl
            bg-slate-900 border border-slate-700
            text-white outline-none
            hover:border-cyan-500
            transition-all duration-200
          "
        >
          <option value="deadline">
            Sort by Deadline
          </option>

          <option value="status">
            Sort by Status
          </option>
          <option value="title">
            Sort by Title
          </option>
        </select>

        {/* ADD TASK BUTTON */}
        <button
          className="
            h-12 px-5 rounded-2xl
            bg-cyan-500 hover:bg-cyan-400
            text-black font-black
            transition-all duration-200
          "
        >
          + ADD TASK
        </button>

      </div>
    </div>
  );
}