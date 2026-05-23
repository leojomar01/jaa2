import React from "react";
import {
  LayoutGrid,
  Printer,
  Scissors,
  SearchCheck,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    label: "LAYOUT",
    color: "bg-indigo-500",
    icon: <LayoutGrid className="w-4 h-4 text-white" />,
  },
  {
    label: "PRINTING",
    color: "bg-cyan-500",
    icon: <Printer className="w-4 h-4 text-white" />,
  },
  {
    label: "SEWING",
    color: "bg-orange-500",
    icon: <Scissors className="w-4 h-4 text-white" />,
  },
  {
    label: "CHECKING",
    color: "bg-yellow-500",
    icon: <SearchCheck className="w-4 h-4 text-white" />,
  },
  {
    label: "COMPLETE",
    color: "bg-green-500",
    icon: <CheckCircle className="w-4 h-4 text-white" />,
  },
];

export default function TaskTimeline({ currentStep }) {
  const currentIndex = steps.findIndex(
    (step) => step.label === currentStep
  );

  return (
    <div className="relative py-4">

      <div className="absolute top-8 left-0 right-0 h-[4px] bg-slate-700 rounded-full"></div>

      <div
        className="absolute top-8 left-0 h-[4px] bg-gradient-to-r from-cyan-400 to-green-400 rounded-full"
        style={{
          width: `${(currentIndex / (steps.length - 1)) * 100}%`,
        }}
      ></div>

      <div className="relative flex justify-between">

        {steps.map((step, index) => {
          const active = index <= currentIndex;

          return (
            <div
              key={step.label}
              className="flex flex-col items-center flex-1 z-10"
            >

              <div
                className={`
                  w-11 h-11 rounded-full border-[3px] border-slate-900
                  flex items-center justify-center
                  ${active ? step.color : "bg-slate-700"}
                `}
              >
                {step.icon}
              </div>

              <span
                className={`
                  mt-3 text-[10px] font-black tracking-widest text-center
                  ${active ? "text-white" : "text-slate-500"}
                `}
              >
                {step.label}
              </span>

            </div>
          );
        })}
      </div>
    </div>
  );
}