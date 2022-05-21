import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../../hooks";
import AddTaskDialog from "../../AddTaskDialog";
import Header from "../Header";
import Sidebar from "../Sidebar";

function AdminLayout() {
  const { state, doistSocketHandler, syncData } = useAppContext();

  useEffect(() => {
    syncData(["user", "labels", "projects", "items", "sections"]);
  }, []);

  useEffect(() => {
    if (!state.details.user?.websocket_url) return;

    doistSocketHandler(state.details.user.websocket_url);
  }, [state.details.user?.websocket_url]);

  return (
    <>
      <AddTaskDialog />
      <div className="flex h-full min-h-screen">
        <Sidebar />
        <div className="h-full w-full flex-1">
          <Header />
          <div className="relative h-[calc(100%-65px)] w-full overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
