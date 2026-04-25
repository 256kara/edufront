import * as React from "react";
import { useContext, useState, useCallback, useEffect } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Button,
  Typography,
  useTheme,
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
  // Card,
  // CardContent,
  Chip,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../api";
import { DataGrid } from "@mui/x-data-grid";

const Assignments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useContext(AuthContext);

  // State Management
  const [assignments, setAssignments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    classLevel: "",
    dueDate: "",
    totalMarks: "",
    instructions: "",
    school_id: user?.school_id || "",
  });

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      if (!user?.school_id) return;

      let url = `http://localhost:5000/api/assignments/get-assignments/${user.school_id}`;
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (classFilter) params.append("class", classFilter);
      if (subjectFilter) params.append("subject", subjectFilter);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await apiRequest.get(url);
      setAssignments(res.data.assignments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assignments");
    }
  }, [user?.school_id, search, classFilter, subjectFilter]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open dialog for create
  const handleCreateOpen = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      subject: "",
      classLevel: "",
      dueDate: "",
      totalMarks: "",
      instructions: "",
      school_id: user?.school_id || "",
    });
    setOpenDialog(true);
    setError("");
    setSuccess("");
  };

  // Open dialog for edit
  const handleEditOpen = (assignment) => {
    setEditingId(assignment._id);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      classLevel: assignment.classLevel,
      dueDate: assignment.dueDate?.split("T")[0] || "",
      totalMarks: assignment.totalMarks,
      instructions: assignment.instructions || "",
    });
    setOpenDialog(true);
    setError("");
  };

  // Close dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingId(null);
    setError("");
    setFormData({
      title: "",
      description: "",
      subject: "",
      classLevel: "",
      dueDate: "",
      totalMarks: "",
      instructions: "",
      school_id: user?.school_id || "",
    });
  };

  // Save assignment
  const handleSave = async () => {
    try {
      if (!formData.title || !formData.subject || !formData.classLevel) {
        setError("Please fill in all required fields");
        return;
      }

      setLoading(true);
      const payload = formData;

      if (editingId) {
        // Update
        await apiRequest.put(
          `http://localhost:5000/api/assignments/${editingId}`,
          payload,
        );
        setSuccess("Assignment updated successfully!");
      } else {
        // Create
        await apiRequest.post(
          `http://localhost:5000/api/assignments/create-assignment/${user.school_id}`,
          payload,
        );
        setSuccess("Assignment created successfully!");
      }

      setFormData({
        title: "",
        description: "",
        subject: "",
        classLevel: "",
        dueDate: "",
        totalMarks: "",
        instructions: "",
        school_id: user?.school_id || "",
      });
      setEditingId(null);
      setOpenDialog(false);
      setError("");
      await fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  // Delete assignment
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await apiRequest.delete(`http://localhost:5000/api/assignments/${id}`);
        setSuccess("Assignment deleted successfully!");
        fetchAssignments();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete assignment");
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if assignment is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // DataGrid columns
  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: isMobile ? 1 : 1.5,
      minWidth: isMobile ? 100 : 150,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      minWidth: 100,
      hide: isMobile,
    },
    {
      field: "classLevel",
      headerName: "Class",
      flex: 0.8,
      minWidth: 80,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={formatDate(params.row.dueDate)}
          size="small"
          color={isOverdue(params.row.dueDate) ? "error" : "success"}
          variant="outlined"
        />
      ),
    },
    {
      field: "totalMarks",
      headerName: "Marks",
      flex: 0.7,
      minWidth: 70,
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <IconButton
            size="small"
            onClick={() => handleEditOpen(params.row)}
            title="Edit"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[300]
                  : colors.blueAccent[700],
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row._id)}
            title="Delete"
            sx={{ color: colors.redAccent[600] }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = assignments.map((assignment) => ({
    ...assignment,
    id: assignment._id,
  }));

  return (
    <Box m="20px">
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h3" fontWeight="bold" mb={1}>
          Assignments
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Create and manage student assignments
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
            <CloseIcon />
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
            <CloseIcon />
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
          color={theme.palette.mode === "dark" ? "primary" : "secondary"}
        >
          Create Assignment
        </Button>

        {/* Search Box */}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          sx={{ flex: { xs: 1, sm: "0 0 auto" }, minWidth: "200px" }}
        >
          <InputBase
            sx={{ color: colors.blueAccent[300], flex: 1, px: 2 }}
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton sx={{ color: colors.blueAccent[300] }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Filters */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Class</InputLabel>
          <Select
            value={classFilter}
            label="Class"
            onChange={(e) => setClassFilter(e.target.value)}
            sx={{
              backgroundColor: colors.primary[400],
            }}
          >
            <MenuItem value="">All Classes</MenuItem>
            <MenuItem value="S1">S1</MenuItem>
            <MenuItem value="S2">S2</MenuItem>
            <MenuItem value="S3">S3</MenuItem>
            <MenuItem value="S4">S4</MenuItem>
            <MenuItem value="S5">S5</MenuItem>
            <MenuItem value="S6">S6</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Subject</InputLabel>
          <Select
            value={subjectFilter}
            label="Subject"
            onChange={(e) => setSubjectFilter(e.target.value)}
            sx={{
              backgroundColor: colors.primary[400],
            }}
          >
            <MenuItem value="">All Subjects</MenuItem>
            <MenuItem value="Mathematics">Mathematics</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Geography">Geography</MenuItem>
            <MenuItem value="Biology">Biology</MenuItem>
            <MenuItem value="Chemistry">Chemistry</MenuItem>
            <MenuItem value="Physics">Physics</MenuItem>
            <MenuItem value="Literature">Literature</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data Grid */}
      <Box
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: 1,
          overflow: "hidden",
          minHeight: 420,
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${colors.primary[300]}`,
            py: 1,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.primary[500],
            borderBottom: "none",
            fontWeight: 600,
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[500],
          },
        }}
      >
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSizeOptions={isMobile ? [5] : [5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: isMobile ? 5 : 10 },
            },
          }}
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
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.primary[300],
            },
          }}
        />
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary[500],
            color: colors.grey[100],
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingId ? "Edit Assignment" : "Create Assignment"}
          <IconButton
            onClick={handleDialogClose}
            sx={{ color: colors.grey[100] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assignment Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Chapter 5 Exercises"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Assignment details..."
              />
            </Grid>

            {/* Subject */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subject *</InputLabel>
                <Select
                  name="subject"
                  value={formData.subject}
                  label="Subject *"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Mathematics">Mathematics</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="History">History</MenuItem>
                  <MenuItem value="Geography">Geography</MenuItem>
                  <MenuItem value="Biology">Biology</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Physics">Physics</MenuItem>
                  <MenuItem value="Literature">Literature</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Class Level */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Class Level *</InputLabel>
                <Select
                  name="classLevel"
                  value={formData.classLevel}
                  label="Class Level *"
                  onChange={handleInputChange}
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

            {/* Due Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Total Marks */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Marks"
                name="totalMarks"
                type="number"
                value={formData.totalMarks}
                onChange={handleInputChange}
                placeholder="e.g., 50"
              />
            </Grid>

            {/* Instructions */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Special instructions for students..."
              />
            </Grid>

            {/* Error Message */}
            {error && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    backgroundColor: colors.redAccent[800],
                    color: colors.redAccent[100],
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color={theme.palette.mode === "dark" ? "primary" : "secondary"}
            disabled={loading}
          >
            {loading ? "Saving..." : editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assignments;
