import { Box, Typography } from "@mui/material";

const Settings = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Settings
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Update your dashboard Settings.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
