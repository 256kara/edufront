import { Box, Typography } from "@mui/material";

const Assignments = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Assignments
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Assignments.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Assignments;
