import { Dayjs } from "dayjs";

interface LoginResponseParams {
  goahead: boolean;
  userName?: string;
  error?: string;
}


export interface ExamSearchSubjectsProps {
  A: {
    subCodes: string[];
    subNames: string[];
  };
  B: {
    subCodes: string[];
    subNames: string[];
  };
  C: {
    subCodes: string[];
    subNames: string[];
  };
  D: {
    subCodes: string[];
    subNames: string[];
  };
  E: {
    subCodes: string[];
    subNames: string[];
  };
  F: {
    subCodes: string[];
    subNames: string[];
  };
  G: {
    subCodes: string[];
    subNames: string[];
  };
  H: {
    subCodes: string[];
    subNames: string[];
  };
}

export interface ExamSemProps {
  subCodes: string[];
  subNames: string[];
}

export interface ManageDBResponseProps {
  facID: string;
  subCode: string;
  sem: number;
  sec: string;
  branch: string;
}

export type ManageDBResponseArr = ManageDBResponseProps[];

export type AvailableDbTables =
  | "studentInfo"
  | "subjects"
  | "faculty"
  | "timetable"

export interface UserDetailsProps {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  branch: string;
}

export type UsersTableArr = UserDetailsProps[];
