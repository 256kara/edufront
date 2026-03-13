import { Box, Typography } from "@mui/material";

const Users = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Users
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Users.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Users;
