import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  InputBase,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // Paper,
  // Chip,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../api";
import { tokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const Timetable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);

  const [timetables, setTimetables] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [timetableData, setTimetableData] = useState({
    classLevel: "",
    day: "",
    periods: [
      {
        subject: "",
        teacher: "",
        startTime: "",
        endTime: "",
        room: "",
      },
    ],
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const classLevels = ["S.1", "S.2", "S.3", "S.4", "S.5", "S.6"];
  const fetchTimetables = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get(
        `/api/timetable/${user?.school_name}?classLevel=${classFilter}&day=${dayFilter}`,
      );
      setTimetables(response.data.timetables);
    } catch (err) {
      setError("Failed to fetch timetables");
    } finally {
      setLoading(false);
    }
  }, [classFilter, dayFilter, user?.school_name]);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await apiRequest.get(
        `/api/timetable/teachers/${user?.school_name}`,
      );
      setTeachers(response.data.teachers);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  }, [user?.school_name]);

  useEffect(() => {
    fetchTimetables();
    fetchTeachers();
  }, [fetchTimetables, fetchTeachers]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // const fetchTeachers = async () => {

  // };

  useEffect(() => {
    fetchTimetables();
  }, [classFilter, dayFilter, fetchTimetables]);

  const handleClickOpen = () => {
    setOpen(true);
    setEditingTimetable(null);
    setTimetableData({
      classLevel: "",
      day: "",
      periods: [
        {
          subject: "",
          teacher: "",
          startTime: "",
          endTime: "",
          room: "",
        },
      ],
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTimetable(null);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      // Validate required fields
      if (!timetableData.classLevel || !timetableData.day) {
        setError("Class level and day are required");
        return;
      }

      if (timetableData.periods.length === 0) {
        setError("At least one period is required");
        return;
      }

      // Validate periods
      for (let i = 0; i < timetableData.periods.length; i++) {
        const period = timetableData.periods[i];
        if (
          !period.subject ||
          !period.teacher ||
          !period.startTime ||
          !period.endTime
        ) {
          setError(
            `Period ${i + 1}: Subject, teacher, start time, and end time are required`,
          );
          return;
        }
      }

      const dataToSend = {
        school_name: user?.school_name,
        ...timetableData,
      };

      if (editingTimetable) {
        await apiRequest.put(
          `/api/timetable/${editingTimetable._id}`,
          timetableData,
        );
        setSuccess("Timetable updated successfully!");
      } else {
        await apiRequest.post("/api/timetable", dataToSend);
        setSuccess("Timetable created successfully!");
      }

      fetchTimetables();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save timetable");
    }
  };

  const handleEdit = (timetable) => {
    setEditingTimetable(timetable);
    setTimetableData({
      classLevel: timetable.classLevel,
      day: timetable.day,
      periods: timetable.periods,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this timetable?")) {
      try {
        await apiRequest.delete(`/api/timetable/${id}`);
        setSuccess("Timetable deleted successfully!");
        fetchTimetables();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to delete timetable");
      }
    }
  };

  const addPeriod = () => {
    setTimetableData({
      ...timetableData,
      periods: [
        ...timetableData.periods,
        {
          subject: "",
          teacher: "",
          startTime: "",
          endTime: "",
          room: "",
        },
      ],
    });
  };

  const removePeriod = (index) => {
    const newPeriods = timetableData.periods.filter((_, i) => i !== index);
    setTimetableData({
      ...timetableData,
      periods: newPeriods,
    });
  };

  const updatePeriod = (index, field, value) => {
    const newPeriods = [...timetableData.periods];
    newPeriods[index][field] = value;
    setTimetableData({
      ...timetableData,
      periods: newPeriods,
    });
  };

  const filteredTimetables = timetables.filter((timetable) => {
    const matchesSearch =
      timetable.classLevel.toLowerCase().includes(search.toLowerCase()) ||
      timetable.day.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <Box m="20px">
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" fontWeight="bold" mb={1}>
              Timetable Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Create and manage class timetables for your school.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Create Timetable
          </Button>
        </Box>
      </Box>

      {/* Filters */}
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
            placeholder="Search timetables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton type="button" sx={{ color: colors.blueAccent[300] }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <FormControl sx={{ minWidth: 120, width: { xs: "100%", sm: "150px" } }}>
          <InputLabel>Class</InputLabel>
          <Select
            value={classFilter}
            label="Class"
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <MenuItem value="">All Classes</MenuItem>
            {classLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, width: { xs: "100%", sm: "150px" } }}>
          <InputLabel>Day</InputLabel>
          <Select
            value={dayFilter}
            label="Day"
            onChange={(e) => setDayFilter(e.target.value)}
          >
            <MenuItem value="">All Days</MenuItem>
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Success/Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Timetables Grid */}
      <Grid container spacing={2}>
        {filteredTimetables.map((timetable) => (
          <Grid item xs={12} md={6} lg={4} key={timetable._id}>
            <Card sx={{ backgroundColor: colors.primary[400] }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {timetable.classLevel} - {timetable.day}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(timetable)}
                      sx={{ color: colors.blueAccent[300] }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(timetable._id)}
                      sx={{ color: colors.redAccent[300] }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                  {timetable.periods.map((period, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                        p: 1,
                        backgroundColor: colors.primary[500],
                        borderRadius: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {period.startTime} - {period.endTime}
                        </Typography>
                        <Typography variant="body2">
                          {period.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {period.teacher?.name || "Unknown Teacher"}
                          {period.room && ` (Room: ${period.room})`}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTimetables.length === 0 && !loading && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No timetables found. Create your first timetable to get started.
          </Typography>
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTimetable ? "Edit Timetable" : "Create New Timetable"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Class Level</InputLabel>
                  <Select
                    value={timetableData.classLevel}
                    label="Class Level"
                    onChange={(e) =>
                      setTimetableData({
                        ...timetableData,
                        classLevel: e.target.value,
                      })
                    }
                  >
                    {classLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={timetableData.day}
                    label="Day"
                    onChange={(e) =>
                      setTimetableData({
                        ...timetableData,
                        day: e.target.value,
                      })
                    }
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Periods
            </Typography>

            {timetableData.periods.map((period, index) => (
              <Card
                key={index}
                sx={{ mb: 2, backgroundColor: colors.primary[400] }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="subtitle1">
                      Period {index + 1}
                    </Typography>
                    {timetableData.periods.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removePeriod(index)}
                        sx={{ color: colors.redAccent[300] }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Subject"
                        value={period.subject}
                        onChange={(e) =>
                          updatePeriod(index, "subject", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Teacher</InputLabel>
                        <Select
                          value={period.teacher}
                          label="Teacher"
                          onChange={(e) =>
                            updatePeriod(index, "teacher", e.target.value)
                          }
                        >
                          {teachers.map((teacher) => (
                            <MenuItem key={teacher._id} value={teacher._id}>
                              {teacher.name} - {teacher.email}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Start Time"
                        type="time"
                        value={period.startTime}
                        onChange={(e) =>
                          updatePeriod(index, "startTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="End Time"
                        type="time"
                        value={period.endTime}
                        onChange={(e) =>
                          updatePeriod(index, "endTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Room (Optional)"
                        value={period.room}
                        onChange={(e) =>
                          updatePeriod(index, "room", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Button variant="outlined" onClick={addPeriod} sx={{ mt: 2 }}>
              Add Period
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {editingTimetable ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timetable;
