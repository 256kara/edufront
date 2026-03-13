import * as React from "react";

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

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import items from "../../components/Items";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "../../theme";
import DataTable from "../../components/Studentsdata";

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

const Students = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = React.useState(false);
  const [studentData, setStudentData] = React.useState({
    name: "",
    grade: "",
    age: "",
    phone: "",
  });

  const handleChange = (event) => {
    setStudentData({ ...studentData, [event.target.name]: event.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  return (
    <Box m="20px">
      <Box>
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          This is a demo version. Data is not persistent and will reset on page
          refresh.
        </Alert>
      </Box>
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
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="grade-id">Grade</InputLabel>
              <Select
                labelId="grade-id"
                name="grade"
                value={studentData.grade}
                onChange={handleChange}
                input={<OutlinedInput label="Grade" />}
                sx={{ color: colors.blueAccent[300] }}
              >
                <MenuItem value="S.1">S.1</MenuItem>
                <MenuItem value="S.2">S.2</MenuItem>
                <MenuItem value="S.3">S.2</MenuItem>
                <MenuItem value="S.4">S.4</MenuItem>
                <MenuItem value="S.5">S.5</MenuItem>
                <MenuItem value="S.6">S.6</MenuItem>
              </Select>
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
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleClose}
            loading
            variant="outlined"
            loadingPosition="end"
            startIcon={<SaveIcon />}
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
            variant="outlined"
            color="success"
          >
            Add Student
          </Button>
          <Button sx={{ p: 1 }} variant="outlined" color="warning" disabled>
            Add Multiple
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
            placeholder="Search students"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Autocomplete
          disablePortal
          options={items}
          sx={{ width: { xs: "100%", md: 140 } }}
          renderInput={(params) => <TextField {...params} label="Class" />}
        />
      </Stack>

      <DataTable />
    </Box>
  );
};

export default Students;
