import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { resetStudent } from "../app/studentSlice";
import { fetchContacts } from "../app/contactSlice";

const Modal = ({ id, children, initialStep = 1 }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(initialStep);
  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };
  const onClose = () => {
    dispatch(resetStudent());
    dispatch(fetchContacts());
    setStep(1);
    document.getElementById(id).close();
  };
  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-11/12 max-w-xl rounded-none flex flex-col">
        <Toaster />
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="grow overflow-auto">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              step,
              onNext: nextStep,
              onPrev: prevStep,
            })
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
