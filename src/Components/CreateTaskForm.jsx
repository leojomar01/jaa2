import React, {
  useState,
  useRef,
} from "react";

import {
  toast,
} from "react-toastify";

export default function CreateTaskForm() {

  // ==========================
  // API URL
  // ==========================
  const API_URL =
    process.env.REACT_APP_API_URL;

  console.log(
    `${API_URL}/api/tasks`
  );

  // ==========================
  // CLOUDINARY
  // ==========================
  const CLOUD_NAME =
    "dsmxrjr8s";

  const UPLOAD_PRESET =
    "ml_default";

  // ==========================
  // TODAY DATE
  // ==========================
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  // ==========================
  // FORM STATE
  // ==========================
  const [
    formData,
    setFormData,
  ] = useState({
    customer: "",
    messenger: "",
    deadline: "",
  });

  // ==========================
  // IMAGE STATE
  // ==========================
  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  // ==========================
  // UI STATE
  // ==========================
  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState("");

  // ==========================
  // REF
  // ==========================
  const pasteAreaRef =
    useRef(null);

  // ==========================
  // HANDLE UPPERCASE
  // ==========================
  const handleUpperCase = (
    e
  ) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value.toUpperCase(),
    });
  };

  // ==========================
  // HANDLE PASTE IMAGE
  // ==========================
  const handlePaste = async (
    event
  ) => {

    const items =
      event.clipboardData.items;

    for (let item of items) {

      // ==========================
      // IMAGE DETECTED
      // ==========================
      if (
        item.type.indexOf(
          "image"
        ) !== -1
      ) {

        const file =
          item.getAsFile();

        if (!file)
          return;

        // SAVE FILE
        setImage(file);

        // ==========================
        // PREVIEW
        // ==========================
        const localUrl =
          URL.createObjectURL(
            file
          );

        setPreview(
          localUrl
        );

        setStatus(
          "IMAGE READY TO UPLOAD."
        );

        console.log(
          "IMAGE PASTED:",
          file
        );

        return;
      }
    }

    setStatus(
      "NO IMAGE DETECTED."
    );
  };

  // ==========================
  // HANDLE FILE PICK
  // ==========================
  const handleFileChange = (
    e
  ) => {

    const file =
      e.target.files?.[0];

    if (!file)
      return;

    setImage(file);

    const localUrl =
      URL.createObjectURL(
        file
      );

    setPreview(
      localUrl
    );

    setStatus(
      "IMAGE READY TO UPLOAD."
    );
  };

  // ==========================
  // UPLOAD IMAGE
  // ==========================
  const uploadImage =
    async () => {

      // ==========================
      // NO IMAGE
      // ==========================
      if (!image)
        return "";

      try {

        setStatus(
          "UPLOADING IMAGE..."
        );

        // ==========================
        // FORM DATA
        // ==========================
        const formDataUpload =
          new FormData();

        formDataUpload.append(
          "file",
          image
        );

        formDataUpload.append(
          "upload_preset",
          UPLOAD_PRESET
        );

        // ==========================
        // CLOUDINARY UPLOAD
        // ==========================
        const response =
          await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method:
                "POST",

              body:
                formDataUpload,
            }
          );

        const data =
          await response.json();

        console.log(
          data
        );

        // ==========================
        // SUCCESS
        // ==========================
        if (
          data.secure_url
        ) {

          setImageUrl(
            data.secure_url
          );

          setStatus(
            "IMAGE UPLOADED SUCCESSFULLY!"
          );

          return (
            data.secure_url
          );
        }

        // ==========================
        // FAILED
        // ==========================
        setStatus(
          "IMAGE UPLOAD FAILED."
        );

        return "";

      } catch (error) {

        console.log(
          error
        );

        setStatus(
          "ERROR UPLOADING IMAGE."
        );

        return "";
      }
    };

  // ==========================
  // SUBMIT FORM
  // ==========================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(
          true
        );

        let uploadedImage =
          "";

        // ==========================
        // UPLOAD IMAGE FIRST
        // ==========================
        if (
          image !== null
        ) {

          uploadedImage =
            await uploadImage();

          // ==========================
          // CANCEL IF FAILED
          // ==========================
          if (
            !uploadedImage
          ) {

            toast.error(
              "UPLOAD FAILED!"
            );

            setLoading(
              false
            );

            return;
          }
        }

        // ==========================
        // TASK DATA
        // ==========================
        const taskData = {
          customer:
            formData.customer,

          messenger:
            formData.messenger,

          deadline:
            formData.deadline,

          image:
            uploadedImage ||
            "",

          status:
            "LAYOUT",

          createdAt:
            new Date().toISOString(),
        };

        console.log(
          "DATABASE READY:",
          taskData
        );

        // ==========================
        // SAVE TO BACKEND
        // ==========================
        const response =
          await fetch(
            `${API_URL}/api/tasks`,
            {
              method:
                "POST",

              headers:
                {
                  "Content-Type":
                    "application/json",
                },

              body:
                JSON.stringify(
                  taskData
                ),
            }
          );

        // ==========================
        // CHECK RESPONSE
        // ==========================
        if (
          !response.ok
        ) {

          const errorData =
            await response.json();

          console.log(
            errorData
          );

          toast.error(
            errorData.message ||
            "FAILED TO SAVE"
          );

          return;
        }

        const data =
          await response.json();

        console.log(
          data
        );

        // ==========================
        // SUCCESS
        // ==========================
        toast.success(
          "TASK CREATED SUCCESSFULLY!"
        );

        setTimeout(
          () => {
            window.location.reload();
          },
          1500
        );

        // ==========================
        // RESET FORM
        // ==========================
        handleReset();

      } catch (error) {

        console.log(
          error
        );

        alert(
          "ERROR CREATING TASK"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  // ==========================
  // RESET FORM
  // ==========================
  const handleReset =
    () => {

      setFormData({
        customer: "",
        messenger: "",
        deadline: "",
      });

      setImage(null);

      setPreview("");

      setImageUrl("");

      setStatus("");
    };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-5">

      <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5">

          <h1 className="text-3xl font-bold text-white uppercase">
            CREATE PRODUCTION TASK
          </h1>

          <p className="text-slate-100 mt-1 uppercase">
            PRODUCTION MANAGEMENT SYSTEM
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="p-6 space-y-5"
        >

          {/* CUSTOMER */}
          <div>

            <label className="block text-slate-300 mb-2 font-semibold uppercase">
              CUSTOMER NAME
            </label>

            <input
              type="text"
              name="customer"
              value={
                formData.customer
              }
              onChange={
                handleUpperCase
              }
              placeholder="ENTER CUSTOMER NAME"
              required
              className="
                w-full
                bg-slate-900
                border border-slate-600
                text-white
                px-4 py-3
                rounded-lg
                outline-none
                focus:border-cyan-400
                uppercase
              "
            />

          </div>

          {/* MESSENGER */}
          <div>

            <label className="block text-slate-300 mb-2 font-semibold uppercase">
              MESSENGER LINK
            </label>

            <input
              type="text"
              name="messenger"
              value={
                formData.messenger
              }
              onChange={
                handleUpperCase
              }
              placeholder="HTTPS://M.ME/..."
              className="
                w-full
                bg-slate-900
                border border-slate-600
                text-white
                px-4 py-3
                rounded-lg
                outline-none
                focus:border-cyan-400
              "
            />

          </div>

          {/* DEADLINE */}
          <div>

            <label className="block text-slate-300 mb-2 font-semibold uppercase">
              DEADLINE
            </label>

            <input
              type="date"
              name="deadline"
              value={
                formData.deadline
              }
              onChange={(
                e
              ) =>
                setFormData({
                  ...formData,

                  deadline:
                    e.target.value,
                })
              }
              min={today}
              required
              className="
                w-full
                bg-slate-900
                border border-slate-600
                text-white
                px-4 py-3
                rounded-lg
                outline-none
                focus:border-cyan-400
              "
            />

          </div>

          {/* IMAGE AREA */}
          <div>

            <label className="block text-slate-300 mb-2 font-semibold uppercase">
              PASTE OR SELECT DESIGN IMAGE
            </label>

            <div
              ref={
                pasteAreaRef
              }
              onPaste={
                handlePaste
              }
              tabIndex={0}
              onClick={() =>
                pasteAreaRef.current.focus()
              }
              className="
                border-2 border-dashed
                border-slate-500
                bg-slate-900
                rounded-xl
                p-10
                text-center
                text-slate-400
                cursor-pointer
                focus:border-cyan-400
                outline-none
                transition
              "
            >

              <p className="text-lg uppercase">
                CLICK HERE THEN PRESS
              </p>

              <p className="text-cyan-400 font-bold text-2xl mt-2 uppercase">
                CTRL + V
              </p>

              <p className="mt-4 uppercase">
                OR
              </p>

              <label className="
                inline-block
                mt-4
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-bold
                px-5 py-3
                rounded-lg
                cursor-pointer
                transition
                uppercase
              ">

                SELECT IMAGE

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                  className="hidden"
                />

              </label>

            </div>

          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="space-y-3">

              <h2 className="text-slate-300 font-semibold uppercase">
                IMAGE PREVIEW
              </h2>

              <div
                className="
                  max-h-[400px]
                  overflow-auto
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900
                  p-3
                "
              >

                <img
                  src={preview}
                  alt="Preview"
                  className="
                    w-full
                    h-auto
                    object-contain
                    rounded-lg
                  "
                />

              </div>

            </div>
          )}

          {/* STATUS */}
          {status && (
            <div className="
              bg-slate-900
              border border-slate-700
              rounded-lg
              px-4 py-3
              text-cyan-400
              uppercase
            ">

              {status}

            </div>
          )}

          {/* IMAGE URL */}
          {imageUrl && (
            <div>

              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  text-cyan-400
                  underline
                  break-all
                "
              >

                {imageUrl}

              </a>

            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 pt-3">

            <button
              type="submit"
              disabled={
                loading
              }
              className="
                bg-cyan-500
                hover:bg-cyan-400
                disabled:opacity-50
                text-black
                font-bold
                px-6 py-3
                rounded-lg
                shadow-lg
                transition
                uppercase
              "
            >

              {loading
                ? "CREATING..."
                : "CREATE TASK"}

            </button>

            <button
              type="button"
              onClick={
                handleReset
              }
              className="
                bg-red-500
                hover:bg-red-400
                text-white
                font-bold
                px-6 py-3
                rounded-lg
                shadow-lg
                transition
                uppercase
              "
            >

              RESET

            </button>

          </div>

        </form>

        {/* FOOTER */}
        <div className="h-3 bg-gradient-to-r from-pink-500 to-purple-500"></div>

      </div>

    </div>
  );
}