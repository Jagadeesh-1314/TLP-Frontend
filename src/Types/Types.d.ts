interface NavLinkProps {
  name: string;
  icon: JSX.Element;
}

interface LoginCredentialsProps {
  username: string;
  password: string;
  displayName: string;
}

type Grades = "O" | "A+" | "A" | "B+" | "B" | "C" | "F";

type Pages =
  | "revaluation"
  | "download"
  | "sem"
  | "feedback"
  | "upload"
  | "manage-users"
  | "manage-costs"
  | "backup-and-restore"
  | "manage-database"
  | "test";
