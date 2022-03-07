import {
  CalendarIcon,
  CollectionIcon,
  FolderIcon,
  HomeIcon,
  SelectorIcon,
  TagIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ActionTypes } from "../../../consts";
import { useAppContext } from "../../../hooks";

const navigation = [
  { name: "Home", to: "", icon: "home" },
  { name: "Upcoming", to: "upcoming", icon: "collection" },
  { name: "Projects", to: "projects", icon: "folder" },
  { name: "Labels", to: "labels", icon: "tag" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const { state, dispatchHandler } = useAppContext();
  const [toggleClasses, setToggleClasses] = useState("");
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    // add event listener to get small size media query match
    const handler = (e: MediaQueryListEvent) => dispatchHandler(ActionTypes.TOGGLESIDEBAR, false);
    window.matchMedia("(min-width: 640px)").addEventListener("change", handler);

    return () => {
      // remove event listener on destroy
      window.matchMedia("(min-width: 640px)").removeEventListener("change", handler);
    };
  }, []);

  useEffect(() => {
    // if not toggled and initial toggleSidebar (false) comes then ignore
    if (!toggled && !state.toggleSidebar) return;

    // if toggle true then add absolute class
    if (state.toggleSidebar) {
      setToggleClasses("absolute inset-0 z-20 !w-full");
      setToggled(true);
      return;
    }

    // if toggle false then remove absolute classes
    // remove width only first to get better animation
    setToggleClasses("absolute inset-0 z-20");

    // after the animation duration remove the absolute class
    setTimeout(() => {
      setToggleClasses("");
    }, 200);
  }, [state.toggleSidebar]);

  const setToggleHandler = () => {
    dispatchHandler(ActionTypes.TOGGLESIDEBAR, false);
  };

  return (
    <nav
      className={`w-0 overflow-hidden bg-primary-800 transition-size-space sm:w-20 lg:w-80 ${toggleClasses}`}
    >
      <div className="h-full flex-col items-center py-4 px-5 sm:flex sm:px-0 lg:items-start lg:px-5">
        <div className="flex w-full justify-between">
          <div className="flex flex-1 flex-shrink-0 sm:justify-center lg:justify-start">
            <img
              className="hidden h-10 w-auto sm:block lg:hidden"
              src="/assets/images/todoist_icon_white.svg"
              alt="Todoist"
            />
            <img
              className="block h-10 w-auto sm:hidden lg:block"
              src="/assets/images/todoist_standard_white.svg"
              alt="Todoist"
            />
          </div>

          {state.toggleSidebar ? (
            <button
              onClick={setToggleHandler}
              className="flex transform items-center rounded-lg bg-opacity-20 px-3 py-2 text-sm font-medium text-white transition hover:bg-opacity-30 focus:outline-none active:bg-opacity-40 sm:hidden"
            >
              <XIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
          ) : (
            ""
          )}
        </div>

        <div className="py-6 lg:w-full">
          {state.details?.user ? (
            <>
              <div className="flex cursor-pointer items-center justify-between rounded-lg border p-2 hover:bg-primary-700 sm:hidden lg:flex">
                <div className="flex items-center gap-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      state.details.user.avatar_big ??
                      `https://avatars.dicebear.com/api/initials/:${state.details.user.full_name}.svg`
                    }
                    alt={state.details.user.full_name}
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-bold text-white">{state.details.user.full_name}</span>
                    <span className="text-gray-300">{state.details.user.email}</span>
                  </div>
                </div>

                <SelectorIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>

              <div className="hidden cursor-pointer rounded-lg border p-3 hover:bg-primary-700 sm:flex lg:hidden lg:rounded-full">
                <img
                  className="h-10 w-10 rounded-full"
                  src={
                    state.details.user.avatar_big ??
                    `https://avatars.dicebear.com/api/initials/:${state.details.user.full_name}.svg`
                  }
                  alt={state.details.user.full_name}
                />
              </div>
            </>
          ) : (
            <div className="flex h-[66px] items-center justify-between rounded-lg border p-2">
              <div className="flex h-full animate-pulse flex-row items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-300 "></div>
                <div className="flex flex-col space-y-2 sm:hidden lg:flex">
                  <div className="h-3 w-36 rounded-md bg-gray-300 "></div>
                  <div className="h-3 w-24 rounded-md bg-gray-300 "></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="py-2 lg:w-full">
          <div className="flex flex-col items-center gap-1">
            {navigation.map((item) => (
              <NavLink
                onClick={() => {
                  state.toggleSidebar ? dispatchHandler(ActionTypes.TOGGLESIDEBAR, false) : null;
                }}
                end
                key={item.name}
                to={item.to}
                className={(navData) => {
                  return classNames(
                    navData.isActive
                      ? "bg-accent-700 text-white"
                      : "text-primary-300 hover:bg-primary-400 hover:text-white hover:opacity-50",
                    "flex w-full items-center gap-2 rounded-lg p-3 text-sm font-medium"
                  );
                }}
              >
                <SideBarIcon icon={item.icon} />
                <span className="block sm:hidden lg:block">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

const SideBarIcon = ({ icon }: { icon: string }) => (
  <>
    {icon === "home" ? <HomeIcon className="h-6 w-6" aria-hidden="true" /> : ""}
    {icon === "folder" ? <FolderIcon className="h-6 w-6" aria-hidden="true" /> : ""}
    {icon === "tag" ? <TagIcon className="h-6 w-6" aria-hidden="true" /> : ""}
    {icon === "calendar" ? <CalendarIcon className="h-6 w-6" aria-hidden="true" /> : ""}
    {icon === "collection" ? <CollectionIcon className="h-6 w-6" aria-hidden="true" /> : ""}
  </>
);
