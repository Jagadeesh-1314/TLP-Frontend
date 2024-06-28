import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Fullscreen, FullscreenExit, Help } from "@mui/icons-material";

import { CustDialog } from "../Custom/CustDialog";

import "./styles.css";
import { HelperContents } from "./PageHelperDetails";

export function PageHelper() {
  const { pathname } = useLocation();
  const helperContents = HelperContents[pathname.split("/")[1] as Pages];

  const [openHelperDialog, setOpenHelperDialog] = useState(false);
  const [viewInFullScreen, setViewInFullScreen] = useState(false);

  useEffect(() => setOpenHelperDialog(false), [pathname]);

  return (
    <div className="page-helper">
      <button
        className="rounded-full text-blue-500"
        onClick={() => {
          setViewInFullScreen(false);
          setOpenHelperDialog(true);
        }}
      >
        <Help />
      </button>
      <CustDialog
        open={openHelperDialog}
        onClose={() => setOpenHelperDialog(false)}
        maxWidth="xl"
        fullWidth
        fullScreen={viewInFullScreen}
        sx={{ transitionDuration: 300 }}
      >
        <DialogTitle component={"div"}>
          <div className="flex justify-between items-center">
            <span className="lg:text-5xl md:text-4xl text-3xl text-blue-600 font-semibold">
              {pathname
                .split("/")
                .filter((path) => path !== "")[0]
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
            <button
              className="rounded-full md:inline hidden"
              onClick={() => {
                setViewInFullScreen((prevVal) => !prevVal);
              }}
            >
              {!viewInFullScreen ? (
                <Fullscreen fontSize="large" />
              ) : (
                <FullscreenExit fontSize="large" />
              )}
            </button>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col mt-4 divide-neutral-900 gap-8 page-helper-contents">
            <section>
              <div className="page-helper-section-title">Overview</div>
              <div className="page-helper-section-content">
                {helperContents.overview}
              </div>
            </section>
            <section>
              <div className="page-helper-section-title">Parameters</div>
              <div className="page-helper-section-content">
                {helperContents.parameters}
              </div>
            </section>
            <section>
              <div className="page-helper-section-title">Procedure</div>
              <div className="page-helper-section-content">
                {helperContents.procedure}
              </div>
            </section>
            {helperContents.exceptions && (
              <section>
                <div className="page-helper-section-title">Exceptions</div>
                <div className="page-helper-section-content">
                  {helperContents.exceptions}
                </div>
              </section>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="blue-button"
            onClick={() => setOpenHelperDialog(false)}
          >
            Close
          </button>
        </DialogActions>
      </CustDialog>
    </div>
  );
}
