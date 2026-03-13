import { Box, Typography } from "@mui/material";

const Messages = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Messages
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Messages.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
