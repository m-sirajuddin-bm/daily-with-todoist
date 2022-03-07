import { debounce } from "lodash";
import { useCallback } from "react";

export const useDebounce = (callback: (...args: any) => void, delay: number) => {
  return useCallback(debounce(callback, delay), [delay]);
};
