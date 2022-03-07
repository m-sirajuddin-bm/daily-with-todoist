import { debounce } from "lodash";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ActionTypes } from "../../../consts";
import { useAppContext } from "../../../hooks";
import { getTodoistData } from "../../../utils/app.utils";
import AddTask from "../../AddTask";
import Header from "../Header";
import Sidebar from "../Sidebar";

function AdminLayout() {
  const { state, dispatchHandler, doistSocketHandler } = useAppContext();

  useEffect(() => {
    dispatchHandler(ActionTypes.SYNCDATA, ["user", "labels", "projects", "items", "sections"]);
  }, []);

  useEffect(() => {
    if (state.syncData.length) {
      syncData();
    }
  }, [state.syncData]);

  const syncData = async () => {
    console.log("Sync data from server: ", state.syncData);

    const { data } = await getTodoistData(
      state.token,
      {
        resource_types: JSON.stringify(state.syncData),
      },
      state.details?.sync_token
    );

    console.log("Sync data: ", data);

    dispatchHandler(ActionTypes.DETAILS, data);
  };

  useEffect(() => {
    if (!state.details.user?.websocket_url) return;

    doistSocketHandler(state.details.user.websocket_url);
  }, [state.details.user?.websocket_url]);

  return (
    <>
      <AddTask />
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
