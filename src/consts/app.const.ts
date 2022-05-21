import { format } from "date-fns";

export const Priorities = [
  { name: "P1", value: 1 },
  { name: "P2", value: 2 },
  { name: "P3", value: 3 },
  { name: "P4", value: 4 },
];

const getTomorrowDate = () => {
  let date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

export const Schedules = [
  {
    id: "nodue",
    label: "No Due",
    value: "No Due",
  },
  {
    id: "today",
    label: "Today",
    value: format(new Date(), "yyyy-MM-dd"),
  },
  {
    id: "tomorrow",
    label: "Tomorrow",
    value: format(getTomorrowDate(), "yyyy-MM-dd"),
  },
  {
    id: "datetime",
    label: "DateTime",
    value: "",
  },
];
