import React, { useState } from "react";
import TaskTimeline from "./TaskTimeline";
import StatusModal from "./StatusModal";
import PlayerSizeTable from "./PlayerSizeTable";
import { toast } from "react-toastify";

export default function TaskCard({
  task,
}) {

  // =========================
  // STATUS STATE
  // =========================
  const [currentStep, setCurrentStep] =
    useState(task.status);

  const [showModal, setShowModal] =
    useState(false);

  // =========================
  // IMAGE ZOOM
  // =========================
  const [zoomImage, setZoomImage] =
    useState(false);

  // =========================
  // PLAYER TABLE
  // =========================
  const [
    showPlayerTable,
    setShowPlayerTable,
  ] = useState(false);

  // =========================
  // IMAGE
  // =========================
  const imageLink =
    task.image ||
    "https://i.ibb.co/PZ5jY2Y3/47d89c92dea7.png";

  // =========================
  // DEADLINE LOGIC
  // =========================
  const today = new Date();

  const deadlineDate =
    new Date(task.deadline);

  const diffTime =
    deadlineDate - today;

  const diffDays = Math.ceil(
    diffTime /
      (1000 * 60 * 60 * 24)
  );

  // =========================
  // COLORS
  // =========================
  let frameColor =
    "border-slate-800";

  let topBar =
    "from-cyan-400 to-blue-500";

  let deadlineBg =
    "bg-slate-800 border-slate-700";

  let deadlineText =
    "text-cyan-300";

  // =========================
  // URGENT
  // =========================
  if (diffDays <= 3) {

    frameColor =
      "border-red-500";

    topBar =
      "from-red-500 to-red-400";

    deadlineBg =
      "bg-red-950 border-red-500";

    deadlineText =
      "text-red-300";
  }

  // =========================
  // WARNING
  // =========================
  else if (diffDays <= 7) {

    frameColor =
      "border-orange-500";

    topBar =
      "from-orange-500 to-amber-400";

    deadlineBg =
      "bg-orange-950 border-orange-500";

    deadlineText =
      "text-orange-300";
  }

  // =========================
  // DELETE TASK
  // =========================
  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          `DELETE TASK "${task.customer}" ?`
        );

      if (!confirmDelete)
        return;

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/tasks/${task._id}`,
            {
              method:
                "DELETE",
            }
          );

        // =========================
        // FAILED
        // =========================
        if (!response.ok) {

          toast.error(
            "FAILED TO DELETE TASK"
          );

          return;
        }

        // =========================
        // SUCCESS
        // =========================
        toast.success(
          "TASK DELETED"
        );

        // =========================
        // REFRESH
        // =========================
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } catch (error) {

        console.log(error);

        toast.error(
          "ERROR DELETING TASK"
        );
      }
    };

  return (
    <>

      {/* CARD */}
      <div
        className={`
          rounded-3xl border ${frameColor}
          bg-slate-900 overflow-hidden
          transition-all duration-300
        `}
      >

        {/* TOP BAR */}
        <div
          className={`h-1.5 bg-gradient-to-r ${topBar}`}
        ></div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col">

          {/* TOP */}
          <div className="flex gap-4 items-stretch">

            {/* LEFT */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* TITLE */}
              <h1 className="text-xl font-black text-white leading-tight uppercase">
                {task.customer}
              </h1>

              {/* URGENT */}
              {diffDays <= 3 ? (
                <div
                  className="
                    mt-3 px-3 py-1
                    text-center rounded-full
                    bg-red-600 text-white
                    text-[15px] font-black
                    tracking-wider animate-pulse
                  "
                >
                  URGENT
                </div>
              ) : (
                <div className="mt-3 opacity-0 px-3 py-1">
                  A
                </div>
              )}

              {/* DEADLINE */}
              <div
                className={`
                  mt-4 flex-1 rounded-2xl
                  border p-4
                  ${deadlineBg}
                `}
              >

                <div className="flex items-start justify-between gap-3 h-full">

                  <div>

                    <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                      DEADLINE
                    </p>

                    <h2
                      className={`
                        text-[20px]
                        leading-none
                        font-black
                        mt-2
                        ${deadlineText}
                      `}
                    >
                      {task.deadline}
                    </h2>

                  </div>

                </div>

              </div>

            </div>

            {/* IMAGE */}
            <div
              onClick={() =>
                setZoomImage(true)
              }
              className="
                w-32 rounded-2xl
                overflow-hidden
                bg-slate-800
                border border-slate-700
                flex-shrink-0
                flex items-center
                justify-center
                cursor-pointer group
              "
            >

              {imageLink ? (
                <img
                  src={imageLink}
                  alt={task.customer}
                  className="
                    w-full h-full
                    object-cover
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
              ) : (
                <div className="text-slate-500 text-xs font-semibold text-center px-2">
                  NO IMAGE
                </div>
              )}

            </div>

          </div>

          {/* TIMELINE */}
          <div className="mt-5">

            <TaskTimeline
              currentStep={
                currentStep
              }
            />

          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col gap-3">

            {/* UPDATE STATUS */}
            <button
              onClick={() =>
                setShowModal(true)
              }
              className="
                w-full h-12 rounded-2xl
                bg-cyan-500 hover:bg-cyan-400
                text-black font-black
                transition-all duration-200
              "
            >
              UPDATE STATUS
            </button>

            {/* PLAYER TABLE */}
            <button
              onClick={() =>
                setShowPlayerTable(
                  true
                )
              }
              className="
                w-full h-12 rounded-2xl
                bg-white/10 hover:bg-white/20
                border border-cyan-400/30
                text-cyan-300 font-black
                transition-all duration-200
              "
            >
              OPEN SIZE TABLE
            </button>

            {/* DELETE */}
            <button
              onClick={
                handleDelete
              }
              className="
                w-full h-12 rounded-2xl
                bg-red-500 hover:bg-red-400
                text-white font-black
                transition-all duration-200
              "
            >
              DELETE TASK
            </button>

          </div>

        </div>

      </div>

      {/* PLAYER TABLE MODAL */}
      {showPlayerTable && (

        <div
          className="
            fixed inset-0 z-50
            bg-black/80
            overflow-y-auto
            p-4
          "
        >

          {/* CLOSE */}
          <button
            onClick={() =>
              setShowPlayerTable(
                false
              )
            }
            className="
              fixed top-4 right-4
              z-50
              bg-red-500
              hover:bg-red-400
              text-white
              w-12 h-12
              rounded-full
              text-2xl
              font-bold
              shadow-xl
            "
          >
            ✕
          </button>

          {/* TABLE */}
          <PlayerSizeTable
            taskId={task._id}
          />

        </div>
      )}

      {/* IMAGE MODAL */}
      {zoomImage && (

        <div
          onClick={() =>
            setZoomImage(false)
          }
          className="
            fixed inset-0 z-50
            bg-black/80
            backdrop-blur-sm
            flex items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              relative
              max-w-5xl
              w-full
            "
          >

            <img
              src={imageLink}
              alt={task.customer}
              className="
                w-full
                max-h-[90vh]
                object-contain
                rounded-2xl
              "
            />

            {/* CLOSE */}
            <button
              onClick={() =>
                setZoomImage(
                  false
                )
              }
              className="
                absolute top-4 right-4
                w-10 h-10 rounded-full
                bg-white/20 hover:bg-white/30
                text-white text-xl font-bold
                backdrop-blur-md
              "
            >
              ✕
            </button>

          </div>

        </div>
      )}

      {/* STATUS MODAL */}
      <StatusModal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        currentStep={
          currentStep
        }
        onChange={
          setCurrentStep
        }
        taskTitle={
          task.customer
        }
        taskID={task._id}
      />

    </>
  );
}