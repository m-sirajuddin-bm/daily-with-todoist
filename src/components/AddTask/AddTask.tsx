import { Combobox, Dialog, Listbox, Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, SelectorIcon } from "@heroicons/react/outline";
import { FlagIcon, InboxIcon, TagIcon } from "@heroicons/react/solid";
import axios from "axios";
import { nanoid } from "nanoid";
import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from "react";
import {
  ActionTypes,
  Priorities,
  todoistBgColors,
  todoistPriorityColors,
  todoistTextColors,
} from "../../consts";
import { useAppContext, useDebounce } from "../../hooks";
import { ILabel, IProject } from "../../interfaces/todoist-data.interface";

function AddTask() {
  const { state, dispatchHandler } = useAppContext();
  const [selectedProject, setProjectselectedProject] = useState<IProject>();
  const [projectQuery, setProjectQuery] = useState("");
  const debounceSetProjectQuery = useDebounce(setProjectQuery, 200);
  const [selectedPriority, setSelectedPriority] = useState(Priorities[0]);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const dueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // select 'Inbox' as default project
    setProjectselectedProject(state.details?.projects[0]);
    // select priority 1 as default project
    setSelectedPriority(Priorities[0]);
    // reset labels if only selected
    if (selectedLabels.length) setSelectedLabels([]);
  }, [state.toggleAddTask]);

  const addTaskHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let commands: any = {
      type: "item_add",
      temp_id: nanoid(),
      uuid: nanoid(),
      args: {
        content: titleRef.current?.value ?? "",
        description: descRef.current?.value ?? "",
        project_id: selectedProject?.id,
        priority: selectedPriority.value,
        labels: selectedLabels,
      },
    };

    // add the due data
    if (dueRef.current?.value) {
      commands = {
        ...commands,
        args: {
          ...commands.args,
          due: {
            date: dueRef.current?.value,
            timezone: null,
            string: dueRef.current?.value,
            lang: "en",
          },
        },
      };
    }

    const { data } = await axios.post(
      "https://api.todoist.com/sync/v8/sync",
      {
        commands: [commands],
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      }
    );

    console.log(data);

    dispatchHandler(ActionTypes.SYNCDATA, ["all"]);
    setIsOpenHandler();
  };

  const setIsOpenHandler = () => {
    dispatchHandler(ActionTypes.TOGGLEADDTASK, false);
  };

  const handledLabelChange = (e: ChangeEvent<HTMLInputElement>, label: ILabel) => {
    if (e.target.checked) {
      setSelectedLabels((prev) => [...prev, label.id]);
    } else {
      setSelectedLabels((prev) => prev.filter((id) => id !== label.id));
    }
  };

  const filteredProjects =
    projectQuery === ""
      ? state.details?.projects
      : state.details?.projects.filter((project) =>
          project.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(projectQuery.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Transition appear show={state.toggleAddTask} as={Fragment}>
      <Dialog
        onClose={setIsOpenHandler}
        className="fixed inset-0 z-10 overflow-y-auto p-4 pt-[20vh]"
      >
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
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="relative mx-auto max-w-3xl rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
            <form onSubmit={addTaskHandler}>
              <div className="w-full transform p-6 text-left align-middle transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                  Add Task
                </Dialog.Title>

                <div className="my-2 flex flex-col gap-2">
                  <input
                    ref={titleRef}
                    className="input font-semibold "
                    type="text"
                    placeholder="Title"
                    required
                  />
                  <textarea
                    ref={descRef}
                    name="description"
                    placeholder="Description"
                    className="textarea"
                    rows={3}
                  ></textarea>

                  <div className="flex flex-wrap justify-between gap-2">
                    <div className="flex gap-2">
                      <div>
                        <input
                          ref={dueRef}
                          className="input h-10"
                          type="date"
                          placeholder="Schedule"
                        />
                      </div>

                      <Combobox value={selectedProject} onChange={setProjectselectedProject}>
                        <div className="relative">
                          <div className="foutline-none relative flex h-10 cursor-default items-center gap-1 overflow-hidden rounded-lg border border-gray-500 bg-white text-left text-sm focus-visible:ring-2 focus-visible:ring-primary-600">
                            {selectedProject ? (
                              <div className="pl-1">
                                {selectedProject.inbox_project ? (
                                  <InboxIcon
                                    className={`h-4 w-4 ${
                                      todoistTextColors[selectedProject.color]
                                    }`}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <div
                                    className={`h-3 w-3 rounded-full ${
                                      todoistBgColors[selectedProject?.color ?? "48"]
                                    }`}
                                  ></div>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                            <Combobox.Input
                              className="w-full border-none py-2 pl-0 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                              displayValue={(project: IProject) => project?.name}
                              onChange={(event) => debounceSetProjectQuery(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400 hover:text-gray-200"
                                aria-hidden="true"
                              />
                            </Combobox.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setProjectQuery("")}
                          >
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {filteredProjects?.length === 0 && projectQuery !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                  Nothing found.
                                </div>
                              ) : (
                                filteredProjects?.map((project) => (
                                  <Combobox.Option
                                    key={project.id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? "bg-primary-600 bg-opacity-30" : "text-gray-900"
                                      }`
                                    }
                                    value={project}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected ? "font-medium" : "font-normal"
                                          }`}
                                        >
                                          <span className="flex items-center gap-1">
                                            {project.inbox_project ? (
                                              <InboxIcon
                                                className={`h-3 w-3 ${
                                                  todoistTextColors[project.color]
                                                }`}
                                                aria-hidden="true"
                                              />
                                            ) : (
                                              <div
                                                className={`h-2 w-2 rounded-full ${
                                                  todoistBgColors[project.color]
                                                }`}
                                              ></div>
                                            )}
                                            {project.name}
                                          </span>
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>
                    </div>

                    <div className="flex gap-2">
                      <Listbox value={selectedPriority} onChange={setSelectedPriority}>
                        <div className="relative">
                          <Listbox.Button className="relative h-10 w-full cursor-default rounded-lg border border-gray-500 bg-white py-2 pl-3 pr-10 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
                            <FlagIcon
                              className={`$ h-6 w-6 ${
                                todoistPriorityColors[selectedPriority.value]
                              }`}
                              aria-hidden="true"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronDownIcon
                                className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-200"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {Priorities.map((item) => (
                                <Listbox.Option
                                  key={item.value}
                                  className={({ active }) =>
                                    `relative cursor-default select-none ${
                                      active ? "bg-primary-200 text-primary-600" : "text-gray-900"
                                    }`
                                  }
                                  value={item}
                                >
                                  {({ selected }) => (
                                    <div
                                      className={`grid place-items-center py-2 ${
                                        selected ? "bg-primary-100" : ""
                                      }`}
                                    >
                                      <FlagIcon
                                        className={`$ h-6 w-6 ${todoistPriorityColors[item.value]}`}
                                        aria-hidden="true"
                                      />
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>

                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button className="inline-flex h-10 w-full cursor-default justify-center rounded-md border border-gray-500 bg-opacity-20 px-4 py-2 text-sm font-medium outline-none hover:bg-opacity-30 focus-visible:ring-2 focus-visible:ring-primary-600">
                            Labels
                            <ChevronDownIcon
                              className="ml-2 -mr-1 h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-200"
                              aria-hidden="true"
                            />
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
                          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1">
                              {state.details?.labels.map((label) => {
                                return (
                                  <label
                                    key={label.id}
                                    className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-primary-600 hover:bg-opacity-30"
                                  >
                                    <div className="flex items-center text-gray-900">
                                      <TagIcon
                                        className={`mr-2 h-5 w-5 ${todoistTextColors[label.color]}`}
                                        aria-hidden="true"
                                      />
                                      {label.name}
                                    </div>
                                    <input
                                      type="checkbox"
                                      className="h-5 w-5 rounded-full border-gray-500 text-primary-600 shadow focus:ring-primary-600"
                                      checked={
                                        selectedLabels.find((id) => id === label.id) !== undefined
                                      }
                                      onChange={(e) => {
                                        handledLabelChange(e, label);
                                      }}
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t p-4">
                <input
                  type="submit"
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-primary-800 px-4 text-sm font-medium text-primary-50 hover:bg-primary-600  hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                  value="Add Task"
                />

                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-primary-600 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={setIsOpenHandler}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default AddTask;
