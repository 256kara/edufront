import { Box, Typography, Button, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const Notifications = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  function Notification(type, message) {
    return (
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" m="10">
          <span
            style={{
              background: colors.greenAccent[700],
              padding: "5px 5px",
              marginRight: "10px",
              borderRadius: "2px",
              color: colors.grey[100],
            }}
          >
            {type}
          </span>
          {message}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            sx={{
              color: colors.grey[100],
              backgroundColor: colors.redAccent[600],
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: colors.greenAccent[100],
              backgroundColor: colors.greenAccent[600],
            }}
          >
            View
          </Button>
        </Box>
      </Box>
    );
  }
  const notifications = [
    {
      type: "Warning",
      message: "New reporting guidelines are available for download.",
    },
    {
      type: "Important",
      message:
        "Reporting date has been changed to 30th June 2024. Please update your records accordingly.",
    },
  ];
  return (
    <Box m="20px">
      <Box>
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Notifications
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Notifications in one place.
          </Typography>
        </Box>
      </Box>
      <Box bgcolor={colors.primary[400]} p={2} mt={2} borderRadius="4px">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: "transparent",
          }}
        >
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            sx={{ width: { xs: "160px", sm: "240px", md: "200px" } }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search notifications"
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            startIcon={<NotificationsOutlinedIcon />}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              "&:hover": { backgroundColor: colors.greenAccent[500] },
            }}
          >
            Notify
          </Button>{" "}
        </Box>
      </Box>

      {notifications.map((notification, index) => (
        <Box bgcolor={colors.primary[400]} p={2} mt={2} borderRadius="4px">
          <Box key={index} mb={2}>
            {Notification(notification.type, notification.message)}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Notifications;
