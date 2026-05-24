import React, { useState } from "react";
import TaskTimeline from "./TaskTimeline";
import StatusModal from "./StatusModal";
import PlayerSizeTable from "./PlayerSizeTable";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function TaskCard({
  task,
}) {

  // =========================
  // STATUS STATE
  // =========================
  const [
    currentStep,
    setCurrentStep,
  ] = useState(
    task?.status || 0
  );

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  // =========================
  // IMAGE ZOOM
  // =========================
  const [
    zoomImage,
    setZoomImage,
  ] = useState(false);

  // =========================
  // PLAYER TABLE
  // =========================
  const [
    showPlayerTable,
    setShowPlayerTable,
  ] = useState(false);

  // =========================
  // API URL
  // =========================
  const API_URL =
    process.env.REACT_APP_API_URL;

  // =========================
  // IMAGE
  // =========================
  const imageLink =
    task?.image ||
    "https://i.ibb.co/PZ5jY2Y3/47d89c92dea7.png";

  // =========================
  // GC LINK
  // =========================
  const gcLink =
    task?.messenger || "";

  // =========================
  // CUSTOMER
  // =========================
  const customerName =
    task?.customer ||
    "NO CUSTOMER";

  // =========================
  // DEADLINE
  // =========================
  const today = new Date();

  const deadlineDate =
    task?.deadline
      ? new Date(
          task.deadline
        )
      : new Date();

  const diffTime =
    deadlineDate - today;

  const diffDays = Math.ceil(
    diffTime /
      (1000 *
        60 *
        60 *
        24)
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
  else if (
    diffDays <= 7
  ) {

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

      try {

        // =========================
        // PASSWORD PROMPT
        // =========================
        const {
          value:
            password,
        } =
          await Swal.fire({
            title:
              "DELETE TASK",
            text:
              `Enter password to delete "${customerName}"`,
            input:
              "password",

            inputPlaceholder:
              "Enter password",

            showCancelButton:
              true,

            confirmButtonText:
              "DELETE",

            confirmButtonColor:
              "#ef4444",

            background:
              "#0f172a",

            color:
              "#ffffff",
          });

        // =========================
        // CANCEL
        // =========================
        if (!password)
          return;

        // =========================
        // PASSWORD CHECK
        // =========================
        const DELETE_PASSWORD =
          "admin123";

        if (
          password !==
          DELETE_PASSWORD
        ) {

          Swal.fire({
            icon:
              "error",

            title:
              "WRONG PASSWORD",

            text:
              "Delete cancelled",

            background:
              "#0f172a",

            color:
              "#ffffff",
          });

          return;
        }

        // =========================
        // DELETE API
        // =========================
        const response =
          await fetch(
            `${API_URL}/api/tasks/${task?._id}`,
            {
              method:
                "DELETE",
            }
          );

        // =========================
        // FAILED
        // =========================
        if (
          !response.ok
        ) {

          Swal.fire({
            icon:
              "error",

            title:
              "FAILED",

            text:
              "Failed to delete task",

            background:
              "#0f172a",

            color:
              "#ffffff",
          });

          return;
        }

        // =========================
        // SUCCESS
        // =========================
        Swal.fire({
          icon:
            "success",

          title:
            "TASK DELETED",

          timer: 1500,

          showConfirmButton:
            false,

          background:
            "#0f172a",

          color:
            "#ffffff",
        });

        // =========================
        // REFRESH
        // =========================
        setTimeout(
          () => {
            window.location.reload();
          },
          1500
        );

      } catch (error) {

        console.log(
          error
        );

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
          rounded-3xl
          border ${frameColor}
          bg-slate-900
          overflow-hidden
          transition-all
          duration-300
        `}
      >

        {/* TOP BAR */}
        <div
          className={`
            h-1.5
            bg-gradient-to-r
            ${topBar}
          `}
        ></div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col">

          {/* TOP */}
          <div className="flex gap-4 items-stretch">

            {/* LEFT */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* TITLE */}
              <h1
                className="
                  text-xl
                  font-black
                  text-white
                  leading-tight
                  uppercase
                "
              >
                {customerName}
              </h1>

              {/* URGENT */}
              {diffDays <=
              3 ? (
                <div
                  className="
                    mt-3
                    px-3 py-1
                    text-center
                    rounded-full
                    bg-red-600
                    text-white
                    text-[15px]
                    font-black
                    tracking-wider
                    animate-pulse
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
                  mt-4
                  flex-1
                  rounded-2xl
                  border
                  p-4
                  ${deadlineBg}
                `}
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                    h-full
                  "
                >

                  <div>

                    <p
                      className="
                        text-[10px]
                        tracking-widest
                        text-slate-400
                        uppercase
                      "
                    >
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
                      {task?.deadline ||
                        "NO DEADLINE"}
                    </h2>

                  </div>

                </div>

              </div>

            </div>

            {/* IMAGE */}
            <div
              onClick={() =>
                setZoomImage(
                  true
                )
              }
              className="
                w-32
                rounded-2xl
                overflow-hidden
                bg-slate-800
                border
                border-slate-700
                flex-shrink-0
                flex
                items-center
                justify-center
                cursor-pointer
                group
              "
            >

              <img
                src={
                  imageLink
                }
                alt={
                  customerName
                }
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />

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
          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-3
            "
          >

            {/* UPDATE */}
            <button
              onClick={() =>
                setShowModal(
                  true
                )
              }
              className="
                w-full
                h-12
                rounded-2xl
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-black
                transition-all
                duration-200
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
                w-full
                h-12
                rounded-2xl
                bg-white/10
                hover:bg-white/20
                border
                border-cyan-400/30
                text-cyan-300
                font-black
                transition-all
                duration-200
              "
            >
              OPEN SIZE TABLE
            </button>

            {/* GC LINK */}
            {gcLink ? (
              <a
                href={
                  gcLink
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-green-500
                  hover:bg-green-400
                  text-white
                  font-black
                  transition-all
                  duration-200
                  flex
                  items-center
                  justify-center
                "
              >
                OPEN GC
              </a>
            ) : (
              <button
                disabled
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-slate-700
                  text-slate-400
                  font-black
                  cursor-not-allowed
                "
              >
                NO GC LINK
              </button>
            )}

            {/* DELETE */}
            <button
              onClick={
                handleDelete
              }
              className="
                w-full
                h-12
                rounded-2xl
                bg-red-500
                hover:bg-red-400
                text-white
                font-black
                transition-all
                duration-200
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
            fixed
            inset-0
            z-50
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
              fixed
              top-4
              right-4
              z-50
              bg-red-500
              hover:bg-red-400
              text-white
              w-12
              h-12
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
            taskId={
              task?._id
            }
            CustomerName={
              customerName
            }
          />

        </div>
      )}

      {/* IMAGE MODAL */}
      {zoomImage && (

        <div
          onClick={() =>
            setZoomImage(
              false
            )
          }
          className="
            fixed
            inset-0
            z-50
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
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
              src={
                imageLink
              }
              alt={
                customerName
              }
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
                absolute
                top-4
                right-4
                w-10
                h-10
                rounded-full
                bg-white/20
                hover:bg-white/30
                text-white
                text-xl
                font-bold
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
        open={
          showModal
        }
        onClose={() =>
          setShowModal(
            false
          )
        }
        currentStep={
          currentStep
        }
        onChange={
          setCurrentStep
        }
        taskTitle={
          customerName
        }
        taskID={
          task?._id
        }
      />

    </>
  );
}