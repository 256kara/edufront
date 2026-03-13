import {
  Box,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { tokens } from "../../theme";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

export default function Stats() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const stats = [
    {
      title: "Total Students",
      value: "2,460",
      change: "+8.2%",
      icon: <SchoolOutlinedIcon />,
    },
    {
      title: "Active Teachers",
      value: "184",
      change: "+2.1%",
      icon: <GroupOutlinedIcon />,
    },
    {
      title: "Avg. Performance",
      value: "87.4%",
      change: "+4.3%",
      icon: <TrendingUpOutlinedIcon />,
    },
    {
      title: "Assignments Done",
      value: "91.7%",
      change: "+1.8%",
      icon: <AssignmentTurnedInOutlinedIcon />,
    },
  ];

  const classes = [
    { name: "S.1", students: 100, performance: 20 },
    { name: "S.2", students: 96, performance: 50 },
    { name: "S.3", students: 104, performance: 73 },
    { name: "S.4", students: 88, performance: 40 },
    { name: "S.5", students: 92, performance: 60 },
    { name: "S.6", students: 84, performance: 80 },
  ];
  return (
    <Box
      mt="20px"
      display="grid"
      gridTemplateColumns="repeat(12, minmax(0, 1fr))"
      gap="16px"
    >
      {stats.map((stat) => (
        <Paper
          key={stat.title}
          elevation={0}
          sx={{
            gridColumn: { xs: "span 12", sm: "span 6", lg: "span 3" },
            p: 2,
            borderRadius: "10px",
            backgroundColor: colors.primary[400],
            border: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography color={colors.grey[300]} variant="h6">
              {stat.title}
            </Typography>
            <Box color={colors.greenAccent[500]}>{stat.icon}</Box>
          </Stack>
          <Typography color={colors.grey[100]} variant="h3" fontWeight="bold">
            {stat.value}
          </Typography>
          <Typography color={colors.greenAccent[500]} mt={1}>
            {stat.change} this month
          </Typography>
        </Paper>
      ))}

      <Paper
        elevation={0}
        sx={{
          gridColumn: { xs: "span 12", lg: "span 8" },
          p: 2,
          borderRadius: "10px",
          backgroundColor: colors.primary[400],
          border: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h5" color={colors.grey[100]} fontWeight="600">
          Class Performance
        </Typography>
        <Typography variant="body2" color={colors.grey[300]} mb={2}>
          Monthly completion overview by top classes
        </Typography>
        <Stack spacing={2}>
          {classes.map((item) => (
            <Box key={item.name}>
              <Stack direction="row" justifyContent="space-between" mb={0.8}>
                <Typography color={colors.grey[200]}>
                  {item.name} ({item.students} students)
                </Typography>
                <Typography color={colors.greenAccent[500]}>
                  {item.performance}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={item.performance}
                sx={{
                  height: 10,
                  borderRadius: "999px",
                  backgroundColor: colors.primary[500],
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: colors.greenAccent[500],
                    borderRadius: "999px",
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          gridColumn: { xs: "span 12", lg: "span 4" },
          p: 2,
          borderRadius: "10px",
          backgroundColor: colors.primary[400],
          border: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h5" color={colors.grey[100]} fontWeight="600">
          Recent Activity
        </Typography>
        <Stack mt={2} spacing={1.5}>
          <Box>
            <Typography color={colors.grey[200]}>
              New student enrolled in Grade 9
            </Typography>
            <Typography variant="caption" color={colors.grey[400]}>
              8 minutes ago
            </Typography>
          </Box>
          <Box>
            <Typography color={colors.grey[200]}>
              Science test scores published
            </Typography>
            <Typography variant="caption" color={colors.grey[400]}>
              21 minutes ago
            </Typography>
          </Box>
          <Box>
            <Typography color={colors.grey[200]}>
              Attendance report updated
            </Typography>
            <Typography variant="caption" color={colors.grey[400]}>
              1 hour ago
            </Typography>
          </Box>
          <Box>
            <Typography color={colors.grey[200]}>
              Parent meeting scheduled
            </Typography>
            <Typography variant="caption" color={colors.grey[400]}>
              2 hours ago
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
