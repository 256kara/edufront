import * as XLSX from "xlsx";
import { useState, useEffect, useCallback } from "react";
import { useContext } from "react";
// import { apiRequest } from "../api";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../api";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

function TeachersTable({ search, classFilter, isexport, refresh }) {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Profile modal state
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState({});

  const fetchTeachers = useCallback(async () => {
    if (!user?.school_name) return;
    try {
      const response = await apiRequest.get(
        `http://localhost:5000/api/admin/teachers/${user.school_name}`,
      );
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      setTeachers([]);
    }
  }, [user?.school_name]);

  useEffect(() => {
    fetchTeachers();
  }, [page, search, classFilter, refresh, fetchTeachers]);

  const deleteTeacher = async (id) => {
    try {
      await apiRequest.delete(`/api/admin/delete-teacher/${id}`);
      setTeachers(teachers.filter((teacher) => teacher._id !== id));
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  };

  const handleViewProfile = (teacher) => {
    setSelectedTeacher(teacher);
    setEditedTeacher({ ...teacher });
    setEditMode(false);
    setProfileOpen(true);
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    try {
      const dataToSave = { ...editedTeacher };
      // Convert subject string back to array
      if (dataToSave.subject) {
        dataToSave.subjects = dataToSave.subject
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        delete dataToSave.subject;
      }
      await apiRequest.put(
        `/api/admin/update-teacher/${selectedTeacher._id}`,
        dataToSave,
      );
      setTeachers(
        teachers.map((teacher) =>
          teacher._id === selectedTeacher._id
            ? { ...teacher, ...dataToSave }
            : teacher,
        ),
      );
      setEditMode(false);
      setProfileOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error("Failed to update teacher:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditedTeacher({ ...selectedTeacher });
    setEditMode(false);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedTeacher(null);
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setEditedTeacher((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const capusername = (uname) => {
    if (!uname) return "";
    return uname.charAt(0).toUpperCase() + uname.slice(1);
  };

  const exportExcel = useCallback(() => {
    const exportData = teachers?.map((teacher) => ({
      NAME: capusername(teacher.name),
      EMAIL: teacher.email || "",
      PHONE: teacher.phone || "",
      GENDER: capusername(teacher.gender),
      SUBJECT: capusername(
        teacher.subjects?.join(", ") || teacher.subject || "",
      ),
      QUALIFICATION: teacher.qualification || "",
      EXPERIENCE: teacher.experience || "",
      ADDRESS: teacher.address || "",
      STATUS: capusername(teacher.status),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

    XLSX.writeFile(workbook, "teachers.xlsx");
  }, [teachers]);

  useEffect(() => {
    if (isexport) {
      exportExcel();
    }
  }, [isexport, exportExcel]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: false,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.8 : 0.8,
      hide: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.8 : 0.8,
      hide: false,
    },
    {
      field: "subject",
      headerName: "Subject",
      minWidth: isMobile ? 80 : 120,
      flex: isMobile ? 0.8 : 1.0,
      hide: false,
    },
    {
      field: "qualification",
      headerName: "Qualification",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: true,
    },
    {
      field: "experience",
      headerName: "Experience",
      minWidth: isMobile ? 80 : 120,
      flex: isMobile ? 0.8 : 1.0,
      hide: true,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.6 : 0.8,
      hide: false,
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: isMobile ? 80 : 120,
      flex: isMobile ? 0.8 : 1.0,
      hide: false,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" width="100%" gap={0.2}>
          <IconButton
            onClick={() => handleViewProfile(params.row)}
            size="small"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              },
            }}
            title="View Profile"
          >
            <VisibilityIcon fontSize="medium" />
          </IconButton>
          <IconButton
            onClick={() => deleteTeacher(params.row._id)}
            size="small"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.error.light
                  : theme.palette.error.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.error.dark
                    : theme.palette.error.light,
                color: theme.palette.error.contrastText,
              },
            }}
            title="Delete"
          >
            <DeleteIcon fontSize="medium" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows =
    teachers?.map((teacher) => ({
      id: teacher._id,
      name: capusername(teacher.name),
      email: teacher.email,
      phone: teacher.phone,
      gender: capusername(teacher.gender),
      subject: capusername(teacher.subjects?.[0] || ""),
      qualification: teacher.qualification,
      experience: teacher.experience,
      status: capusername(teacher.status),
      address: teacher.address,
    })) || [];

  return (
    <div>
      <Box
        sx={{
          height: isMobile ? 350 : 400,
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #ddd",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            py: isMobile ? 1 : 1.5,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderBottom: "none",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            fontWeight: 600,
            minHeight: isMobile ? "40px" : "56px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: theme.palette.background.paper,
            minHeight: isMobile ? "40px" : "56px",
          },
          "& .MuiDataGrid-row": {
            minHeight: isMobile ? "40px" : "52px",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: isMobile ? 5 : 10 },
            },
          }}
          pageSizeOptions={isMobile ? [5] : [5, 10, 25]}
          disableSelectionOnClick
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          hideFooterSelectedRowCount
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        />
      </Box>

      <div style={{ marginTop: "10px" }}>
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          sx={{ p: 1 }}
          variant="contained"
          color={theme.palette.mode === "dark" ? "secondary" : "primary"}
        >
          Prev
        </Button>

        <span style={{ margin: "10px" }}>Page {page}</span>

        <Button
          onClick={() => setPage(page + 1)}
          sx={{ p: 1 }}
          variant="contained"
          color={theme.palette.mode === "dark" ? "secondary" : "primary"}
        >
          Next
        </Button>
      </div>

      {/* Teacher Profile Modal */}
      <Dialog
        open={profileOpen}
        onClose={handleCloseProfile}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.secondary.main,
              width: 40,
              height: 40,
            }}
          >
            {selectedTeacher?.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Typography variant="h6">
            {editMode ? "Edit Teacher Profile" : "Teacher Profile"}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedTeacher && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "secondary" : "primary",
                    }}
                  >
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={
                      editMode
                        ? editedTeacher.name || ""
                        : selectedTeacher.name || ""
                    }
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={
                      editMode
                        ? editedTeacher.email || ""
                        : selectedTeacher.email || ""
                    }
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={
                      editMode
                        ? editedTeacher.phone || ""
                        : selectedTeacher.phone || ""
                    }
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    value={
                      editMode
                        ? editedTeacher.gender || ""
                        : selectedTeacher.gender || ""
                    }
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                {/* Professional Information */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "secondary" : "primary",
                      mt: 2,
                    }}
                  >
                    Professional Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={
                      editMode
                        ? editedTeacher.subject || ""
                        : selectedTeacher.subjects?.join(", ") ||
                          selectedTeacher.subject ||
                          ""
                    }
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Qualification"
                    value={
                      editMode
                        ? editedTeacher.qualification || ""
                        : selectedTeacher.qualification || ""
                    }
                    onChange={(e) =>
                      handleInputChange("qualification", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience"
                    value={
                      editMode
                        ? editedTeacher.experience || ""
                        : selectedTeacher.experience || ""
                    }
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant={editMode ? "outlined" : "filled"}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={
                        editMode
                          ? editedTeacher.status || ""
                          : selectedTeacher.status || ""
                      }
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      readOnly={!editMode}
                      inputProps={{ readOnly: !editMode }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={3}
                    value={
                      editMode
                        ? editedTeacher.address || ""
                        : selectedTeacher.address || ""
                    }
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          {!editMode ? (
            <>
              <Button
                onClick={handleCloseProfile}
                variant="outlined"
                color="secondary"
              >
                Close
              </Button>
              <Button
                onClick={handleEditProfile}
                variant="contained"
                color="primary"
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleCancelEdit}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TeachersTable;
