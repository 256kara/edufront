import * as React from "react";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { apiRequest } from "../api";
import { AuthContext } from "../context/AuthContext";
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

function StudentsTable({ search, classFilter, isexport, refresh }) {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = React.useState("");

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Profile modal state
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});

  useEffect(() => {
    fetchStudents();
  }, [page, { search }, { classFilter }, refresh]);

  const fetchStudents = async () => {
    try {
      if (!user?.school_name) return;
      const res = await apiRequest.get(
        `http://localhost:5000/api/admin/students/${user?.school_name}?page=${page}&search=${search}&class=${classFilter}`,
      );
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await apiRequest.delete(
        `http://localhost:5000/api/admin/delete-student/${id}`,
      );
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setEditedStudent({ ...student });
    setEditMode(false);
    setProfileOpen(true);
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Update student data via API
      await apiRequest.put(
        `http://localhost:5000/api/admin/update-student/${selectedStudent.userId}`,
        editedStudent,
      );

      // Update local state
      setStudents(
        students.map((student) =>
          student._id === selectedStudent._id ? editedStudent : student,
        ),
      );

      setEditMode(false);
      setProfileOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditedStudent({ ...selectedStudent });
    setEditMode(false);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedStudent(null);
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setEditedStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const capusername = (uname) => {
    if (!uname) return ""; // Handle empty or null strings
    return uname.charAt(0).toUpperCase() + uname.slice(1);
  };

  const exportExcel = () => {
    const exportData = students?.map((student) => ({
      "ADMISSION NO": student.admissionNumber,
      NAME: capusername(student.name),
      CLASS: capusername(student.classLevel),
      STREAM: capusername(student.stream),
      GENDER: capusername(student.gender),
      PHONE: student.phone || "",
      EMAIL: student.email || "",
      NIN: student.nin || "",
      COMBINATION: capusername(student.combination),
      ADDRESS: student.address || "",
      "HEALTH STATUS": capusername(student.healthStatus),
      "EMERGENCY CONTACT": student.emergencyContact || "",
      USERNAME: student.username || "",
      LIN: student.lin || "",
      PASSWORD: "defaultpassword123", // Default password for bulk import
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "students.xlsx");
  };

  //   export run once
  useEffect(() => {
    if (isexport) {
      exportExcel();
      return;
    }
  }, [isexport]);

  const columns = [
    {
      field: "admissionNumber",
      headerName: "Admission",
      minWidth: isMobile ? 80 : 100,
      flex: isMobile ? 0.8 : 1,
      hide: isMobile, // Hide admission on mobile
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: false,
    },
    {
      field: "classLevel",
      headerName: "Class",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.8 : 0.8,
      hide: false,
    },
    {
      field: "stream",
      headerName: "Stream",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.6 : 0.8,
      hide: true, // Always hide stream
    },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.8 : 0.8,
      hide: false,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.6 : 0.8,
      hide: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.8 : 0.8,
      hide: true, // Hide phone on mobile
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: true,
    },
    {
      field: "nin",
      headerName: "NIN",
      minWidth: isMobile ? 60 : 80,
      flex: isMobile ? 0.8 : 0.8,
      hide: true,
    },
    {
      field: "combination",
      headerName: "Combination",
      minWidth: isMobile ? 80 : 120,
      flex: isMobile ? 0.8 : 1.0,
      hide: true,
    },
    {
      field: "address",
      headerName: "Address",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: true,
    },
    {
      field: "healthStatus",
      headerName: "Health Status",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: true,
    },
    {
      field: "emergencyContact",
      headerName: "Emergency Contact",
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 2 : 2,
      hide: true,
    },
    {
      field: "username",
      headerName: "Username",
      minWidth: isMobile ? 80 : 120,
      flex: isMobile ? 0.8 : 1.0,
      hide: true,
    },
    {
      field: "lin",
      headerName: "LIN",
      minWidth: isMobile ? 80 : 120,
      flex: isMobile ? 0.8 : 1.0,
      hide: true,
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
            onClick={() => deleteStudent(params.row.userId)}
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
    students?.map((student) => ({
      id: student._id,
      admissionNumber: student.admissionNumber,
      name: capusername(student.name),
      classLevel: capusername(student.classLevel),
      stream: capusername(student.stream),
      gender: capusername(student.gender),
      status: capusername(student.status),
      userId: student.userId,
      phone: student.phone,
      email: student.email,
      nin: student.nin,
      combination: student.combination,
      address: student.address,
      healthStatus: student.healthStatus,
      emergencyContact: student.emergencyContact,
      username: student.username,
      lin: student.lin,
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

      {/* Student Profile Modal */}
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
            {selectedStudent?.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Typography variant="h6">
            {editMode ? "Edit Student Profile" : "Student Profile"}
          </Typography>
          <Typography>{error ? { error } : null}</Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedStudent && (
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
                    Basic Information{" "}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Admission Number"
                    value={
                      editMode
                        ? editedStudent.admissionNumber || ""
                        : selectedStudent.admissionNumber || ""
                    }
                    onChange={(e) =>
                      handleInputChange("admissionNumber", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={
                      editMode
                        ? editedStudent.name || ""
                        : selectedStudent.name || ""
                    }
                    onChange={(e) => handleInputChange("name", e.target.value)}
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
                        ? editedStudent.gender || ""
                        : selectedStudent.gender || ""
                    }
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
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
                        ? editedStudent.email || ""
                        : selectedStudent.email || ""
                    }
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                {/* Academic Information */}
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
                    Academic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    variant={editMode ? "outlined" : "filled"}
                  >
                    <InputLabel>Class Level</InputLabel>
                    <Select
                      value={
                        editMode
                          ? editedStudent.classLevel || ""
                          : selectedStudent.classLevel || ""
                      }
                      onChange={(e) =>
                        handleInputChange("classLevel", e.target.value)
                      }
                      readOnly={!editMode}
                      inputProps={{ readOnly: !editMode }}
                    >
                      <MenuItem value="S1">S1</MenuItem>
                      <MenuItem value="S2">S2</MenuItem>
                      <MenuItem value="S3">S3</MenuItem>
                      <MenuItem value="S4">S4</MenuItem>
                      <MenuItem value="S5">S5</MenuItem>
                      <MenuItem value="S6">S6</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stream"
                    value={
                      editMode
                        ? editedStudent.stream || ""
                        : selectedStudent.stream || ""
                    }
                    onChange={(e) =>
                      handleInputChange("stream", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                {/* Contact Information */}
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
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={
                      editMode
                        ? editedStudent.phone || ""
                        : selectedStudent.phone || ""
                    }
                    onChange={(e) => handleInputChange("phone", e.target.value)}
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
                        ? editedStudent.phone || ""
                        : selectedStudent.phone || ""
                    }
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={
                      editMode
                        ? editedStudent.status || ""
                        : selectedStudent.status || ""
                    }
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                {/* Additional Information */}
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
                    Additional Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="National ID (NIN)"
                    value={
                      editMode
                        ? editedStudent.nin || ""
                        : selectedStudent.nin || ""
                    }
                    onChange={(e) => handleInputChange("nin", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Subject Combination"
                    value={
                      editMode
                        ? editedStudent.combination || ""
                        : selectedStudent.combination || ""
                    }
                    onChange={(e) =>
                      handleInputChange("combination", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={
                      editMode
                        ? editedStudent.username || ""
                        : selectedStudent.username || ""
                    }
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LIN"
                    value={
                      editMode
                        ? editedStudent.lin || ""
                        : selectedStudent.lin || ""
                    }
                    onChange={(e) => handleInputChange("lin", e.target.value)}
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                {/* Health & Emergency Information */}
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
                    Health & Emergency Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Health Status"
                    value={
                      editMode
                        ? editedStudent.healthStatus || ""
                        : selectedStudent.healthStatus || ""
                    }
                    onChange={(e) =>
                      handleInputChange("healthStatus", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    value={
                      editMode
                        ? editedStudent.emergencyContact || ""
                        : selectedStudent.emergencyContact || ""
                    }
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    InputProps={{ readOnly: !editMode }}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={3}
                    value={
                      editMode
                        ? editedStudent.address || ""
                        : selectedStudent.address || ""
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

export default StudentsTable;
