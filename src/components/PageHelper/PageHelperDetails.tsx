import { ReactNode } from "react";
import { RevalParams } from "../../misc/Helper Details/Revaluation/Parameters";
import { RevalProcedure } from "../../misc/Helper Details/Revaluation/Procedure";
import { RevalOverview } from "../../misc/Helper Details/Revaluation/Overview";
import { RevalExceptions } from "../../misc/Helper Details/Revaluation/Exceptions";
import { SuppleOverview } from "../../misc/Helper Details/Supplementary/Overview";
import { SuppleParams } from "../../misc/Helper Details/Supplementary/Parameters";
import { SuppleProcedure } from "../../misc/Helper Details/Supplementary/Procedure";
import { SuppleExceptions } from "../../misc/Helper Details/Supplementary/Exceptions";
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
  revaluation: {
    overview: <RevalOverview />,
    parameters: <RevalParams />,
    procedure: <RevalProcedure />,
    exceptions: <RevalExceptions />,
  },
  supplementary: {
    overview: <SuppleOverview />,
    parameters: <SuppleParams />,
    procedure: <SuppleProcedure />,
    exceptions: <SuppleExceptions />,
  },
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
  "manage-costs": {
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
};
