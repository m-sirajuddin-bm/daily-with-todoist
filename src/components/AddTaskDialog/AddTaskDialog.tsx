import { ActionTypes } from "../../consts";
import { useAppContext } from "../../hooks";
import AddTask from "../Task/AddTask";
import AppDialog from "../utils/Dialog";

function AddTaskDialog() {
  const { state, dispatchHandler } = useAppContext();

  const setIsOpenHandler = () => {
    dispatchHandler(ActionTypes.TOGGLEADDTASK, false);
  };

  return (
    <AppDialog
      className="relative mx-auto max-w-3xl rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
      isOpen={state.toggleAddTask}
      onClose={setIsOpenHandler}
    >
      <AddTask onAddTask={setIsOpenHandler} onCancel={setIsOpenHandler}></AddTask>
    </AppDialog>
  );
}

export default AddTaskDialog;
