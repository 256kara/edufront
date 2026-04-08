// student dashboard to display results and graphs and attendance
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { useState, useEffect } from "react";
import { apiRequest } from "../../api";

const StudentDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme?.palette?.mode || "dark");

  // Mock data - in real app, fetch from API
  const [attendanceData, setAttendanceData] = useState([
    { month: "Jan", attendance: 95 },
    { month: "Feb", attendance: 92 },
    { month: "Mar", attendance: 98 },
    { month: "Apr", attendance: 96 },
    { month: "May", attendance: 94 },
  ]);

  const [resultsData, setResultsData] = useState([
    { subject: "Math", grade: "A", score: 85 },
    { subject: "English", grade: "B+", score: 78 },
    { subject: "Science", grade: "A-", score: 82 },
    { subject: "History", grade: "B", score: 75 },
    { subject: "Art", grade: "A", score: 88 },
  ]);

  const [performanceData, setPerformanceData] = useState([
    {
      id: "Performance",
      data: [
        { x: "Term 1", y: 75 },
        { x: "Term 2", y: 82 },
        { x: "Term 3", y: 78 },
      ],
    },
  ]);

  const [attendancePieData, setAttendancePieData] = useState([
    { id: "Present", value: 95, color: "#4cceac" },
    { id: "Absent", value: 5, color: "#db4f4a" },
  ]);

  // Fetch real data if needed
  useEffect(() => {
    // Example: fetch attendance
    // apiRequest.get('/student/attendance').then(res => setAttendanceData(res.data));
  }, []);

  if (!theme) return <Box p={3}>Loading...</Box>;

  const lineTheme = {
    axis: {
      ticks: {
        text: {
          fill: colors.grey[100],
        },
      },
      legend: {
        text: {
          fill: colors.grey[100],
        },
      },
    },
    grid: {
      line: {
        stroke: colors.grey[700],
      },
    },
  };

  const pieTheme = {
    ...lineTheme,
    legends: {
      text: {
        fill: colors.grey[100],
      },
    },
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} color={colors.grey[100]}>
        Student Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Attendance Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2} color={colors.grey[100]}>
                Attendance Overview
              </Typography>
              <Box height={300}>
                <ResponsivePie
                  data={attendancePieData}
                  theme={pieTheme}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={(d) => d.color}
                  borderWidth={1}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={colors.grey[100]}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                  }}
                  legends={[
                    {
                      anchor: "bottom",
                      direction: "row",
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: colors.grey[100],
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: "circle",
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Trend */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2} color={colors.grey[100]}>
                Performance Trend
              </Typography>
              <Box height={300}>
                <ResponsiveLine
                  data={performanceData}
                  theme={lineTheme}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Term",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Score (%)",
                    legendOffset: -40,
                    legendPosition: "middle",
                  }}
                  pointSize={10}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: "circle",
                      symbolBorderColor: "rgba(0, 0, 0, .5)",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Results */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2} color={colors.grey[100]}>
                Subject Results
              </Typography>
              <Box height={300}>
                <ResponsiveBar
                  data={resultsData.map((item) => ({
                    subject: item.subject,
                    score: item.score,
                    grade: item.grade,
                  }))}
                  keys={["score"]}
                  indexBy="subject"
                  theme={lineTheme}
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={{ scheme: "nivo" }}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Subject",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Score",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                  animate={true}
                  motionConfig={{
                    mass: 1,
                    tension: 120,
                    friction: 14,
                    clamp: false,
                    precision: 0.01,
                    velocity: 0,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2} color={colors.grey[100]}>
                Monthly Attendance
              </Typography>
              <Box>
                {attendanceData.map((item) => (
                  <Box
                    key={item.month}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography color={colors.grey[100]}>
                      {item.month}
                    </Typography>
                    <Typography color={colors.greenAccent[500]}>
                      {item.attendance}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Results */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2} color={colors.grey[100]}>
                Recent Grades
              </Typography>
              <Box>
                {resultsData.map((item) => (
                  <Box
                    key={item.subject}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography color={colors.grey[100]}>
                      {item.subject}
                    </Typography>
                    <Typography
                      color={
                        item.grade.startsWith("A")
                          ? colors.greenAccent[500]
                          : item.grade.startsWith("B")
                            ? colors.blueAccent[500]
                            : colors.redAccent[500]
                      }
                    >
                      {item.grade} ({item.score}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
