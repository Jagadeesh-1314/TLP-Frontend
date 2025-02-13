import { Dayjs } from "dayjs";

interface LoginResponseParams {
  goahead: boolean;
  userName?: string;
  error?: string;
}

export interface Branch {
  branch: string;
}

export interface ManageDBResponseProps {
  id?: number;
  facID?: string;
  facName?: string;
  qtype?: string;
  def?: string;
  batch?: string;
  subCode?: string;
  subName?: string;
  rollno?: string;
  Name?: string;
  sem?: string;
  sec?: string;
  branch?: string;
}


export type ManageDBResponseArr = ManageDBResponseProps[];

export type AvailableDbTables =
  | "studentinfo"
  | "subjects"
  | "faculty"
  | "timetable"
  | "electives"

export type TableVisibilityType = {
  [key: string]: boolean;
}

export interface Question {
  qtype: string;
  question: string;
  seq: number
}

export interface UserDetailsProps {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  branch: string;
}

export type UsersTableArr = UserDetailsProps[];

export interface Subjects {
  subCode: string;
  subname: string;
  qtype: string;
  facID: string;
  facName: string;
}

export interface Score {
  [key: string]: { [key: string]: number };
}


export interface EmptyFeedbackProps {
  title: string;
  subtitle: string;
}

export interface FeedbackCardProps {
  title: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  children: React.ReactNode;
}

export interface StepperComponentProps {
  sub: Subjects[];
  len: number;
}

export interface ReportDetails {
  facName?: string;
  subcode?: string;
  facID?: string;
  subname?: string;
  sec?: string;
  sem?: number;
  percentile?: number;
  batch?: number;
  branch?: string;
  percentile1?: number;
  percentile2?: number;
  completed?: number;
  total_students?: number;
}

export interface SecList {
  sec: string;
}

export interface ReportResponse {
  done: boolean;
  details: ReportDetail[];
}
export interface ReportQuestion {
  question: string;
  branch: string;
  sem: number;
  batch: number;
  sec: string;
  subcode: string;
  facID: string;
  count: number;
  total: number;
  adjusted_total: number;
  avg_adjusted_total: number;
  adjusted_total1: number;
  adjusted_total2: number;
}


export interface Student {
  rollno: number;
  name: string;
  sec: string;
  sem: number;
  status: string;
}


export interface CFReportResponse {
  details: { batch: number; branch: string, sem: number, sem_type: string, percentile: number, percentile1: number, percentile2: number, avg_percentile: number }[];
  done: boolean;
}

export interface CFQuestion {
  question: string;
  branch: string;
  sem: number;
  term: number;
  total: number;
  adjusted_total: number;
}

export interface CFReportItem {
  branch: string;
  batch: number;
  percentile: number;  
  percentile1: number;
  percentile2: number;
  sem_type: string;
  avg_percentile: number;
}