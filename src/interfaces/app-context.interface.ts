import { IDetails } from "./todoist-data.interface";

export interface IAppContext {
  state: IAppState;
  dispatchHandler: (type: number, value: any) => void;
  doistSocketHandler: (url: string) => void;
  syncData: (resouceTypes: SyncDataType[]) => void;
}

export type SyncDataType = "all" | "user" | "labels" | "projects" | "items" | "sections";

export interface IAppState {
  token: string;
  details: IDetails;
  toggleSidebar: boolean;
  toggleAddTask: boolean;
  toggleProgress: boolean;
}
