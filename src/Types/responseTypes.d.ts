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
  id: number;
  rollNo: string;
  subCode: string;
  subName: string;
  grade: Grades;
  acYear: 1 | 2 | 3 | 4;
  sem: 1 | 2;
  exYear: number;
  exMonth: number;
  user: string;
  total: number;
  regDate: Dayjs;
  stat: "R" | "S";
  branch: string;
}

export type ManageDBResponseArr = ManageDBResponseProps[];

export type AvailableDbTables =
  | "studentInfo"
  | "subjects"
  | "facutly"
  | "paidReEvaluation"
  | "printReval"
  | "paidCBT"
  | "printCBT";

export interface UserDetailsProps {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export type UsersTableArr = UserDetailsProps[];
