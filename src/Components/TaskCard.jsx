import React, { useState,useEffect } from "react";
import TaskTimeline from "./TaskTimeline";
import StatusModal from "./StatusModal";
import PlayerSizeTable from "./PlayerSizeTable";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function TaskCard({
  task,
}) {

  // =========================
  // API URL
  // =========================
  const API_URL =
    process.env.REACT_APP_API_URL;

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
  // EDIT MODAL
  // =========================
  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  // =========================
  // EDIT IMAGE
  // =========================
  const [
    editImage,
    setEditImage,
  ] = useState(
    task?.image || ""
  );

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  // =========================
  // IMAGE
  // =========================
  const imageLink =
    task?.image || "";

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
  // IMAGE UPLOAD
  // =========================
    // =========================
  // CLOUDINARY
  // =========================
  const CLOUD_NAME =
    "dsmxrjr8s";

  const UPLOAD_PRESET =
    "ml_default";

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleEditImageUpload =
    async (e) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      try {

        setUploadingImage(
          true
        );

        // =========================
        // FORM DATA
        // =========================
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "upload_preset",
          UPLOAD_PRESET
        );

        // =========================
        // CLOUDINARY UPLOAD
        // =========================
        const response =
          await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method:
                "POST",

              body:
                formData,
            }
          );

        const data =
          await response.json();

        console.log(data);

        // =========================
        // SUCCESS
        // =========================
        if (
          data?.secure_url
        ) {

          setEditImage(
            data.secure_url
          );

          toast.success(
            "IMAGE UPLOADED"
          );
        }

        // =========================
        // FAILED
        // =========================
        else {

          toast.error(
            "UPLOAD FAILED"
          );
        }

      } catch (error) {

        console.log(
          error
        );

        toast.error(
          "ERROR UPLOADING IMAGE"
        );

      } finally {

        setUploadingImage(
          false
        );
      }
    };

      // =========================
  // CTRL + V IMAGE PASTE
  // =========================
  useEffect(() => {

    const handlePaste =
      async (e) => {

        // =========================
        // ONLY INSIDE EDIT MODAL
        // =========================
        if (
          !showEditModal
        )
          return;

        const items =
          e.clipboardData?.items;

        if (!items)
          return;

        for (const item of items) {

          // =========================
          // IMAGE ONLY
          // =========================
          if (
            !item.type.includes(
              "image"
            )
          )
            continue;

          const file =
            item.getAsFile();

          if (!file)
            return;

          try {

            setUploadingImage(
              true
            );

            // =========================
            // FORM DATA
            // =========================
            const formData =
              new FormData();

            formData.append(
              "file",
              file
            );

            formData.append(
              "upload_preset",
              UPLOAD_PRESET
            );

            // =========================
            // CLOUDINARY
            // =========================
            const response =
              await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                  method:
                    "POST",

                  body:
                    formData,
                }
              );

            const data =
              await response.json();

            console.log(
              data
            );

            // =========================
            // SUCCESS
            // =========================
            if (
              data?.secure_url
            ) {

              setEditImage(
                data.secure_url
              );

              toast.success(
                "IMAGE PASTED"
              );
            }

            // =========================
            // FAILED
            // =========================
            else {

              toast.error(
                "UPLOAD FAILED"
              );
            }

          } catch (error) {

            console.log(
              error
            );

            toast.error(
              "ERROR PASTING IMAGE"
            );

          } finally {

            setUploadingImage(
              false
            );
          }
        }
      };

    window.addEventListener(
      "paste",
      handlePaste
    );

    return () => {

      window.removeEventListener(
        "paste",
        handlePaste
      );
    };

  }, [
    showEditModal
  ]);

      // =========================
  // PASTE IMAGE FROM CLIPBOARD
  // =========================


  // =========================
  // SAVE EDIT TASK
  // =========================
  const handleEditSave =
    async () => {

      try {

        // =========================
        // GET INPUT VALUES
        // =========================
        const customer =
          document.getElementById(
            `edit-customer-${task?._id}`
          ).value;

        const messenger =
          document.getElementById(
            `edit-messenger-${task?._id}`
          ).value;

        const deadline =
          document.getElementById(
            `edit-deadline-${task?._id}`
          ).value;

        // =========================
        // VALIDATION
        // =========================
        if (
          !customer ||
          !deadline
        ) {

          toast.error(
            "PLEASE COMPLETE REQUIRED FIELDS"
          );

          return;
        }

        // =========================
        // API REQUEST
        // =========================
        const response =
          await fetch(
            `${API_URL}/api/tasks/${task?._id}`,
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({

                  customer:
                    customer.toUpperCase(),

                  messenger,

                  deadline,

                  image:
                    editImage || "",

                  status:
                    task?.status || "LAYOUT",

                }),
            }
          );

        // =========================
        // RESPONSE
        // =========================
        const data =
          await response.json();

        console.log(
          data
        );

        // =========================
        // FAILED
        // =========================
        if (
          !response.ok
        ) {

          toast.error(
            data.message ||
            "FAILED TO UPDATE TASK"
          );

          return;
        }

        // =========================
        // SUCCESS
        // =========================
        toast.success(
          "TASK UPDATED SUCCESSFULLY"
        );

        // =========================
        // CLOSE MODAL
        // =========================
        setShowEditModal(
          false
        );

        // =========================
        // REFRESH PAGE
        // =========================
        setTimeout(
          () => {
            window.location.reload();
          },
          1000
        );

      } catch (error) {

        console.log(
          error
        );

        toast.error(
          "ERROR UPDATING TASK"
        );
      }
    };

  // =========================
  // DELETE TASK
  // =========================
  const handleDelete =
    async () => {

      try {

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
                  text-2xl
                  font-black
                  text-white
                  leading-tight
                  uppercase
                "
              >
                {customerName}
              </h1>

              {/* URGENT */}
              {diffDays <= 3 ? (
                <div
                  className="
                    mt-3
                    px-3 py-1
                    text-center
                    rounded-full
                    bg-red-600/50
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

            <button
              onClick={() =>
                setShowModal(
                  true
                )
              }
              className="
                w-full
                h-10
                rounded-2xl
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-black
              "
            >
              UPDATE STATUS
            </button>

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
                bg-green-600/60
                hover:bg-white/20
                border
                border-cyan-400/30
                text-cyan-300
                font-black
              "
            >
              SIZE LIST
            </button>

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
                  bg-white/90
                  hover:bg-green-400
                  text-black
                  font-black
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
                "
              >
                NO GC LINK
              </button>
            )}

            <button
              onClick={() =>
                setShowEditModal(
                  true
                )
              }
              className="
                w-full
                h-12
                rounded-2xl
                bg-yellow-500
                hover:bg-yellow-400
                text-black
                font-black
              "
            >
              EDIT TASK
            </button>

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
              "
            >
              DELETE TASK
            </button>

          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      {showEditModal && (

        <div
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
              w-full
              max-w-2xl
              bg-slate-900
              border
              border-slate-700
              rounded-3xl
              overflow-hidden
            "
          >

            {/* HEADER */}
            <div
              className="
                bg-gradient-to-r
                from-yellow-500
                to-orange-500
                p-5
                flex
                items-center
                justify-between
              "
            >

              <h1
                className="
                  text-2xl
                  font-black
                  text-black
                  uppercase
                "
              >
                EDIT TASK
              </h1>

              <button
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-black/20
                  text-black
                  text-xl
                  font-bold
                "
              >
                ✕
              </button>

            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">

              {/* CUSTOMER */}
              <div>

                <label
                  className="
                    block
                    text-slate-300
                    mb-2
                    font-semibold
                    uppercase
                  "
                >
                  CUSTOMER NAME
                </label>

                <input
                  id={`edit-customer-${task?._id}`}
                  type="text"
                  defaultValue={
                    task?.customer
                  }
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-600
                    text-white
                    px-4
                    py-3
                    rounded-xl
                  "
                />

              </div>

              {/* GC */}
              <div>

                <label
                  className="
                    block
                    text-slate-300
                    mb-2
                    font-semibold
                    uppercase
                  "
                >
                  MESSENGER LINK
                </label>

                <input
                  id={`edit-messenger-${task?._id}`}
                  type="text"
                  defaultValue={
                    task?.messenger
                  }
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-600
                    text-white
                    px-4
                    py-3
                    rounded-xl
                  "
                />

              </div>

              {/* DEADLINE */}
              <div>

                <label
                  className="
                    block
                    text-slate-300
                    mb-2
                    font-semibold
                    uppercase
                  "
                >
                  DEADLINE
                </label>

                <input
                  id={`edit-deadline-${task?._id}`}
                  type="date"
                  defaultValue={
                    task?.deadline
                  }
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-600
                    text-white
                    px-4
                    py-3
                    rounded-xl
                  "
                />

              </div>

              {/* IMAGE */}
              <div>

                <label
                  className="
                    block
                    text-slate-300
                    mb-2
                    font-semibold
                    uppercase
                  "
                >
                  TASK IMAGE
                </label>

                {/* PREVIEW */}
                <div
                  className="
                    rounded-2xl
                    overflow-hidden
                    border
                    border-slate-700
                    bg-slate-800
                    mb-4
                  "
                >

                  <img
                    src={
                      editImage
                    }
                    alt={
                      customerName
                    }
                    className="
                      w-full
                      max-h-[350px]
                      object-contain
                    "
                  />

                </div>

                {/* FILE INPUT */}
                <label
                  className="
                    w-full
                    h-12
                    rounded-2xl
                    bg-cyan-500
                    hover:bg-cyan-400
                    text-black
                    font-black
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                  "
                >

                  {uploadingImage
                    ? "UPLOADING..."
                    : "UPLOAD NEW IMAGE"}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleEditImageUpload
                    }
                  />

                </label>
 

              </div>

              {/* BUTTONS */}
              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                  pt-2
                "
              >

                <button
                  onClick={
                    handleEditSave
                  }
                  className="
                    h-12
                    rounded-2xl
                    bg-yellow-500
                    hover:bg-yellow-400
                    text-black
                    font-black
                  "
                >
                  SAVE CHANGES
                </button>

                <button
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                  className="
                    h-12
                    rounded-2xl
                    bg-slate-700
                    hover:bg-slate-600
                    text-white
                    font-black
                  "
                >
                  CANCEL
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* PLAYER TABLE */}
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
              text-white
              w-12
              h-12
              rounded-full
              text-2xl
              font-bold
            "
          >
            ✕
          </button>

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
                text-white
                text-xl
                font-bold
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