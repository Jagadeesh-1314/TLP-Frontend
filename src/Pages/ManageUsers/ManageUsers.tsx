import { useContext, useLayoutEffect, useState } from "react";
import { UsersTableArr, UserDetailsProps } from "../../Types/responseTypes";
import Axios from "axios";
import { LoadingContext } from "../../components/Context/Loading";
import { AlertContext } from "../../components/Context/AlertDetails";
import { CustDataGrid } from "../../components/Custom/CustDataGrid";
import {
  GridActionsCellItem,
  GridColDef,
  GridFooter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  Checkbox,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { CustDialog } from "../../components/Custom/CustDialog";
import { CustTextField } from "../../components/Custom/CustTextField";

// ANCHOR EXPORT FUNCTION  ||========================================================================
export default function ManageUsers() {
  // ANCHOR CONTEXTS  ||========================================================================
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // ANCHOR STATES && VARS  ||========================================================================
  const [userDetailsResponse, setUserDetailsResponse] = useState<UsersTableArr>(
    []
  );
  const usersColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "S No.",
      minWidth: 80,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "displayName",
      headerName: "Display Name",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 130,
      cellClassName: "actions",
      renderCell: ({ row }) => {
        return [
          <ManageUserDetails
            row={row}
            type="edit"
            userDetailsResponse={userDetailsResponse}
            setUserDetailsResponse={setUserDetailsResponse}
            key={1}
          />,
          <DeleteUser
            row={row}
            setUserDetailsResponse={setUserDetailsResponse}
            key={2}
          />,
        ];
      },
    },
  ];
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  // ANCHOR EFFECTS  ||========================================================================
  useLayoutEffect(() => {
    loading?.showLoading(true);
    Axios.get("api/manage/users")
      .then(({ data }) => {
        const { users }: { users: UsersTableArr } = data;
        setUserDetailsResponse(
          users.map((user, indx) => ({ ...user, id: indx + 1 }))
        );
      })
      .catch((err) => {
        console.log(err);
        alert?.showAlert("There was an error while geting data", "error");
      })
      .finally(() => loading?.showLoading(false));
  }, []);

  // ANCHOR JSX  ||========================================================================
  return (
    <>
      <Container maxWidth="lg" className={`bg-white py-4`}>
        <CustDataGrid
          rows={userDetailsResponse}
          columns={usersColumns}
          sx={{ height: 520 }}
          disableRowSelectionOnClick
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) =>
            setRowSelectionModel(newRowSelectionModel)
          }
          isRowSelectable={({ row }) => row.username !== "admin"}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{
            toolbar: () => (
              <div className="flex justify-between items-center p-4">
                <span className="lg:text-4xl text-2xl text-blue-600 font-semibold">
                  Active Users
                </span>
                <ManageUserDetails
                  type="add"
                  userDetailsResponse={userDetailsResponse}
                  setUserDetailsResponse={setUserDetailsResponse}
                />
              </div>
            ),
            footer: () => (
              <div className="flex flex-col p-4">
                <GridFooter />
                <MultipleUsersDelete
                  rowSelectionModel={rowSelectionModel}
                  setUserDetailsResponse={setUserDetailsResponse}
                  userDetailsResponse={userDetailsResponse}
                  setRowSelectionModel={setRowSelectionModel}
                />
              </div>
            ),
          }}
        />
      </Container>
    </>
  );
}

// ANCHOR USER DETAILS DIALOG  ||========================================================================
function ManageUserDetails({
  row,
  type,
  userDetailsResponse,
  setUserDetailsResponse,
}: {
  row?: UserDetailsProps;
  type: "edit" | "add";
  userDetailsResponse: UsersTableArr;
  setUserDetailsResponse: React.Dispatch<React.SetStateAction<UsersTableArr>>;
}) {
  // CONTEXTS  ||========================================================================
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // STATES && VARS  ||========================================================================
  const [openManageUsersDialog, setOpenManageUsersDialog] = useState(false);
  const [newUserDetails, setNewUserDetails] = useState(
    row ?? { username: "", displayName: "", password: "", confirmPassword: "" }
  );
  const [userExists, setUserExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // METHODS  ||========================================================================
  const isSaveable = (): boolean => {
    const { username, displayName, password, confirmPassword } = newUserDetails;

    if (username === "") return false;
    if (displayName === "") return false;
    if (type === "add") if (password === "") return false;
    if (password) {
      if (password !== confirmPassword) return false;
      if (password.length < 8) return false;
    }
    if (userExists) return false;
    return true;
  };

  // JSX  ||========================================================================
  return (
    <>
      {type === "add" ? (
        <button
          className="blue-button-filled"
          onClick={() => setOpenManageUsersDialog(true)}
          disabled={sessionStorage.getItem("username") !== "admin"}
        >
          Add New User
        </button>
      ) : (
        <GridActionsCellItem
          icon={<EditOutlined />}
          label="Edit"
          onClick={() => setOpenManageUsersDialog(true)}
          color="inherit"
          disabled={
            sessionStorage.getItem("username") !== "admin" &&
            sessionStorage.getItem("username") !== row?.username
          }
        />
      )}
      {/* ANCHOR MANAGE DIALOG  ||======================================================================== */}
      <CustDialog
        open={openManageUsersDialog}
        onClose={() => {
          setOpenManageUsersDialog(false);
          setNewUserDetails(() => {
            if (type === "add")
              return {
                username: "",
                displayName: "",
                password: "",
                confirmPassword: "",
              };
            return row as UserDetailsProps;
          });
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle component={"div"}>
          {type === "add" ? (
            <span className="text-4xl font-semibold text-blue-600">
              Add New User
            </span>
          ) : (
            <span className="text-4xl font-semibold text-blue-600">
              Edit User {row?.username}
            </span>
          )}
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loading?.showLoading(true);
            if (type === "edit") {
              Axios.patch(`api/manage/user`, {
                details: { ...newUserDetails, oldUsername: row?.username },
              })
                .then(({ data }) => {
                  if (data.done) {
                    setOpenManageUsersDialog(false);
                    alert?.showAlert(
                      `Updated ${newUserDetails?.username}`,
                      "success"
                    );
                    setUserDetailsResponse((prevVals) =>
                      prevVals.map((details) => {
                        if (details.username === row?.username) {
                          return newUserDetails;
                        }
                        return details;
                      })
                    );
                  }
                })
                .catch((err) => {
                  alert?.showAlert(
                    `There was an error while updating ${newUserDetails?.username}`,
                    "error"
                  );
                  console.log(err);
                })
                .finally(() => loading?.showLoading(false));
            } else {
              Axios.post(`api/manage/user`, {
                details: newUserDetails,
              })
                .then(({ data }) => {
                  if (data.done) {
                    setOpenManageUsersDialog(false);
                    alert?.showAlert("Added new user", "success");
                    setUserDetailsResponse((prevVals) => [
                      ...prevVals,
                      {
                        ...newUserDetails,
                        id: prevVals.length + 1,
                        password: "",
                        confirmPassword: "",
                      },
                    ]);
                  }
                })
                .catch((err) => {
                  alert?.showAlert(`There was an error while adding`, "error");
                  console.log(err);
                })
                .finally(() => loading?.showLoading(false));
            }
          }}
        >
          {/* ANCHOR MANAGE DIALOG CONTENT  ||======================================================================== */}
          <DialogContent>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:justify-between md:items-center justify-center">
              <CustTextField
                label="Username"
                value={newUserDetails?.username}
                onChange={({ target: { value } }) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    username: value.toLowerCase().trim(),
                  })
                }
                onBlur={() => {
                  if (
                    userDetailsResponse?.find(
                      (user) => user.username === newUserDetails?.username
                    ) &&
                    newUserDetails.username !== row?.username
                  ) {
                    alert?.showAlert("Username already taken", "warning");
                    setUserExists(true);
                  } else {
                    setUserExists(false);
                  }
                }}
              />
              <CustTextField
                label="Display Name"
                value={newUserDetails?.displayName}
                onChange={({ target: { value } }) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    displayName: value,
                  })
                }
              />
              <CustTextField
                sx={{ mb: "auto" }}
                label={type === "add" ? "Password" : "Edit Password"}
                type={showPassword ? "text" : "password"}
                value={newUserDetails?.password ?? ""}
                onChange={({ target: { value } }) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    password: value,
                  })
                }
                error={
                  newUserDetails?.password?.trim()?.length < 8 &&
                  newUserDetails?.password?.trim()?.length > 0
                }
              />
              <CustTextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={newUserDetails?.confirmPassword ?? ""}
                onChange={({ target: { value } }) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    confirmPassword: value,
                  })
                }
                error={
                  newUserDetails?.password !==
                    newUserDetails?.confirmPassword &&
                  newUserDetails?.password?.trim()?.length >= 8
                }
                helperText={
                  newUserDetails?.password !==
                    newUserDetails?.confirmPassword &&
                  newUserDetails?.confirmPassword?.trim()?.length > 0
                    ? "Passwords do not match"
                    : ""
                }
                disabled={!Boolean(newUserDetails?.password)}
              />
              <FormGroup sx={{ marginRight: "auto" }}>
                <FormControlLabel
                  label="Show password"
                  control={
                    <Checkbox
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={!Boolean(newUserDetails.password)}
                    />
                  }
                />
              </FormGroup>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className="red-button"
              onClick={() => setOpenManageUsersDialog(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="blue-button"
              disabled={!isSaveable()}
            >
              Save
            </button>
          </DialogActions>
        </form>
      </CustDialog>
    </>
  );
}

// ANCHOR DELETE DIALOG  ||========================================================================
function DeleteUser({
  row,
  setUserDetailsResponse,
}: {
  row: UserDetailsProps;
  setUserDetailsResponse: React.Dispatch<React.SetStateAction<UsersTableArr>>;
}) {
  // CONTEXTS  ||========================================================================
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // STATES  ||========================================================================
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  // JSX  ||========================================================================
  return (
    <>
      <GridActionsCellItem
        icon={<DeleteOutline />}
        label="Delete"
        color="error"
        onClick={() => setOpenDeleteConfirmDialog(true)}
        disabled={
          row?.username === "admin" ||
          sessionStorage.getItem("username") !== "admin"
        }
      >
        Delete
      </GridActionsCellItem>

      {/* ANCHOR DELETE CONFIRM DIALOG ||======================================================================== */}
      <CustDialog open={openDeleteConfirmDialog} maxWidth="md" fullWidth>
        <DialogTitle component={"div"}>
          <span className="text-4xl font-semibold text-red-600">
            Cofirm delete
          </span>
        </DialogTitle>
        {/* ANCHOR DELETE CONFIRM DIALOG CONTENT ||======================================================================== */}
        <DialogContent>
          <span className="text-xl">
            This will delete the user {row?.username} permanatly.
          </span>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button"
            onClick={() => setOpenDeleteConfirmDialog(false)}
          >
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              Axios.delete(
                `api/manage/user?username=${JSON.stringify([row?.username])}`
              )
                .then(({ data }) => {
                  if (data.deleted) {
                    setOpenDeleteConfirmDialog(false);
                    setUserDetailsResponse((prevVals) =>
                      prevVals
                        .filter(({ username }) => username !== row?.username)
                        .map((details, indx) => ({ ...details, id: indx + 1 }))
                    );
                    alert?.showAlert(
                      `Deleted user ${row?.username}`,
                      "success"
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                  alert?.showAlert(
                    "There was an error while deleting  ",
                    "error"
                  );
                })
                .finally(() => loading?.showLoading(false));
            }}
          >
            Delete
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}

function MultipleUsersDelete({
  rowSelectionModel,
  userDetailsResponse,
  setUserDetailsResponse,
  setRowSelectionModel,
}: {
  rowSelectionModel: GridRowSelectionModel;
  userDetailsResponse: UsersTableArr;
  setUserDetailsResponse: React.Dispatch<React.SetStateAction<UsersTableArr>>;
  setRowSelectionModel: React.Dispatch<
    React.SetStateAction<GridRowSelectionModel>
  >;
}) {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  let selectedRowsUsernames: string[] = [];
  rowSelectionModel.forEach((rowId) => {
    selectedRowsUsernames.push(
      userDetailsResponse[(rowId as number) - 1]?.username
    );
  });
  return (
    <>
      <button
        className="red-button-outline ml-auto"
        disabled={!rowSelectionModel.length}
        onClick={() => setOpenDeleteConfirmDialog(true)}
      >
        Delete Selected
      </button>

      <CustDialog open={openDeleteConfirmDialog} maxWidth="md" fullWidth>
        <DialogTitle component={"div"}>
          <span className="text-red-600 text-4xl text-semibold">
            Delete selected rows
          </span>
        </DialogTitle>
        <DialogContent>
          <span className="text-lg font-semibold">
            This action will delete the following users and this action cannot
            be undone.
          </span>
          <div className="mt-4">{selectedRowsUsernames.join(", ")}</div>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button"
            onClick={() => setOpenDeleteConfirmDialog(false)}
          >
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              Axios.delete(
                `api/manage/user?username=${JSON.stringify(
                  selectedRowsUsernames
                )}`
              )
                .then(({ data }) => {
                  if (data.deleted) {
                    setRowSelectionModel([]);
                    setOpenDeleteConfirmDialog(false);
                    setUserDetailsResponse((prevVals) =>
                      prevVals
                        .filter(
                          ({ username }) =>
                            !selectedRowsUsernames.includes(username)
                        )
                        .map((details, indx) => ({
                          ...details,
                          id: indx + 1,
                        }))
                    );
                    alert?.showAlert(`Users deleted`, "success");
                  }
                })
                .catch((err) => {
                  console.log(err);
                  alert?.showAlert(
                    "There was an error while deleting  ",
                    "error"
                  );
                })
                .finally(() => loading?.showLoading(false));
            }}
          >
            Delete
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}
