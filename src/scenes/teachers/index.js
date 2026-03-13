import { Box, Typography } from "@mui/material";

const Teachers = () => {
  return (
    <Box m="20px">
      <Box>
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
  );
};

export default Teachers;
