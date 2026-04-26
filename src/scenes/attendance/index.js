import * as React from "react";
import { useContext } from "react";
import {
  Box,
  // InputBase,
  IconButton,
  Button,
  Typography,
  useTheme,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  // useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { tokens } from "../../theme";
import { AuthContext } from "../../context/AuthContext";
// import { apiRequest } from "../../api";
// import { DataGrid } from "@mui/x-data-grid";
import useAttendance from "../../hooks/useAttendance";

const Attendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useContext(AuthContext);

  const {
    attendanceRecords,
    students,
    selectedDate,
    setSelectedDate,
    selectedClass,
    setSelectedClass,
    error,
    setError,
    success,
    setSuccess,
    attendanceData,
    handleAttendanceChange,
    handleSaveAttendance,
  } = useAttendance(user);

  // Get attendance status color
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "success";
      case "absent":
        return "error";
      case "late":
        return "warning";
      default:
        return "default";
    }
  };

  // Get attendance status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircleIcon />;
      case "absent":
        return <CancelIcon />;
      default:
        return null;
    }
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h3" fontWeight="bold" mb={1}>
          Attendance Management
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Mark and manage student attendance
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Box
          sx={{
            backgroundColor: colors.redAccent[800],
            color: colors.redAccent[100],
            p: 2,
            borderRadius: 1,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{error}</Typography>
          <IconButton
            size="small"
            onClick={() => setError("")}
            sx={{ color: colors.redAccent[100] }}
          >
            ×
          </IconButton>
        </Box>
      )}

      {success && (
        <Box
          sx={{
            backgroundColor: colors.greenAccent[800],
            color: colors.greenAccent[100],
            p: 2,
            borderRadius: 1,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{success}</Typography>
          <IconButton
            size="small"
            onClick={() => setSuccess("")}
            sx={{ color: colors.greenAccent[100] }}
          >
            ×
          </IconButton>
        </Box>
      )}

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Date Picker */}
        <TextField
          type="date"
          label="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        />

        {/* Class Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Class</InputLabel>
          <Select
            value={selectedClass}
            label="Class"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <MenuItem value="">Select Class</MenuItem>
            <MenuItem value="S1">S1</MenuItem>
            <MenuItem value="S2">S2</MenuItem>
            <MenuItem value="S3">S3</MenuItem>
            <MenuItem value="S4">S4</MenuItem>
            <MenuItem value="S5">S5</MenuItem>
            <MenuItem value="S6">S6</MenuItem>
          </Select>
        </FormControl>

        {/* Save Button */}
        {selectedClass && (
          <Button
            variant="contained"
            onClick={handleSaveAttendance}
            color={theme.palette.mode === "dark" ? "primary" : "secondary"}
          >
            Save Attendance
          </Button>
        )}
      </Box>

      {/* Attendance Table */}
      {selectedClass && students.length > 0 && (
        <Card sx={{ backgroundColor: colors.primary[400] }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Attendance for {selectedClass} -{" "}
              {new Date(selectedDate).toLocaleDateString()}
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ backgroundColor: colors.primary[500] }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: colors.grey[100], fontWeight: "bold" }}
                    >
                      Student
                    </TableCell>
                    <TableCell
                      sx={{ color: colors.grey[100], fontWeight: "bold" }}
                    >
                      Admission No
                    </TableCell>
                    <TableCell
                      sx={{ color: colors.grey[100], fontWeight: "bold" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ color: colors.grey[100], fontWeight: "bold" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell sx={{ color: colors.grey[100] }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {student.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Typography>{student.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[100] }}>
                        {student.admissionNumber}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={attendanceData[student._id] || "present"}
                          color={getStatusColor(
                            attendanceData[student._id] || "present",
                          )}
                          size="small"
                          icon={getStatusIcon(
                            attendanceData[student._id] || "present",
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            variant={
                              attendanceData[student._id] === "present"
                                ? "contained"
                                : "outlined"
                            }
                            color="success"
                            onClick={() =>
                              handleAttendanceChange(student._id, "present")
                            }
                          >
                            Present
                          </Button>
                          <Button
                            size="small"
                            variant={
                              attendanceData[student._id] === "absent"
                                ? "contained"
                                : "outlined"
                            }
                            color="error"
                            onClick={() =>
                              handleAttendanceChange(student._id, "absent")
                            }
                          >
                            Absent
                          </Button>
                          <Button
                            size="small"
                            variant={
                              attendanceData[student._id] === "late"
                                ? "contained"
                                : "outlined"
                            }
                            color="warning"
                            onClick={() =>
                              handleAttendanceChange(student._id, "late")
                            }
                          >
                            Late
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* No Class Selected Message */}
      {!selectedClass && (
        <Card
          sx={{
            backgroundColor: colors.primary[400],
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Please select a class to mark attendance
          </Typography>
        </Card>
      )}

      {/* Attendance Summary */}
      {attendanceRecords.length > 0 && (
        <Box mt={3}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Attendance Summary -{" "}
                {new Date(selectedDate).toLocaleDateString()}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color={colors.greenAccent[400]}>
                      {
                        attendanceRecords.filter((r) => r.status === "present")
                          .length
                      }
                    </Typography>
                    <Typography color="textSecondary">Present</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color={colors.redAccent[400]}>
                      {
                        attendanceRecords.filter((r) => r.status === "absent")
                          .length
                      }
                    </Typography>
                    <Typography color="textSecondary">Absent</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color={colors.yellowAccent[400]}>
                      {
                        attendanceRecords.filter((r) => r.status === "late")
                          .length
                      }
                    </Typography>
                    <Typography color="textSecondary">Late</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color={colors.blueAccent[400]}>
                      {students.length}
                    </Typography>
                    <Typography color="textSecondary">
                      Total Students
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Attendance;
