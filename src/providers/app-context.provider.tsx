import { uniqBy } from "lodash";
import { createContext, useReducer, useRef } from "react";
import { ActionTypes } from "../consts";
import { useDebounce } from "../hooks";
import { IAppContext, IAppState, SyncDataType } from "../interfaces";
import { getTodoistData } from "../utils";

const initialState = {
  token: "",
  details: {
    full_sync: false,
    items: [],
    labels: [],
    projects: [],
    sections: [],
    sync_token: "*",
    temp_id_mapping: {},
    user: {},
  },
  toggleSidebar: false,
  toggleAddTask: false,
  socketConnection: undefined,
  toggleProgress: false,
};

function updateState(data: any[], payload: any[]) {
  if (!data.length) return payload;

  const result = uniqBy([...data, ...payload], "id");

  result.forEach((r) => {
    payload.forEach((p) => {
      if (r.id === p.id) {
        Object.keys(p).forEach((k) => {
          r[k] = p[k] || r[k];
        });
      }
    });
  });

  return result;
}

const AppContext = createContext<IAppContext>({
  state: initialState,
  dispatchHandler: (type: number, value: any) => {},
  doistSocketHandler: (url: string) => {},
  syncData: (resouceTypes: SyncDataType[]) => {},
});

const reducer = (
  state: IAppState,
  action: {
    type: number;
    value: any;
  }
) => {
  switch (action.type) {
    case ActionTypes.TOKEN:
      return { ...state, token: action.value };
    case ActionTypes.DETAILS:
      let updated = {
        ...state.details,
        full_sync: action.value.full_sync,
        sync_token: action.value.sync_token,
        temp_id_mapping: { ...state.details.temp_id_mapping, ...action.value.temp_id_mapping },
        user: { ...state?.details?.user, ...action.value.user },
      };

      if (action.value?.labels.length) {
        updated = {
          ...updated,
          labels: updateState(state.details.labels, action.value.labels),
        };
      }

      if (action.value?.projects.length) {
        updated = {
          ...updated,
          projects: updateState(state.details.projects, action.value.projects),
        };
      }

      if (action.value?.sections.length) {
        updated = {
          ...updated,
          sections: updateState(state.details.sections, action.value.sections),
        };
      }

      if (action.value?.items.length) {
        updated = {
          ...updated,
          items: updateState(state.details.items, action.value.items),
        };
      }

      return { ...state, details: updated, syncData: [] };
    case ActionTypes.TOGGLESIDEBAR:
      return { ...state, toggleSidebar: action.value };
    case ActionTypes.TOGGLEADDTASK:
      return { ...state, toggleAddTask: action.value };
    case ActionTypes.TOGGLEPROGRESS:
      return { ...state, toggleProgress: action.value };
    default:
      return state;
  }
};

export function AppContextProvider(props: any) {
  const [data, dispatch] = useReducer(reducer, initialState);
  const doistSocket = useRef<WebSocket>();

  // dispatch handler to update state
  const dispatchHandler = (type: number, value: any) => {
    console.log("dispatchHandler: ", { type, value });

    dispatch({ type: type, value });
  };

  const syncData = async (resouceTypes: SyncDataType[], token?: string, sync_token?: string) => {
    try {
      console.log("Sync data: ", resouceTypes);

      dispatchHandler(ActionTypes.TOGGLEPROGRESS, true);

      const response = await getTodoistData(
        token ?? data.token,
        {
          resource_types: resouceTypes || ["all"],
        },
        sync_token ?? data.details.sync_token
      );

      console.log("Sync data response: ", response.data);

      dispatchHandler(ActionTypes.DETAILS, response.data);
    } catch (error) {
    } finally {
      dispatchHandler(ActionTypes.TOGGLEPROGRESS, false);
    }
  };

  // debouce for sync data
  const debounceSyncData = useDebounce(syncData, 800);

  // doist socket handler
  const doistSocketHandler = (url: string) => {
    const socket = new WebSocket(url);

    socket.onopen = (e) => {
      console.log("[open] Connection established: ", url);
    };

    socket.onmessage = (event) => {
      console.log(`[message] Data received from server: ${event.data}`);
      const { type, client_id } = JSON.parse(event.data);
      if (client_id !== undefined && type === "sync_needed") {
        debounceSyncData(["all"], data.token, data.details.sync_token);
      }
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.error("[close] Connection died");
      }
    };

    socket.onerror = (error) => {
      console.error(`[error] ${error}`);
    };

    doistSocket.current = socket;
  };

  let context = {
    state: data,
    dispatchHandler,
    doistSocketHandler,
    syncData,
  };

  return <AppContext.Provider value={context}>{props.children}</AppContext.Provider>;
}

export default AppContext;
