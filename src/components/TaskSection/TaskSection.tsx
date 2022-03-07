import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { ITask } from "../../interfaces/todoist-data.interface";
import TaskItem from "../TaskItem";

function TaskSection(props: { name: string; tasks: ITask[] }) {
  return (
    <>
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full rounded-lg bg-gray-300 px-2 py-2 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 lg:px-12">
              <div className="mx-auto flex max-w-11/12 items-center justify-between text-left text-lg font-bold text-primary-900 3xl:max-w-9/12">
                <span className="capitalize">
                  {props.name} ({props.tasks.length})
                </span>
                <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 `} />
              </div>
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel static className="text-sm text-gray-500">
                <div className="px-2 lg:px-12">
                  {props.tasks.map((task) => {
                    return <TaskItem key={task.id} task={task} />;
                  })}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default TaskSection;
