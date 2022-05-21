export interface IProject {
  child_order: number;
  collapsed: 0 | 1;
  color: number;
  id: number;
  inbox_project: boolean;
  is_archived: number;
  is_deleted: number;
  is_favorite: number;
  name: "Inbox";
  parent_id: number | null;
  shared: boolean;
  sync_id: number | null;
}

export interface ISection {
  collapsed: boolean;
  date_added: Date | string;
  date_archived: Date | string;
  id: number;
  is_archived: boolean;
  is_deleted: boolean;
  name: string;
  project_id: number;
  section_order: 1;
  sync_id: number | null;
  user_id: number;
}

export interface ILabel {
  color: number;
  id: number;
  is_deleted: number;
  is_favorite: number;
  item_order: number;
  name: string;
}

export interface ITask {
  added_by_uid: number;
  assigned_by_uid: number | null;
  checked: 0 | 1;
  child_order: number;
  collapsed: 0 | 1;
  content: string;
  date_added: Date | string;
  date_completed: Date | string | null;
  day_order: number;
  description: string;
  due: ITaskDue;
  id: number;
  in_history: 0 | 1;
  is_deleted: 0 | 1;
  labels: number[];
  parent_id: number | null;
  priority: 1 | 2 | 3 | 4;
  project_id: number;
  responsible_uid: number | null;
  section_id: number | null;
  sync_id: number | null;
  user_id: number;
  overdue?: boolean;
  dueDate?: Date;
  project?: IProject;
  section?: ISection;
  labelList?: ILabel[];
}

export interface ITaskDue {
  date: Date | string;
  is_recurring: boolean;
  lang: string;
  string: string;
  timezone: string;
}

export interface IUser {
  auto_reminder: number;
  avatar_big: string;
  avatar_medium: string;
  avatar_s640: string;
  avatar_small: string;
  business_account_id: number | null;
  daily_goal: number;
  date_format: number;
  dateist_inline_disabled: boolean;
  dateist_lang:
    | "da"
    | "de"
    | "en"
    | "es"
    | "fi"
    | "fr"
    | "it"
    | "ja"
    | "ko"
    | "nl"
    | "pl"
    | "pt_BR"
    | "ru"
    | "sv"
    | "tr"
    | "zh_CN"
    | "zh_TW"
    | null;
  days_off: 1 | 2 | 3 | 4 | 5 | 6 | 7[];
  default_reminder: "email" | "push";
  email: string;
  features: {
    beta: 0 | 1;
    dateist_inline_disabled: boolean;
    dateist_lang: string | null;
    has_push_reminders: boolean;
    karma_disabled: boolean;
    karma_vacation: boolean;
    restriction: 0 | 1;
  };
  full_name: string;
  id: number;
  image_id: string;
  inbox_project: number;
  is_biz_admin: boolean;
  is_premium: boolean;
  join_date: string;
  karma: number;
  karma_trend: string;
  lang:
    | "da"
    | "de"
    | "en"
    | "es"
    | "fi"
    | "fr"
    | "it"
    | "ja"
    | "ko"
    | "nl"
    | "pl"
    | "pt_BR"
    | "ru"
    | "sv"
    | "tr"
    | "zh_CN"
    | "zh_TW"
    | null;
  mobile_host: string | null;
  mobile_number: string | null;
  next_week: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  premium_until: null;
  share_limit: 25;
  sort_order: 0;
  start_day: 1;
  start_page: string;
  theme: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  time_format: 0 | 1;
  tz_info: {
    gmt_string: string;
    hours: number;
    is_dst: 0 | 1;
    minutes: number;
    timezone: "string";
  };
  unique_prefix: number;
  websocket_url: string;
  weekly_goal: number;
}

export interface IDetails {
  full_sync: boolean;
  items: ITask[];
  labels: ILabel[];
  projects: IProject[];
  sections: ISection[];
  sync_token: string;
  temp_id_mapping: any;
  user: IUser | any;
}
