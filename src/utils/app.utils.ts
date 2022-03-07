import axios from "axios";
import { ILabel, IProject, ISection } from "../interfaces/todoist-data.interface";

export const getLabelName = (labels: ILabel[], ids: number[]) => {
  return labels.filter((f) => ids.includes(f.id));
};

export const getProjectInfo = (projects: IProject[], id: number) => {
  return projects.find((f) => f.id === id);
};

export const getSectionInfo = (sections: ISection[], id: number | null) => {
  return sections.find((f) => f.id === id);
};

export const getTodoistData = async (token: string, body: any, syncToken = "*") => {
  return await axios.post(
    "https://api.todoist.com/sync/v8/sync",
    {
      ...body,
      sync_token: syncToken,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
