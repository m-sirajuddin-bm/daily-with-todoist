import { IDetails } from "./todoist-data.interface";

export interface IAppContext {
  state: IAppState;
  dispatchHandler: (type: number, value: any) => void;
  doistSocketHandler: (url: string) => void;
}

export type SyncDataType = "all" | "user" | "labels" | "projects" | "items" | "sections";

export interface IAppState {
  token: string;
  syncData: SyncDataType[];
  details: IDetails;
  toggleSidebar: boolean;
  toggleAddTask: boolean;
}
