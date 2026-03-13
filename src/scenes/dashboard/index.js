import { Box, Button, Typography, useTheme } from "@mui/material";
// import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
// import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
// import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
// import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../../theme";
import Stats from "./Studentstats";
// import Header from "../../components/Header";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={2}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your students from here.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadOutlinedIcon />}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.greenAccent[500] },
          }}
        >
          Download Report
        </Button>
      </Box>
      <Stats />
    </Box>
  );
};

export default Dashboard;
