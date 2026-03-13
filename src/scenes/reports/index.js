import { Box, Typography } from "@mui/material";

const Reports = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Reports
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Reports.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
