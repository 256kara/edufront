import { useState } from "react";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const Item = ({ title, to, icon, selected, setSelected, onNavigate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      component={<Link to={to} />}
      active={selected === title}
      onClick={() => {
        setSelected(title);
        if (onNavigate) onNavigate();
      }}
      icon={icon}
      style={{ color: colors.grey[100] }}
    >
      <Typography className="items">{title}</Typography>
    </MenuItem>
  );
};

const Sidenav = ({ isMobile = false, onNavigate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("");

  const routeToTitle = {
    "/": "Dashboard",
    "/students": "Students",
    "/teachers": "Teachers",
    "/classes": "Classes",
    "/attendance": "Attendance",
    "/exams-grades": "Exams & Grades",
    "/assignments": "Assignments",
    "/fees": "Fees / Finance",
    "/messages": "Messages",
    "/notifications": "Notifications",
    "/timetable": "Timetable",
    "/reports-analytics": "Reports & Analytics",
    "/users-roles": "Users & Roles",
    "/settings": "Settings",
  };

  const activeTitle = routeToTitle[location.pathname] || selected;

  return (
    <Box
      sx={{
        height: "100%",
        "& .ps-sidebar-root": { border: "none" },
        [`& .${sidebarClasses.container}`]: {
          backgroundColor: colors.primary[400],
        },
        [`& .${menuClasses.button}`]: {
          padding: "5px 20px",
          borderRadius: "10px",
          transition: "all 0.2s ease",
        },
        [`& .${menuClasses.button}:hover`]: {
          backgroundColor: `${colors.greenAccent[900]} !important`,
          color: `${colors.greenAccent[300]} !important`,
        },
        [`& .${menuClasses.active}`]: {
          color: `${colors.greenAccent[400]} !important`,
          backgroundColor: `${colors.greenAccent[900]} !important`,
        },
      }}
      className="sidenav"
    >
      <ProSidebar
        collapsed={isMobile ? false : collapsed}
        collapsedWidth="90px"
      >
        <Menu>
          <MenuItem
            icon={!isMobile && collapsed ? <MenuOutlinedIcon /> : undefined}
            onClick={() => {
              if (isMobile) {
                if (onNavigate) onNavigate();
                return;
              }
              setCollapsed(!collapsed);
            }}
            style={{
              margin: "10px 0 5px 0",
              color: colors.grey[100],
            }}
          >
            {(isMobile || !collapsed) && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3">EDUPULSE</Typography>
                <IconButton
                  onClick={() => {
                    if (isMobile) {
                      if (onNavigate) onNavigate();
                      return;
                    }
                    setCollapsed(!collapsed);
                  }}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box
            paddingLeft={!isMobile && collapsed ? undefined : "10%"}
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 150px)",
              scrollbarWidth: "thin",
              scrollbarColor: `${colors.primary[400]} transparent`,
            }}
          >
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            {!collapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Academics
              </Typography>
            )}

            <Item
              title="Students"
              to="/students"
              icon={<SchoolOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />
            <Item
              title="Teachers"
              to="/teachers"
              icon={<PersonOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />
            <Item
              title="Classes"
              to="/classes"
              icon={<ClassOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />
            <Item
              title="Attendance"
              to="/attendance"
              icon={<FactCheckOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />
            <Item
              title="Exams & Grades"
              to="/exams-grades"
              icon={<GradingOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />
            <Item
              title="Assignments"
              to="/assignments"
              icon={<AssignmentOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />
            <Item
              title="Fees / Finance"
              to="/fees"
              icon={<AccountBalanceWalletOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            {!collapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Communication
              </Typography>
            )}

            <Item
              title="Messages"
              to="/messages"
              icon={<MessageOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            <Item
              title="Notifications"
              to="/notifications"
              icon={<NotificationsOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            <Item
              title="Timetable"
              to="/timetable"
              icon={<CalendarMonthOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            {!collapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Insights
              </Typography>
            )}
            <Item
              title="Reports & Analytics"
              to="/reports-analytics"
              icon={<InsightsOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            {!collapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Administration
              </Typography>
            )}
            <Item
              title="Users & Roles"
              to="/users-roles"
              icon={<AdminPanelSettingsOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            <Item
              title="Settings"
              to="/settings"
              icon={<SettingsOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />

            <Item
              title="Account"
              to="/account"
              icon={<PersonOutlinedIcon />}
              selected={activeTitle}
              setSelected={setSelected}
              onNavigate={onNavigate}
            />
          </Box>
          <Box>
            <Box>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Edupulse Admin
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 10px 20px" }}
              >
                Version 1.0.0
              </Typography>
            </Box>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidenav;
