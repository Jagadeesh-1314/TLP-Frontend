import { ReactNode } from "react";
import { DownOverview } from "../../misc/Helper Details/Download/Overview";
import { DownParams } from "../../misc/Helper Details/Download/Parameters";
import { DownProcedure } from "../../misc/Helper Details/Download/Procedure";

export const HelperContents: {
  [key in Pages]: {
    overview: ReactNode;
    parameters: ReactNode;
    procedure: ReactNode;
    exceptions?: ReactNode;
  };
} = {
  feedback: {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  download: {
    overview: <DownOverview />,
    parameters: <DownParams />,
    procedure: <DownProcedure />,
  },
  upload: {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  "backup-and-restore": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  "manage-database": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  "manage-users": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  test: {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  sem: {
    overview: undefined,
    parameters: undefined,
    procedure: undefined,
    exceptions: undefined
  },
  unfilledlist: {
    overview: undefined,
    parameters: undefined,
    procedure: undefined,
    exceptions: undefined
  },
  electives: {
    overview: undefined,
    parameters: undefined,
    procedure: undefined,
    exceptions: undefined
  }
};
