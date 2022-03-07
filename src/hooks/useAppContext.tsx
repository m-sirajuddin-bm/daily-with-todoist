import { useContext } from "react";
import AppContext from "../providers/app-context.provider";

export const useAppContext = () => {
  return useContext(AppContext);
};
