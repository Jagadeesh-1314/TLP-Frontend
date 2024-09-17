import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  BackupOutlined,
  FileDownloadOutlined,
  FileUploadOutlined,
  Menu,
  PeopleAltOutlined,
  PlagiarismOutlined,
  ControlCamera,
  StorageOutlined,
  FormatListBulleted,
  PostAdd,
} from "@mui/icons-material";
import {
  Divider,
  Drawer,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAuth } from "../Auth/AuthProvider";

export default function Navbar({
  user,
  desg,
}: {
  user: string;
  desg: string;
}) {
  const { pathname } = useLocation();
  const pageLocation = pathname.split("/").filter((path) => path !== "")[0];
  const [openSideMenu, setOpenSideMenu] = useState(()=>{return false;});
  const navigate = useNavigate();
  const adminNavLinks = [
    { name: "Unfilled List", icon: <FormatListBulleted />},
    { name: "Report", icon: <PlagiarismOutlined /> },
    { name: "CFReport", icon: <PlagiarismOutlined /> },
    { name: "Electives", icon: <PostAdd /> },
    { name: "Upload", icon: <FileUploadOutlined /> },
    { name: "Manage Database", icon: <StorageOutlined /> },
    { name: "Backup and Restore", icon: <BackupOutlined /> },
  ];
  
  const nonAdminNavLinks: any[] = [
  ];
  
  const miscLinks = [
    { name: "Control", icon: <ControlCamera/> },
    { name: "Download", icon: <FileDownloadOutlined /> },
    { name: "Manage Users", icon: <PeopleAltOutlined /> },
  ];

  useEffect(() => {
    sessionStorage.setItem("lastPage", pageLocation);
    document.title = pageLocation
      ? pageLocation
        .split("/")
        .filter((path) => path !== "")[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      : "GCET TLP FEEDBACK";
  }, [pathname]);
  const {logOut} = useAuth()!;

  return (
    <>
    {}
      <nav
        className="sticky flex items-center justify-between top-0 w-full text-white px-5 py-3 z-50 no-print"
        style={{
          backgroundColor: "rgba(0 0 0 / 0.8)",
          backdropFilter: "blur(3px)",
        }}
      >
        <div className="flex justify-start items-center gap-4">
          <button
            onClick={() => setOpenSideMenu(true)}
            className={`rounded-full ${user === "admin" ? "inline-block" : "lg:hidden inline-block"
              }`}
          >
            <Menu fontSize="medium" />
          </button>
          {desg === "admin"
            ? adminNavLinks.map(({ name, icon }, indx) => {
              const activePage = name.toLowerCase().split(" ").join("-");

              return (
                <Link
                  key={indx}
                  to={activePage}
                  className={`nav-link relative ${activePage === pageLocation ? "active" : ""
                    } lg:flex hidden items-center gap-2 rounded-t-sm px-3 py-2 hover:bg-zinc-800 duration-300`}
                >
                  {icon}
                  {name}
                </Link>
              );
            })
            : nonAdminNavLinks.map(({ name, icon }, indx) => {
              const activePage = name.toLowerCase().split(" ").join("-");

              return (
                <Link
                  key={indx}
                  to={activePage}
                  className={`nav-link relative ${activePage === pageLocation ? "active" : ""
                    } lg:flex hidden items-center gap-2 rounded-t-sm px-3 py-2 hover:bg-zinc-800 duration-300`}
                >
                  {icon}
                  {name}
                </Link>
              );
            })}
        </div>
        <Logout desg = {desg} logOut={()=>{logOut();navigate("/login");}} />
      </nav>
      <SideMenu
        user={user}
        desg={desg}
        openSideMenu={openSideMenu}
        setOpenSideMenu={(a)=>{setOpenSideMenu(a)}}
        adminNavLinks={adminNavLinks}
        nonAdminNavLinks={nonAdminNavLinks}
        miscLinks={miscLinks}
        pageLocation={pageLocation}
      />
    </>
  );
}

function SideMenu({
  openSideMenu,
  setOpenSideMenu,
  user,
  desg,
  adminNavLinks,
  nonAdminNavLinks,
  miscLinks,
  pageLocation,
}: {
  openSideMenu: boolean;
  setOpenSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  user: string;
  desg: string;
  adminNavLinks: { name: string; icon: JSX.Element }[];
  nonAdminNavLinks: { name: string; icon: JSX.Element }[];
  miscLinks: { name: string; icon: JSX.Element }[];
  pageLocation: string;
}) {
  const handleLinkClick = () => {
    setOpenSideMenu(false);
  };
  const miscAccess:boolean = (desg === "admin" && user === 'admin');
  return (
    <Drawer
      anchor="left"
      open={openSideMenu}
      onClose={() => setOpenSideMenu(false)}
      sx={{
        backdropFilter: "blur(2px)",
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          minWidth: 300,
        },
      }}
    >
      <div className="flex flex-col text-black gap-y-2">
        <Typography variant="h6" p={2} fontWeight={"bold"}>
          Pages
        </Typography>
        <Divider />
        {desg === "admin"
          ? adminNavLinks.map(({ name, icon }, indx) => {
            const activePage = name.toLowerCase().split(" ").join("-");

            return (
              <Link
                key={indx}
                to={'/'+activePage}
                className={`flex items-center gap-2 rounded-sm p-4 hover:bg-zinc-300 duration-300 ${activePage === pageLocation ? "text-blue-500" : ""
                  }`}
                onClick={handleLinkClick}
              >
                {icon}
                {name}
              </Link>
            );
          })
          : nonAdminNavLinks.map(({ name, icon }, indx) => {
            const activePage = name.toLowerCase().split(" ").join("-");

            return (
              <Link
                key={indx}
                to={activePage}
                className={`flex items-center gap-2 rounded-sm p-4 hover:bg-zinc-300 duration-300 ${activePage === pageLocation ? "text-blue-500" : ""
                  }`}
                onClick={handleLinkClick}
              >
                {icon}
                {name}
              </Link>
            );
          })}
        {(miscAccess) && (
          <>
          
            <Typography variant="h6" p={2} fontWeight={"bold"}>
              Miscellaneous
            </Typography><Divider />
            {miscLinks.map(({ name, icon }, indx) => {
              const activePage = name.toLowerCase().split(" ").join("-");

              return (
                <Link
                  key={indx}
                  to={activePage}
                  className={`flex items-center gap-2 rounded-sm p-4 hover:bg-zinc-300 duration-300 ${activePage === pageLocation ? "text-blue-500" : ""
                    }`}
                  onClick={handleLinkClick}
                >
                  {icon}
                  {name}
                </Link>
              );
            })}
          </>
        )}
      </div>
    </Drawer>
  );
}


function Logout({
  logOut,
}: {
  // user: string;
  desg: string;
  logOut: any;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  let displayName = sessionStorage.getItem("displayName");
  const isAdmin = sessionStorage.getItem("desg") === "admin";

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    logOut(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };



  return (
    <>
      {isAdmin ? (
        <>
          <Tooltip title={displayName}>
            <button
              className="text-lg font-semibold tracking-wider bg-zinc-300 text-black flex justify-center items-center rounded-full size-10"
              onClick={handleClick}
            >
              {displayName?.split(" ").map((word) => word.toUpperCase()).join("")}
            </button>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip title={displayName}>
            <button
              className="text-lg font-semibold tracking-wider bg-zinc-300 text-black flex justify-center items-center rounded-full size-10"
              onClick={handleClick}
            >
              {displayName?.split(" ").slice(0, 2).map(word => word[0]).join("")}
            </button>
          </Tooltip>
        </>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography sx={{ p: 2 }}>Logout as {displayName}?</Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
          <button onClick={handleClose} className="blue-button-sm">Cancel</button>
          <button onClick={handleLogout} className="red-button-sm">Logout</button>
        </div>
      </Popover>
    </>
  );
}
