import { Box, Typography } from "@mui/material";

const Timetable = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Timetable
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Time table for classes.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Timetable;
