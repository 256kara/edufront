import * as React from "react";
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { tokens } from "../../theme";
import useClasses from "../../hooks/useClasses";

const Classes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { classesData, loading, error } = useClasses();

  return (
    <Box m="20px">
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h3" fontWeight="bold" mb={1}>
          Classes Overview
        </Typography>
        <Typography variant="h6" color="textSecondary">
          View all classes and student counts
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Box
          sx={{
            backgroundColor: colors.redAccent[800],
            color: colors.redAccent[100],
            p: 2,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Loading */}
      {loading && (
        <Box mb={2}>
          <Typography>Loading classes...</Typography>
        </Box>
      )}

      {/* Classes Grid */}
      <Grid container spacing={3}>
        {classesData.map((cls) => (
          <Grid item xs={12} sm={6} md={4} key={cls.name}>
            <Card
              sx={{
                backgroundColor: colors.primary[400],
                "&:hover": {
                  backgroundColor: colors.primary[300],
                },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                    backgroundColor: colors.blueAccent[500],
                  }}
                >
                  {cls.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" mb={1}>
                  Class {cls.name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {cls.studentCount} Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Classes */}
      {!loading && classesData.length === 0 && !error && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No classes found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Classes;
