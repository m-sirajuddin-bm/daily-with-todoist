import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactElement } from "react";

interface DialogProps {
  children: ReactElement;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

function AppDialog(props: DialogProps) {
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog onClose={props.onClose} className="fixed inset-0 z-10 overflow-y-auto p-4 pt-[20vh]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={props.className}>{props.children}</div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default AppDialog;
