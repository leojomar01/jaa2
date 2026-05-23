import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import DashboardHeader from "../Components/DashboardHeader";

import TaskCard from "../Components/TaskCard";

import CreateTaskForm from "../Components/CreateTaskForm";

export default function TaskDashboard() {

  // =========================
  // SORT STATE
  // =========================
  const [sortBy, setSortBy] =
    useState("deadline");

  // =========================
  // TASKS
  // =========================
  const [tasks, setTasks] =
    useState([]);
 const API_URL =
  process.env.REACT_APP_API_URL;

  // =========================
  // SHOW CREATE MODAL
  // =========================
  const [showCreate, setShowCreate] =
    useState(false);

  // =========================
  // FETCH TASKS
  // =========================
  const fetchTasks = useCallback(async () => {
    try {

      const response =
        await fetch(
          `${API_URL}/api/tasks`
        );

      const data =
        await response.json();

      setTasks(data);

    } catch (error) {

      console.error(
        "GET TASKS ERROR:",
        error
      );

    }
    },
  [API_URL,]
);

  // =========================
  // LOAD TASKS
  // =========================
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // =========================
  // SORT TASKS
  // =========================
  const sortedTasks =
    [...tasks].sort((a, b) => {

      // DEADLINE
      if (
        sortBy === "deadline"
      ) {
        return (
          new Date(a.deadline) -
          new Date(b.deadline)
        );
      }

      // CUSTOMER
      if (sortBy === "customer") {
        return a.customer.localeCompare(
          b.customer
        );
      }

      // STATUS
      if (sortBy === "status") {
        return a.status.localeCompare(
          b.status
        );
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 p-6 relative">


    <ToastContainer
      position="bottom-right"
      autoClose={1000}
      newestOnTop
      theme="dark"
      style={{
        zIndex: 999999,
      }}
    />

      {/* HEADER */}
      <DashboardHeader
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* TOP ACTIONS */}
      <div className="flex gap-4 mb-6">

        {/* REFRESH */}
        <button
          onClick={fetchTasks}
          className="
            px-5 py-3 rounded-2xl
            bg-cyan-500 hover:bg-cyan-400
            text-black font-black
            transition-all duration-200
          "
        >
          REFRESH TASKS
        </button>

        {/* ADD TASK */}
        <button
          onClick={() =>
            setShowCreate(true)
          }
          className="
            px-5 py-3 rounded-2xl
            bg-green-500 hover:bg-green-400
            text-black font-black
            transition-all duration-200
          "
        >
          ADD TASK
        </button>

      </div>

      {/* TASK GRID */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {sortedTasks.map(
          (task, index) => (
            <TaskCard
              key={
                task._id || index
              }
              task={task}
            />
          )
        )}

      </div>

      {/* CREATE TASK MODAL */}
      {showCreate && (

        <div className="
          fixed inset-0
          bg-black/70
          backdrop-blur-sm
          flex items-center
          justify-center
          z-50
          p-4
        ">

          <div className="
            relative
            w-full
            max-w-3xl
          ">

            {/* CLOSE BUTTON */}
            <button
              onClick={() =>
                setShowCreate(false)
              }
              className="
                absolute
                -top-4
                -right-4
                w-12
                h-12
                rounded-full
                bg-red-500
                hover:bg-red-400
                text-white
                font-black
                text-xl
                z-50
              "
            >
              ✕
            </button>

            {/* FORM */}
            <CreateTaskForm />

          </div>

        </div>
      )}

    </div>
  );
}