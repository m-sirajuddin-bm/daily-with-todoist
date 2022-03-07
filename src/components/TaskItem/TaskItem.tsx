import { Menu, Transition } from "@headlessui/react";
import {
  ArchiveIcon as ArchiveIconOut,
  DuplicateIcon as DuplicateIconOut,
  FlagIcon as FlagIconOut,
  FolderIcon as FolderIconOut,
  PencilIcon as PencilIconOut,
  TrashIcon as TrashIconOut,
} from "@heroicons/react/outline";
import {
  ArchiveIcon,
  ClockIcon,
  DotsHorizontalIcon,
  DuplicateIcon,
  FlagIcon,
  FolderIcon,
  InboxIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { format, isYesterday } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import {
  todoistBgColors,
  todoistBorderColors,
  todoistPriorityColors,
  todoistTextColors,
} from "../../consts";
import { useAppContext } from "../../hooks";
import { ILabel, IProject, ISection, ITask } from "../../interfaces/todoist-data.interface";
import { getLabelName, getProjectInfo, getSectionInfo } from "../../utils/app.utils";

function TaskItem(props: { task: ITask }) {
  const { state } = useAppContext();

  const [projectInfo, setProjectInfo] = useState<IProject>();
  const [sectionInfo, setSectionInfo] = useState<ISection>();
  const [labels, setLabels] = useState<ILabel[]>([]);

  useEffect(() => {
    setProjectInfo(getProjectInfo(state.details.projects, props.task.project_id) as IProject);
    setSectionInfo(getSectionInfo(state.details.sections, props.task.section_id) as ISection);
    setLabels(getLabelName(state.details.labels, props.task.labels));
  }, [state.details]);

  return (
    <>
      <div className="mx-auto flex max-w-11/12 items-center border-b py-4 3xl:max-w-9/12">
        <div className="flex w-full items-center">
          {/* checkbox start */}
          <div>
            <input
              type="checkbox"
              checked={props.task.checked === 1}
              onChange={() => {
                // TODO: complete task
              }}
              className="h-5 w-5 rounded-full border-gray-300 text-accent-700 shadow focus:ring-accent-600"
            />
          </div>
          {/* checkbox end */}

          {/* task details start */}
          <div className="ml-6 flex w-full flex-col justify-center gap-1">
            {/* task content start */}
            <div className="flex items-center justify-between">
              <div
                className={`flex w-full flex-col ${props.task.checked === 1 ? "line-through" : ""}`}
              >
                {/* task title start */}
                <p className="block text-sm font-bold">{props.task.content}</p>
                {/* task title end */}

                {/* description start */}
                {props.task.description ? (
                  <p className="word custom-truncate max-w-11/12 text-xs font-medium text-secondary">
                    {props.task.description}
                  </p>
                ) : (
                  ""
                )}
                {/* description end */}
              </div>

              {/* priority start */}
              <div className="flex flex-col">
                <div>
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className=" w-full justify-center rounded-md bg-opacity-20 text-sm font-medium hover:bg-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        <DotsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-primary-500 text-white" : "text-gray-900"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <PencilIconOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <PencilIcon
                                    className="mr-2 h-5 w-5 text-primary-800"
                                    aria-hidden="true"
                                  />
                                )}
                                Edit task
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-primary-500 text-white" : "text-gray-900"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <FolderIconOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <FolderIcon
                                    className="mr-2 h-5 w-5 text-primary-800"
                                    aria-hidden="true"
                                  />
                                )}
                                Go to project
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-primary-500 text-white" : "text-gray-900"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <DuplicateIconOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <DuplicateIcon
                                    className="mr-2 h-5 w-5 text-primary-800"
                                    aria-hidden="true"
                                  />
                                )}
                                Duplicate
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-primary-500 text-white" : "text-gray-900"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <FlagIconOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <FlagIcon
                                    className="mr-2 h-5 w-5 text-primary-800"
                                    aria-hidden="true"
                                  />
                                )}
                                Priority
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-primary-500 text-white" : "text-gray-900"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <ArchiveIconOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <ArchiveIcon
                                    className="mr-2 h-5 w-5 text-primary-800"
                                    aria-hidden="true"
                                  />
                                )}
                                Archive
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-primary-500 text-white" : "text-gray-900"
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <TrashIconOut className="mr-2 h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <TrashIcon
                                    className="mr-2 h-5 w-5 text-primary-800"
                                    aria-hidden="true"
                                  />
                                )}
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                <FlagIcon
                  className={`$ h-6 w-6 ${todoistPriorityColors[props.task.priority]}`}
                  aria-hidden="true"
                />
              </div>
              {/* priority end */}
            </div>
            {/* task content end */}

            <div className="flex items-center justify-between">
              {/* label content start */}
              <div className="flex flex-row flex-wrap gap-2">
                {/* overdue date start */}
                {props.task.overdue ? (
                  <div
                    className={`flex h-5 items-center justify-center gap-1 rounded-md px-2 text-sm opacity-80 ${todoistBgColors[31]}`}
                  >
                    <ClockIcon className="h-3 w-3" aria-hidden="true" />
                    <small>
                      {isYesterday(props.task.dueDate as Date)
                        ? "Yesterday"
                        : format(props.task.dueDate as Date, "dd MMM")}
                    </small>
                  </div>
                ) : (
                  ""
                )}
                {/* overdue date end */}

                {/* labels start */}
                {labels.map((label) => {
                  return (
                    <div
                      key={label.id}
                      className={`flex h-5 items-center justify-center gap-1 rounded-md px-2 text-xs opacity-80 lg:text-sm ${
                        todoistBgColors[label.color]
                      }`}
                    >
                      <TagIcon className="h-3 w-3" aria-hidden="true" />
                      <small>{label.name}</small>
                    </div>
                  );
                })}
                {/* labels end */}
              </div>
              {/* label content end */}
              <div>
                {projectInfo ? (
                  <div
                    className={`flex h-5 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-2 text-xs lg:text-sm ${
                      todoistBorderColors[projectInfo.color]
                    }`}
                  >
                    <small className="flex items-center gap-1 break-words">
                      {projectInfo.name} {sectionInfo ? " / " + sectionInfo.name : ""}
                      {projectInfo.inbox_project ? (
                        <InboxIcon
                          className={`h-3 w-3 ${todoistTextColors[projectInfo.color]}`}
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          className={`h-2 w-2 rounded-full ${todoistBgColors[projectInfo.color]}`}
                        ></span>
                      )}
                    </small>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* task details end */}
        </div>
      </div>
    </>
  );
}

export default TaskItem;
