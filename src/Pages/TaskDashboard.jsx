import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import DashboardHeader from "../Components/DashboardHeader";
import TaskCard from "../Components/TaskCard";
import CreateTaskForm from "../Components/CreateTaskForm";
  // =========================
  // STATUS ORDER
  // =========================
  const statusOrder = [
    "LAYOUT",
    "PRINTING",
    "SEWING",
    "CHECKING",
    "COMPLETE",
  ];

export default function TaskDashboard() {

  // =========================
  // API URL
  // =========================
  const API_URL =
    process.env.REACT_APP_API_URL;

  // =========================
  // TASKS
  // =========================
  const [tasks, setTasks] =
    useState([]);

  // =========================
  // LOADING
  // =========================
  const [loading, setLoading] =
    useState(false);

  // =========================
  // SHOW CREATE MODAL
  // =========================
  const [showCreate, setShowCreate] =
    useState(false);

  // =========================
  // SORT STATE
  // =========================
  const [sortBy, setSortBy] =
    useState("date");



  // =========================
  // FETCH TASKS
  // =========================
  const fetchTasks =
    useCallback(async () => {

      try {

        setLoading(true);

        const response =
          await fetch(
            `${API_URL}/api/tasks`
          );

        const data =
          await response.json();

        setTasks(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "GET TASKS ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }
    },
    [API_URL]
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
    useMemo(() => {

      const copiedTasks =
        [...tasks];

      return copiedTasks.sort(
        (a, b) => {

          // =========================
          // SORT BY DATE
          // =========================
         if (
  sortBy === "date"
) {

  return (
    new Date(
      b?.createdAt || 0
    ) -
    new Date(
      a?.createdAt || 0
    )
  );
}

          // =========================
          // SORT BY TITLE
          // =========================
          if (
            sortBy === "title"
          ) {

            return (
              a?.customer || ""
            ).localeCompare(
              b?.customer || ""
            );
          }

          // =========================
          // SORT BY STATUS
          // =========================
          if (
            sortBy === "status"
          ) {

            const statusA =
              statusOrder.indexOf(
                (
                  a?.status || ""
                ).toUpperCase()
              );

            const statusB =
              statusOrder.indexOf(
                (
                  b?.status || ""
                ).toUpperCase()
              );

            return (
              statusA - statusB
            );
          }

          return 0;
        }
      );

    }, [tasks, sortBy]);

  return (

    <div
      className="
        min-h-screen
        bg-slate-950
        p-6
        relative
      "
    >

      {/* TOAST */}
      <ToastContainer
        position="bottom-right"
        autoClose={500}
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
      <div
        className="
          flex
          flex-wrap
          gap-4
          mb-6
          items-center
        "
      >

        {/* REFRESH */}
        <button
          onClick={fetchTasks}
          disabled={loading}
          className={`
            px-5
            py-3
            rounded-2xl
            text-black
            font-black
            transition-all
            duration-200

            ${
              loading
                ? `
                  bg-slate-500
                  cursor-not-allowed
                `
                : `
                  bg-cyan-500
                  hover:bg-cyan-400
                `
            }
          `}
        >
          {loading
            ? "LOADING..."
            : "REFRESH TASKS"}
        </button>

        {/* ADD TASK */}
        <button
          onClick={() =>
            setShowCreate(
              true
            )
          }
          className="
            px-5
            py-3
            rounded-2xl
            bg-green-500
            hover:bg-green-400
            text-black
            font-black
            transition-all
            duration-200
          "
        >
          ADD TASK
        </button>

        {/* SORT */}
        <div
          className="
            flex
            items-center
            gap-3
            ml-auto
          "
        >

          <span
            className="
              text-slate-300
              font-bold
              uppercase
            "
          >
            SORT BY
          </span>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-700
              text-white
              px-4
              py-3
              rounded-2xl
              outline-none
              focus:border-cyan-400
              font-bold
            "
          >

            <option value="date">
              DATE
            </option>

            <option value="title">
              TITLE
            </option>

            <option value="status">
              STATUS
            </option>

          </select>

        </div>

      </div>

      {/* EMPTY */}
      {!loading &&
        sortedTasks.length === 0 && (

        <div
          className="
            w-full
            py-24
            flex
            items-center
            justify-center
            text-slate-500
            text-2xl
            font-black
          "
        >
          NO TASKS FOUND
        </div>
      )}

      {/* TASK GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {sortedTasks.map(
          (task, index) => (

            <TaskCard
              key={
                task?._id ||
                index
              }
              task={task}
            />

          )
        )}

      </div>

      {/* CREATE TASK MODAL */}
      {showCreate && (

        <div
          className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >

          <div
            className="
              relative
              w-full
              max-w-3xl
            "
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() =>
                setShowCreate(
                  false
                )
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