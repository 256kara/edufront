import { Box, Typography } from "@mui/material";

const Exams = () => {
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Exams And Grades
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Exams and Grades.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Exams;
