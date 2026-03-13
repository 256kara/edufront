import { Box, Typography } from "@mui/material";

const Attendance = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Attendance
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Attendance.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Attendance;
