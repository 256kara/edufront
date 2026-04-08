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

const Reports = ({ user }) => {
  const theme = useTheme();
  const mode = theme?.palette?.mode || "dark";
  const colors = tokens(mode);
  const isStudent = user?.role === "student";

  // Mock data for reports - in real app, fetch from API
  const [schoolPerformanceData, setSchoolPerformanceData] = useState([
    {
      id: "Average Score",
      data: [
        { x: "Term 1", y: 69 },
        { x: "Term 2", y: 66 },
        { x: "Term 3", y: 70 },
      ],
    },
    {
      id: "Top Performer",
      data: [
        { x: "Term 1", y: 75 },
        { x: "Term 2", y: 78 },
        { x: "Term 3", y: 80 },
      ],
    },
  ]);

  const [gradeDistributionData, setGradeDistributionData] = useState([
    { id: "A", value: 35, color: "#4cceac" },
    { id: "B", value: 28, color: "#6870fa" },
    { id: "C", value: 20, color: "#db4f4a" },
    { id: "D", value: 12, color: "#e25f52" },
    { id: "F", value: 5, color: "#e2726e" },
  ]);

  const [attendanceTrendsData, setAttendanceTrendsData] = useState([
    { month: "Jan", present: 95, absent: 5 },
    { month: "Feb", present: 92, absent: 8 },
    { month: "Mar", present: 98, absent: 2 },
    { month: "Apr", present: 96, absent: 4 },
    { month: "May", present: 94, absent: 6 },
  ]);

  const [subjectPerformanceData, setSubjectPerformanceData] = useState([
    { subject: "Mathematics", score: 85, students: 120 },
    { subject: "English", score: 78, students: 115 },
    { subject: "Science", score: 82, students: 118 },
    { subject: "History", score: 75, students: 110 },
    { subject: "Art", score: 88, students: 105 },
  ]);

  // Fetch real data if needed
  useEffect(() => {
    // Example: fetch reports data
    // apiRequest.get('/reports/school-performance').then(res => setSchoolPerformanceData(res.data));
  }, []);

  if (!theme) return <Box p={3}>Loading...</Box>;

  if (!theme) return <Box p={3}>Loading...</Box>;

  const chartTheme = {
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
    legends: {
      text: {
        fill: colors.grey[100],
      },
    },
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h3" fontWeight="bold" mb={1}>
          {isStudent ? "My Reports" : "Reports & Analytics"}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {isStudent
            ? "View your academic performance and progress reports."
            : "Comprehensive analytics and reports for school management."}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* School Performance Trend */}
        {!isStudent && (
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: colors.primary[400] }}>
              <CardContent>
                <Typography variant="h6" mb={2} color={colors.grey[100]}>
                  School Performance Trends
                </Typography>
                <Box height={350}>
                  <ResponsiveLine
                    data={schoolPerformanceData}
                    theme={chartTheme}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{
                      type: "linear",
                      min: "auto",
                      max: "auto",
                      stacked: false,
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
        )}

        {/* Grade Distribution */}
        <Grid item xs={12} md={isStudent ? 12 : 4}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2} color={colors.grey[100]}>
                {isStudent
                  ? "Grade Distribution"
                  : "Overall Grade Distribution"}
              </Typography>
              <Box height={isStudent ? 350 : 350}>
                <ResponsivePie
                  data={gradeDistributionData}
                  theme={chartTheme}
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
                      itemWidth: 60,
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

        {/* Attendance Trends */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h6" mb={2} color={colors.grey[100]}>
                Attendance Trends
              </Typography>
              <Box height={300}>
                <ResponsiveBar
                  data={attendanceTrendsData}
                  keys={["present", "absent"]}
                  indexBy="month"
                  theme={chartTheme}
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
                    legend: "Month",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Percentage",
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
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Performance */}
        {!isStudent && (
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: colors.primary[400] }}>
              <CardContent>
                <Typography variant="h6" mb={2} color={colors.grey[100]}>
                  Subject Performance
                </Typography>
                <Box height={300}>
                  <ResponsiveBar
                    data={subjectPerformanceData.map((item) => ({
                      subject: item.subject.split(" ")[0], // Shorten for display
                      score: item.score,
                      students: item.students,
                    }))}
                    keys={["score"]}
                    indexBy="subject"
                    theme={chartTheme}
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "paired" }}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 1.6]],
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: "Subject",
                      legendPosition: "middle",
                      legendOffset: 40,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Average Score",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: "color",
                      modifiers: [["darker", 1.6]],
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Student-specific Performance Summary */}
        {isStudent && (
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: colors.primary[400] }}>
              <CardContent>
                <Typography variant="h6" mb={2} color={colors.grey[100]}>
                  Your Performance Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color={colors.greenAccent[500]}>
                        85%
                      </Typography>
                      <Typography variant="body2" color={colors.grey[100]}>
                        Overall Average
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color={colors.blueAccent[500]}>
                        95%
                      </Typography>
                      <Typography variant="body2" color={colors.grey[100]}>
                        Attendance Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color={colors.yellowAccent[500]}>
                        12
                      </Typography>
                      <Typography variant="body2" color={colors.grey[100]}>
                        Assignments Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color={colors.redAccent[500]}>
                        2
                      </Typography>
                      <Typography variant="body2" color={colors.grey[100]}>
                        Missed Classes
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Reports;
