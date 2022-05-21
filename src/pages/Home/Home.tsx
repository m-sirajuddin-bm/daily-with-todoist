import { FolderAddIcon as FolderAddIconOut, PlusIcon } from "@heroicons/react/outline";
import { format, isBefore, isToday } from "date-fns";
import { orderBy } from "lodash";
import { useEffect, useState } from "react";
import Task from "../../components/Task";
import Loading from "../../components/utils/Loading";
import { ActionTypes } from "../../consts";
import { useAppContext } from "../../hooks";
import { ITask } from "../../interfaces/todoist-data.interface";
import { getLabelName, getProjectInfo, getSectionInfo } from "../../utils";

interface IHomeTask {
  overdue: ITask[];
  today: ITask[];
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { state, dispatchHandler } = useAppContext();
  const [homeTasks, setHomeTasks] = useState<IHomeTask>({
    overdue: [],
    today: [],
  });

  useEffect(() => {
    if (state.details.sync_token === "*") return;

    console.log(`[Home] update tasks!`);

    let overdueTasks = new Array();
    const todayTasks = new Array();

    state.details.items.forEach((f: ITask) => {
      // ignore non due/deleted tasks
      if (!f.due || f.is_deleted || f.checked) return;

      const due = new Date(f.due.date);
      // add custom property 'dueDate' to sort item
      f.dueDate = due;

      // add project/section/label details
      f.project = getProjectInfo(state.details.projects, f.project_id);
      f.section = getSectionInfo(state.details.sections, f.section_id);
      f.labelList = getLabelName(state.details.labels, f.labels);

      const today = new Date(format(new Date(), "yyyy-MM-dd"));
      if (isBefore(due, today)) {
        // add custom property 'overdue' to identify overdue tasks
        f.overdue = true;
        overdueTasks.push(f);
      } else if (isToday(due)) {
        todayTasks.push(f);
      }
    });

    overdueTasks = orderBy(
      overdueTasks,
      ["dueDate", "project_id", "child_order"],
      ["asc", "asc", "asc"]
    );

    const updatedTasks = {
      overdue: overdueTasks,
      today: todayTasks,
    };

    setHomeTasks((prev) => {
      return { ...prev, ...updatedTasks };
    });

    setLoading(false);
  }, [state.details.items]);

  // console.log(`[Home] updated!`);

  return (
    <>
      <div className="sticky top-0 z-10 shrink-0 bg-white shadow">
        <div className="px-3 lg:px-12">
          <div className="mx-auto flex w-full max-w-11/12 items-center justify-between py-6 lg:py-8 3xl:max-w-9/12">
            <div>
              <h1 className="text-2xl font-extrabold leading-none tracking-tight lg:text-3xl">
                Tasks
              </h1>
              {homeTasks?.today ? (
                <span className="ml-0.5 text-sm font-medium text-secondary lg:text-lg">
                  {homeTasks?.overdue.length + homeTasks?.today.length} remaining tasks
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <h1 className="flex flex-col">
                <span className="text- flgont-bold lg:text-xl">Today</span>
                <small className="text-xs text-secondary lg:text-sm">
                  {format(new Date(), "E dd MMM")}
                </small>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex w-full items-center justify-center pt-48">
          <Loading color="primary" />
        </div>
      ) : (
        ""
      )}

      {!loading && !homeTasks.overdue.length && !homeTasks.today.length ? (
        <div className="grid h-6/12 w-full place-items-center">
          <div className="flex flex-col items-center gap-4">
            <FolderAddIconOut className="mr-2 h-20 w-20 text-secondary" aria-hidden="true" />
            <div className="flex flex-col items-center gap-2">
              <span className="font-bold">No task pending</span>
              <span className="text-secondary">Get started by creating a new task</span>
            </div>
            <div>
              <button
                onClick={() => {
                  dispatchHandler(ActionTypes.TOGGLEADDTASK, true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-800 p-3 px-4 text-sm font-medium text-primary-50 hover:bg-primary-600 hover:text-white hover:shadow-md"
              >
                <PlusIcon className="h-6 w-6" aria-hidden="true" />
                <span className="block sm:hidden lg:block">New Task</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {!loading && (
        <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-2">
          <Task>
            {homeTasks.overdue.length ? (
              <Task.Section name="overdue">
                {homeTasks.overdue.map((task) => {
                  return <Task.Item key={task.id} task={task} state={state} />;
                })}
              </Task.Section>
            ) : (
              <></>
            )}

            {
              <Task.Section name={`${format(new Date(), "dd MMM")} ‧ today`}>
                {homeTasks.today.map((task) => {
                  return <Task.Item key={task.id} task={task} state={state} />;
                })}
              </Task.Section>
            }
          </Task>
        </div>
      )}
    </>
  );
}
