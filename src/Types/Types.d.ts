interface NavLinkProps {
  name: string;
  icon: JSX.Element;
}

interface LoginCredentialsProps {
  username: string;
  password: string;
  displayName: string;
}


type Pages =
  | "download"
  | "sem"
  | "feedback"
  | "upload"
  | "manage-users"
  | "unfilledlist"
  | "backup-and-restore"
  | "manage-database"
  | "electives"
  | "test";
