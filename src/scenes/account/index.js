import { Box, Typography } from "@mui/material";

const Account = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Account
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Account.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
