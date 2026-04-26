import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  InputBase,
  IconButton,
} from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../api";
import { tokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import TeachersTable from "../../components/TeachersTable";
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
import Alert from "@mui/material/Alert";
import { ImportExport } from "@mui/icons-material";

const Teachers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    phone: "",
    school_name: user?.school_name,
    subjects: "",
    qualification: "",
    experience: "",
    address: "",
    status: "active",
  });
  const [openSuccess, setOpenSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [isexport, setIsexport] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleChange = (event) => {
    setTeacherData({ ...teacherData, [event.target.name]: event.target.value });
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
    setTeacherData({
      name: "",
      email: "",
      gender: "",
      password: "",
      phone: "",
      school_name: user?.school_name,
      subjects: "",
      qualification: "",
      experience: "",
      address: "",
      status: "active",
    });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...teacherData,
        subjects: teacherData.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const response = await apiRequest.post(
        "/api/admin/signup-teacher",
        dataToSend,
      );

      const msg = response.data.message;
      setOpenSuccess(msg || "Teacher added successfully!");
      clearForm();
      setOpen(false);
      setError("");
      setRefresh((prev) => !prev);
    } catch (err) {
      setError("Failed. Please check fields and try again.");
    }
  };

  return (
    <Box m="20px">
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" fontWeight="bold" mb={1}>
              Teachers
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your Teachers right here.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          sx={{
            color: colors.blueAccent[300],
            width: { xs: "100%", sm: "200px" },
          }}
        >
          <InputBase
            sx={{ color: colors.blueAccent[300], flex: 1, px: 2 }}
            placeholder="Search student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton type="button" sx={{ color: colors.blueAccent[300] }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            color: colors.blueAccent[300],
            width: { xs: "100%", sm: "150px" },
          }}
        >
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

        <Button
          variant="contained"
          sx={{ backgroundColor: colors.blueAccent[400] }}
          onClick={setIsexport.bind(null, true)}
          startIcon={<ImportExport />}
        >
          Export Teachers
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: colors.blueAccent[400] }}
          onClick={handleClickOpen}
          startIcon={<SaveIcon />}
        >
          Add Teacher
        </Button>
      </Box>

      <Box mt={3}>
        <TeachersTable
          search={search}
          classFilter={classFilter}
          isexport={isexport}
          refresh={refresh}
        />
      </Box>

      {/* Add Teacher Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: colors.primary[400],
            color: colors.greenAccent[300],
          }}
        >
          Add New Teacher
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={teacherData.name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={teacherData.email}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={teacherData.password}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={teacherData.phone}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={teacherData.gender}
                  onChange={handleChange}
                  input={<OutlinedInput label="Gender" />}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={teacherData.status}
                  onChange={handleChange}
                  input={<OutlinedInput label="Status" />}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              label="Subjects (comma-separated)"
              name="subjects"
              value={teacherData.subjects}
              onChange={handleChange}
              placeholder="Mathematics, Physics, Chemistry"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Qualification"
                name="qualification"
                value={teacherData.qualification}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Experience"
                name="experience"
                value={teacherData.experience}
                onChange={handleChange}
                placeholder="e.g., 5 years"
              />
            </Box>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={teacherData.address}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Add Teacher
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>{openSuccess}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccess(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teachers;
