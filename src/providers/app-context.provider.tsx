import { uniqBy } from "lodash";
import { createContext, useReducer, useRef } from "react";
import { ActionTypes } from "../consts";
import { useDebounce } from "../hooks";
import { IAppContext, IAppState } from "../interfaces";

const initialState = {
  token: "",
  syncData: [],
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
};

function updateState(state: any[], payloads: any[]) {
  if (!state.length) return payloads;

  const updated = payloads.map((p) => {
    let item = state.find((f) => f.id === p.id);
    if (item) {
      Object.keys(p).forEach((key) => {
        item[key] = p[key] || item[key];
      });
    }
    return item ?? p;
  });

  return uniqBy([...state, ...updated], "id");
}

const AppContext = createContext<IAppContext>({
  state: initialState,
  dispatchHandler: (type: number, value: any) => {},
  doistSocketHandler: (url: string) => {},
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
    case ActionTypes.SYNCDATA:
      return { ...state, syncData: action.value };
    case ActionTypes.DETAILS:
      let updated = {
        ...state.details,
        full_sync: action.value.full_sync,
        sync_token: action.value.sync_token,
        temp_id_mapping: { ...state.details.temp_id_mapping, ...action.value.temp_id_mapping },
        user: { ...state?.details?.user, ...action.value.user },
        labels: updateState(state.details.labels, action.value.labels),
        projects: updateState(state.details.projects, action.value.projects),
        items: updateState(state.details.items, action.value.items),
        sections: updateState(state.details.sections, action.value.sections),
      };
      return { ...state, details: updated, syncData: [] };
    case ActionTypes.TOGGLESIDEBAR:
      return { ...state, toggleSidebar: action.value };
    case ActionTypes.TOGGLEADDTASK:
      return { ...state, toggleAddTask: action.value };
    default:
      return state;
  }
};

export function AppContextProvider(props: any) {
  const [data, dispatch] = useReducer(reducer, initialState);
  const doistSocket = useRef<WebSocket>();

  // dispatch handler to update state
  const dispatchHandler = (type: number, value: any) => {
    dispatch({ type: type, value });
  };

  // debouce for dispactch handler
  const debounceDispatchHandler = useDebounce((type: number, value: any) => {
    dispatchHandler(type, value);
  }, 1000);

  // doist socket handler
  const doistSocketHandler = (url: string) => {
    const socket = new WebSocket(url);

    socket.onopen = function (e) {
      console.log("[open] Connection established: ", url);
    };

    socket.onmessage = (event) => {
      console.log(`[message] Data received from server: ${event.data}`);
      const { type, client_id } = JSON.parse(event.data);

      if (client_id !== undefined && type === "sync_needed") {
        debounceDispatchHandler(ActionTypes.SYNCDATA, ["all"]);
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
  };

  return <AppContext.Provider value={context}>{props.children}</AppContext.Provider>;
}

export default AppContext;
