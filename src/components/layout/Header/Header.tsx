import { MenuIcon, PlusIcon } from "@heroicons/react/solid";
import { useLocation } from "react-router-dom";
import { ActionTypes } from "../../../consts";
import { useAppContext } from "../../../hooks";
export default function Header() {
  const location = useLocation();
  const { state, dispatchHandler } = useAppContext();

  return (
    <header className="px-sm mx-auto max-w-full border-b border-gray-200 px-3 sm:px-6 lg:px-8">
      {state.toggleProgress ? <progress className="pure-material-progress-linear" /> : <></>}
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              dispatchHandler(ActionTypes.TOGGLESIDEBAR, true);
            }}
            className="flex transform items-center rounded-lg bg-opacity-20 px-3 py-2 text-sm font-medium text-black transition hover:bg-opacity-30 focus:outline-none sm:hidden"
          >
            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
          </button>
          <h3 className="text-xl font-bold capitalize">
            {location?.pathname.replace(/\/app\/*/g, "") || "home"}
          </h3>
        </div>
        <div>
          <button
            onClick={() => {
              dispatchHandler(ActionTypes.TOGGLEADDTASK, true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-800 py-2 px-3 text-sm font-medium text-primary-100 hover:bg-primary-600 hover:text-white hover:shadow-md"
          >
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
            <span className="hidden sm:block">New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
