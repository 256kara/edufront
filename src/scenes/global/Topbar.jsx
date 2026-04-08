import { Box, Button, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Topbar = ({ showMenuButton = false, onMenuClick, onLogout, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isStudent = user?.role === "student";
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
      {/* SEARCH BAR */}
      <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
        {showMenuButton && (
          <IconButton onClick={onMenuClick} aria-label="Open menu">
            <MenuOutlinedIcon />
          </IconButton>
        )}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          sx={{ width: { xs: "160px", sm: "240px", md: "320px" } }}
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* ICONS */}
      <Box display="flex" sx={{ gap: { xs: 0, sm: 0.5 } }}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {isStudent ? (
          <IconButton component={Link} to="/messages" aria-label="Messages">
            <NotificationsOutlinedIcon />
          </IconButton>
        ) : (
          <IconButton
            component={Link}
            to="/notifications"
            aria-label="Notifications"
          >
            <NotificationsOutlinedIcon />
          </IconButton>
        )}

        {isStudent ? null : (
          <IconButton component={Link} to="/settings" aria-label="Settings">
            <SettingsOutlinedIcon />
          </IconButton>
        )}

        <IconButton component={Link} to="/account" aria-label="Account">
          <PersonOutlinedIcon />
        </IconButton>

        <IconButton
          onClick={onLogout}
          color="error"
          aria-label="Logout"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
        >
          <LogoutOutlinedIcon />
        </IconButton>

        <Button
          onClick={onLogout}
          variant="outlined"
          color="error"
          startIcon={<LogoutOutlinedIcon />}
          sx={{
            ml: 1,
            textTransform: "none",
            display: { xs: "none", sm: "inline-flex" },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Topbar;
