import { useEffect, useState } from "react";

const useLocalStorage = (key: "dark-theme", initialValue = false) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: boolean) => {
    try {
      // const valueToStore =
      //   value instanceof Function ? value(storedValue) : value;

      setStoredValue(value);

      // window.localStorage.setItem(key, JSON.stringify(valueToStore));

      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage("dark-theme");
  const isEnabled = true && enabled;

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
  }, [enabled, isEnabled]);

  return [enabled, setEnabled];
};

export default useDarkMode;
