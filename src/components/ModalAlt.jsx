import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const ModalAlt = ({ id, isOpen, onClose, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        id={id}
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          {/* This is your modal box */}
          <div className="inline-block align-middle my-8 p-6 bg-white rounded-md text-left shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
            {children}
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAlt;
