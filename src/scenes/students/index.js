import * as React from "react";
import { useContext, useState } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { AuthContext } from "../../context/AuthContext";

import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "../../theme";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SaveIcon from "@mui/icons-material/Save";
import { apiRequest } from "../../api";
import StudentsTable from "../../components/Data";

const Students = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [error, setError] = React.useState("");
  const { user } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [studentData, setStudentData] = React.useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    classLevel: "",
    phone: "",
    school_name: user?.school_name,
  });
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [isexport, setIsexport] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (event) => {
    setStudentData({ ...studentData, [event.target.name]: event.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      setError("");
      clearForm();
    }
  };

  const clearForm = () => {
    setStudentData({
      name: "",
      email: "",
      gender: "",
      password: "",
      classLevel: "",
      phone: "",
      school_name: user?.school_name,
    });
  };

  const handleSave = async () => {
    try {
      const response = await apiRequest.post(
        "/api/admin/signup-student",
        studentData,
      );

      const msg = response.data.message;

      setOpenSuccess(msg || "Student added successfully!");
      clearForm();
      setOpen(false);
      setError("");
      setRefresh((prev) => !prev);
    } catch (err) {
      setError("Failed to save student. Please try again.");
    }
  };

  const uploadMultipleFiles = async (selectedFiles) => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await apiRequest.post("/api/bulk/students/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    setRefresh((prev) => !prev);
    setFiles([]);
    setIsUploading(false);

    if (errorCount === 0) {
      setOpenSuccess(`${successCount} file(s) uploaded successfully!`);
    } else {
      setOpenSuccess(`${successCount} file(s) uploaded, ${errorCount} failed.`);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      uploadMultipleFiles(selectedFiles);
    }
  };

  // close success on windo click
  React.useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        setOpenSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSuccess, error]);

  return (
    <Box m="20px">
      {/* error */}
      {error && (
        <Box>
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        </Box>
      )}
      {openSuccess && (
        <Box sx={{ position: "absolute", mt: 2, width: "30%", zIndex: "1" }}>
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            {openSuccess}
          </Alert>
        </Box>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Students
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Students.
          </Typography>
        </Box>
      </Box>

      {/* dialog */}
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill Student Data</DialogTitle>
        {error && (
          <Box>
            <Alert severity="info" sx={{ ml: 2, mr: 2 }}>
              {error}
            </Alert>
          </Box>
        )}
        <DialogContent>
          <Box
            className="student-form"
            component="form"
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                name="name"
                label="Name"
                variant="filled"
                value={studentData.name}
                onChange={handleChange}
                sx={{ color: colors.blueAccent[300] }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                name="phone"
                label="Phone"
                variant="filled"
                value={studentData.phone}
                onChange={handleChange}
                sx={{ color: colors.blueAccent[300] }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="gender-id">Gender</InputLabel>
              <Select
                sx={{ color: colors.blueAccent[300] }}
                labelId="gender-id"
                name="gender"
                value={studentData.gender}
                onChange={handleChange}
                input={<OutlinedInput label="Gender" />}
                onFocus={() => setError("")}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                name="email"
                label="Email"
                variant="filled"
                value={studentData.email}
                onChange={handleChange}
                sx={{ color: colors.blueAccent[300] }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                name="password"
                label="Password"
                variant="filled"
                value={studentData.password}
                onChange={handleChange}
                sx={{ color: colors.blueAccent[300] }}
                onFocus={() => setError("")}
              />
            </FormControl>{" "}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="classLevel-id">Class Level</InputLabel>
              <Select
                labelId="classLevel-id"
                name="classLevel"
                value={studentData.classLevel}
                onChange={handleChange}
                input={<OutlinedInput label="Class Level" />}
                sx={{ color: colors.blueAccent[300] }}
                onFocus={() => setError("")}
              >
                <MenuItem value="S1">S1</MenuItem>
                <MenuItem value="S2">S2</MenuItem>
                <MenuItem value="S3">S3</MenuItem>
                <MenuItem value="S4">S4</MenuItem>
                <MenuItem value="S5">S5</MenuItem>
                <MenuItem value="S6">S6</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: colors.greenAccent[500],
              borderColor: colors.greenAccent[500],
              "&:hover": {
                backgroundColor: colors.greenAccent[500],
                color: colors.primary[500],
              },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading
            variant="outlined"
            loadingPosition="end"
            startIcon={<SaveIcon />}
            sx={{
              color: colors.greenAccent[500],
              borderColor: colors.greenAccent[500],
              "&:hover": {
                backgroundColor: colors.greenAccent[500],
                color: colors.primary[500],
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* end */}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb="16px"
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Stack spacing={2} direction="row">
          <Button
            sx={{ p: 1 }}
            onClick={handleClickOpen}
            variant="contained"
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Add Student
          </Button>

          {/* Single upload button for multiple files */}
          <Box sx={{ position: "relative" }}>
            <input
              type="file"
              accept=".xlsx,.xls"
              multiple
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="upload-files-input"
            />
            <Button
              component="label"
              htmlFor="upload-files-input"
              disabled={isUploading}
              sx={{ p: 1 }}
              variant="contained"
              color={theme.palette.mode === "dark" ? "secondary" : "primary"}
            >
              {isUploading ? "Uploading..." : "Upload Multiple Files"}
            </Button>
          </Box>

          <Button
            sx={{ p: 1 }}
            onClick={() => setIsexport(!isexport)}
            variant="contained"
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Export
          </Button>
        </Stack>

        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          sx={{ width: { xs: "100%", md: "320px" } }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1, p: 1.4 }}
            placeholder="Search student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="classLevel-label">Class</InputLabel>
            <Select
              labelId="label"
              value={classFilter}
              label="Class"
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>All Students</em>
              </MenuItem>
              <MenuItem value="S1">S1</MenuItem>
              <MenuItem value="S2">S2</MenuItem>
              <MenuItem value="S3">S3</MenuItem>
              <MenuItem value="S4">S4</MenuItem>
              <MenuItem value="S5">S5</MenuItem>
              <MenuItem value="S6">S6</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <StudentsTable
        search={search}
        classFilter={classFilter}
        isexport={isexport}
        refresh={refresh}
      />
    </Box>
  );
};

export default Students;
