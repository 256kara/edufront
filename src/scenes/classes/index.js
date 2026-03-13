import { Box, Typography } from "@mui/material";

const Classes = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Classes
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Classes.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Classes;
