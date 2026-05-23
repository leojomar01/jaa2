import React from "react";
import {
  LayoutGrid,
  Printer,
  Scissors,
  SearchCheck,
  CheckCircle,
} from "lucide-react";

// =========================
// TOASTIFY
// =========================
import { toast } from "react-toastify";


// =========================
// STEPS
// =========================
const steps = [
  {
    label: "LAYOUT",
    color: "bg-indigo-500",
    icon: (
      <LayoutGrid className="w-4 h-4 text-white" />
    ),
  },
  {
    label: "PRINTING",
    color: "bg-cyan-500",
    icon: (
      <Printer className="w-4 h-4 text-white" />
    ),
  },
  {
    label: "SEWING",
    color: "bg-orange-500",
    icon: (
      <Scissors className="w-4 h-4 text-white" />
    ),
  },
  {
    label: "CHECKING",
    color: "bg-yellow-500",
    icon: (
      <SearchCheck className="w-4 h-4 text-white" />
    ),
  },
  {
    label: "COMPLETE",
    color: "bg-green-500",
    icon: (
      <CheckCircle className="w-4 h-4 text-white" />
    ),
  },
];

export default function StatusModal({
  open,
  onClose,
  currentStep,
  onChange,
  taskTitle,
  taskID,
}) {
  // =========================
  // LOADING STATE
  // =========================
  const [loading, setLoading] =
    React.useState(false);

  // =========================
  // CLOSE IF FALSE
  // =========================
  if (!open) return null;

  // =========================
  // UPDATE DATABASE
  // =========================
  const updateStatus = async (
    newStatus
  ) => {
    try {
      setLoading(true);

      // =========================
      // API REQUEST
      // =========================
      const response =
        await fetch(
          `http://localhost:5000/api/tasks/${taskID}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      // =========================
      // ERROR
      // =========================
      if (!response.ok) {

        toast.error(
          "FAILED TO UPDATE STATUS"
        );

        setLoading(false);

        return;
      }

      // =========================
      // RESPONSE
      // =========================
      const data =
        await response.json();

      console.log(
        "UPDATED:",
        data
      );

      // =========================
      // UPDATE FRONTEND
      // =========================
      onChange(newStatus);

      // =========================
      // SUCCESS
      // =========================
      toast.success(
        "STATUS UPDATED!"
      );

      // =========================
      // CLOSE MODAL
      // =========================
      setTimeout(() => {
        onClose();
      }, );

    } catch (error) {

      console.log(error);

      toast.error(
        "ERROR UPDATING STATUS"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
    

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

        <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">

          {/* TOP BAR */}
          <div className="h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500"></div>

          <div className="p-5">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 mb-5">

              <div className="min-w-0">

                <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                  EDITING TASK
                </p>

                <h1 className="text-lg font-black text-cyan-300 truncate mt-1 uppercase">
                  {taskTitle}
                </h1>

                <h2 className="text-2xl font-black text-white mt-4 uppercase">
                  UPDATE STATUS
                </h2>

                <p className="text-xs text-slate-400 mt-1 uppercase">
                  SELECT PRODUCTION STAGE
                </p>

              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                disabled={loading}
                className="
                  w-9 h-9 rounded-full
                  bg-slate-800 hover:bg-slate-700
                  text-white flex items-center
                  justify-center flex-shrink-0
                  transition-all duration-200
                "
              >
                ✕
              </button>

            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-3">

              {steps.map((step) => {
                const active =
                  currentStep ===
                  step.label;

                return (
                  <button
                    key={step.label}
                    disabled={loading}
                    onClick={() =>
                      updateStatus(
                        step.label
                      )
                    }
                    className={`
                      rounded-xl border p-3
                      flex flex-col items-center gap-2
                      transition-all duration-200
                      ${
                        active
                          ? "border-cyan-400 bg-cyan-500/10 scale-[1.02]"
                          : "border-slate-700 bg-slate-800 hover:border-slate-500"
                      }
                      ${
                        loading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                  >

                    {/* ICON */}
                    <div
                      className={`
                        w-9 h-9 rounded-full
                        flex items-center justify-center
                        transition-all duration-200
                        ${
                          active
                            ? step.color
                            : "bg-slate-700"
                        }
                      `}
                    >
                      {step.icon}
                    </div>

                    {/* LABEL */}
                    <span
                      className={`
                        text-[10px] font-black tracking-wider uppercase
                        ${
                          active
                            ? "text-cyan-300"
                            : "text-white"
                        }
                      `}
                    >
                      {loading
                        ? "UPDATING..."
                        : step.label}
                    </span>

                  </button>
                );
              })}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}