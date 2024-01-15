import { useState } from "react";
import Step1Edit from "./Step1Edit";
import Step2Edit from "./Step2Edit";
import Step3Edit from "./Step3Edit";

const StepperEdit = ({
  selectedRow,
  updateStudent,
  updateOther,
  step,
  onNext,
  onPrev,
}) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="p-4 grid grid-cols-3 gap-4">
          <div
            className={`px-4 py-2 ${
              step === 1 ? "bg-slate-500" : "bg-slate-300"
            } text-white rounded-xl`}
          >
            Step 1
          </div>
          <div
            className={`px-4 py-2 ${
              step === 2 ? "bg-slate-500" : "bg-slate-300"
            } text-white rounded-xl`}
          >
            Step 2
          </div>
          <div
            className={`px-4 py-2 ${
              step === 3 ? "bg-slate-500" : "bg-slate-300"
            } text-white rounded-xl`}
          >
            Step 3
          </div>
        </div>
        <div className="min-h-full max-h-[420px] overflow-y-auto">
          {step === 1 && (
            <Step1Edit selectedRow={selectedRow} action={updateStudent} />
          )}
          {step === 2 && <Step2Edit selectedRow={selectedRow} />}
          {step === 3 && (
            <Step3Edit selectedRow={selectedRow} action={updateOther} />
          )}
        </div>
        <div className="p-4 flex justify-between">
          <button
            className="btn btn-sm"
            onClick={onPrev}
            disabled={step === 1 && true}
          >
            Prev
          </button>
          <button
            className="btn btn-sm"
            onClick={onNext}
            disabled={step === 3 && true}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default StepperEdit;
