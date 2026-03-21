import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { tokens, ColorModeContext } from "../../theme";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../api";
import capusername from "../../components/Capitalize";

const Account = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useContext(AuthContext);
  const colorMode = useContext(ColorModeContext);

  const displayName = user?.name?.trim() || "Super Admin";
  const displayRole = user?.role || "super-admin";
  const avatarInitial = (displayName.charAt(0) || "S").toUpperCase();

  // State for different sections
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || "Super Admin",
    email: user?.email || "admin@school.com",
    phone: user?.phone || "+1234567890",
    schoolName: user?.school_name || "Sample School",
    role: user?.role || "super-admin",
    joinDate: "2026-02-15",
  });

  useEffect(() => {
    if (!user) return;

    setProfileData((prev) => ({
      ...prev,
      name: user.name ?? prev.name,
      email: user.email ?? prev.email,
      phone: user.phone ?? prev.phone,
      schoolName: user.school_name ?? prev.schoolName,
      role: user.role ?? prev.role,
    }));
  }, [user]);

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: theme.palette.mode === "dark",
    language: "en",
    timezone: "UTC+0",
  });

  // Activity log (mock data)
  const [activityLog] = useState([
    {
      id: 1,
      action: "Logged in",
      timestamp: "2024-01-15 10:30 AM",
      ip: "192.168.1.1",
    },
    {
      id: 2,
      action: "Updated student records",
      timestamp: "2024-01-15 09:15 AM",
      ip: "192.168.1.1",
    },
    {
      id: 3,
      action: "Exported report",
      timestamp: "2024-01-14 04:20 PM",
      ip: "192.168.1.1",
    },
    {
      id: 4,
      action: "Added new teacher",
      timestamp: "2024-01-14 02:10 PM",
      ip: "192.168.1.1",
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileEdit = () => {
    setEditMode(true);
  };

  const handleProfileSave = async () => {
    try {
      // API call to update profile
      await apiRequest.put("/api/admin/update-profile", profileData);
      setEditMode(false);
      // Show success message
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleProfileCancel = () => {
    setEditMode(false);
    // Reset to original data
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await apiRequest.put("/api/admin/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Show success message
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: isMobile ? 2 : 3 }}>{children}</Box>}
    </div>
  );

  const [work, setWork] = useState({
    name: "",
  });

  const handlework = (e) => {
    setWork(e.target.value);
  };

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" mb={1}>
          Account Settings
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
          Manage your account and preferences{" "}
        </Typography>
      </Box>

      {/* Profile Card */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          backgroundColor: colors.primary[400],
          borderRadius: 2,
          border: `1px solid ${colors.grey[700]}`,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            elevation: 4,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(0,0,0,0.4)"
                : "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "center" : "center"}
            gap={3}
            textAlign={isMobile ? "center" : "left"}
          >
            <Avatar
              sx={{
                width: isMobile ? 64 : 88,
                height: isMobile ? 64 : 88,
                bgcolor: colors.greenAccent[500],
                fontSize: isMobile ? "1.75rem" : "2.25rem",
                fontWeight: 600,
                border: `3px solid ${colors.primary[300]}`,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {avatarInitial}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={600}
                sx={{
                  color: colors.grey[100],
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {capusername(displayName)}
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  color: colors.grey[300],
                  mb: 1,
                  fontWeight: 400,
                }}
              >
                {displayRole === "super-admin" && "Super Admin"}
                {displayRole === "admin" && "Admin"}
                {displayRole === "teacher" && "Teacher"}
                {displayRole === "student" && "Student"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.grey[400],
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <HistoryIcon sx={{ fontSize: "1rem" }} />
                Member since{" "}
                {new Date(profileData.joinDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box
              mt={isMobile ? 2 : 0}
              width={isMobile ? "100%" : "auto"}
              display="flex"
              justifyContent={isMobile ? "center" : "flex-end"}
            >
              {!editMode ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleProfileEdit}
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    color: colors.grey[900],
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 12px rgba(0,0,0,0.3)"
                        : "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[400],
                      transform: "translateY(-1px)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 6px 20px rgba(0,0,0,0.4)"
                          : "0 6px 20px rgba(0,0,0,0.2)",
                    },
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box
                  display="flex"
                  gap={1.5}
                  width={isMobile ? "100%" : "auto"}
                >
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleProfileCancel}
                    sx={{
                      color: colors.grey[300],
                      borderColor: colors.grey[600],
                      fontWeight: 500,
                      px: 2.5,
                      py: 1.5,
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: colors.grey[800],
                        borderColor: colors.grey[500],
                      },
                      flex: isMobile ? 1 : "auto",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleProfileSave}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      color: colors.grey[900],
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 4px 12px rgba(0,0,0,0.3)"
                          : "0 4px 12px rgba(0,0,0,0.15)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: colors.greenAccent[400],
                        transform: "translateY(-1px)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 6px 20px rgba(0,0,0,0.4)"
                            : "0 6px 20px rgba(0,0,0,0.2)",
                      },
                      flex: isMobile ? 1 : "auto",
                    }}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper
        elevation={1}
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: 2,
          border: `1px solid ${colors.grey[700]}`,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            borderBottom: `1px solid ${colors.grey[700]}`,
            backgroundColor: colors.primary[500],
            "& .MuiTab-root": {
              color: colors.grey[300],
              fontWeight: 500,
              fontSize: isMobile ? "0.875rem" : "0.95rem",
              minWidth: isMobile ? "auto" : "140px",
              py: 2,
              px: isMobile ? 2 : 3,
              minHeight: 64,
              transition: "all 0.2s ease-in-out",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: colors.primary[300],
                color: colors.grey[100],
              },
              "&.Mui-selected": {
                color: colors.greenAccent[400],
                backgroundColor: colors.primary[600],
                fontWeight: 600,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: colors.greenAccent[500],
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTabs-scrollButtons": {
              color: colors.grey[400],
              "&:hover": {
                backgroundColor: colors.primary[300],
              },
              "&.Mui-disabled": {
                opacity: 0.3,
              },
            },
          }}
        >
          <Tab
            icon={
              <PersonIcon sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
            }
            label={isMobile ? "" : "Profile"}
            iconPosition={isMobile ? "top" : "start"}
          />
          <Tab
            icon={
              <SecurityIcon
                sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}
              />
            }
            label={isMobile ? "" : "Security"}
            iconPosition={isMobile ? "top" : "start"}
          />
          <Tab
            icon={
              <SchoolIcon sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
            }
            label={isMobile ? "" : "School"}
            iconPosition={isMobile ? "top" : "start"}
          />
          <Tab
            icon={
              <SettingsIcon
                sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}
              />
            }
            label={isMobile ? "" : "Preferences"}
            iconPosition={isMobile ? "top" : "start"}
          />
          <Tab
            icon={
              <NotificationsIcon
                sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}
              />
            }
            label={isMobile ? "" : "Notifications"}
            iconPosition={isMobile ? "top" : "start"}
          />
          <Tab
            icon={
              <HistoryIcon sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }} />
            }
            label={isMobile ? "" : "Activity"}
            iconPosition={isMobile ? "top" : "start"}
          />
        </Tabs>

        {/* Profile Tab */}

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
                InputProps={{ readOnly: !editMode }}
                variant={editMode ? "outlined" : "filled"}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: colors.grey[400],
                    },
                    "&:hover fieldset": {
                      borderColor: colors.greenAccent[500],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.greenAccent[500],
                    },
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: colors.primary[400],
                    "&:hover": {
                      backgroundColor: colors.primary[500],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.primary[500],
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, email: e.target.value }))
                }
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: colors.grey[300] }} />
                    </InputAdornment>
                  ),
                  readOnly: !editMode,
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: colors.grey[400],
                    },
                    "&:hover fieldset": {
                      borderColor: colors.greenAccent[500],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.greenAccent[500],
                    },
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: colors.primary[400],
                    "&:hover": {
                      backgroundColor: colors.primary[500],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.primary[500],
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                }
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: colors.grey[300] }} />
                    </InputAdornment>
                  ),
                  readOnly: !editMode,
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: colors.grey[400],
                    },
                    "&:hover fieldset": {
                      borderColor: colors.greenAccent[500],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.greenAccent[500],
                    },
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: colors.primary[400],
                    "&:hover": {
                      backgroundColor: colors.primary[500],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.primary[500],
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                value={profileData.role}
                InputProps={{ readOnly: true }}
                variant="filled"
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: colors.primary[400],
                    "&:hover": {
                      backgroundColor: colors.primary[500],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.primary[500],
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: colors.grey[100],
                fontWeight: 600,
                mb: 3,
              }}
            >
              Password & Security
            </Typography>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              mb={4}
            >
              <Button
                variant="contained"
                onClick={() => setPasswordDialog(true)}
                startIcon={<SecurityIcon />}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  color: colors.grey[900],
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 12px rgba(0,0,0,0.3)"
                      : "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: colors.greenAccent[400],
                    transform: "translateY(-1px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 6px 20px rgba(0,0,0,0.4)"
                        : "0 6px 20px rgba(0,0,0,0.2)",
                  },
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Change Password
              </Button>
            </Box>

            <Divider
              sx={{
                my: 4,
                borderColor: colors.grey[700],
                borderWidth: "1px",
              }}
            />

            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: colors.grey[100],
                fontWeight: 600,
                mb: 3,
              }}
            >
              Two-Factor Authentication
            </Typography>
            <Box
              sx={{
                p: 3,
                backgroundColor: colors.primary[500],
                borderRadius: 2,
                border: `1px solid ${colors.grey[700]}`,
              }}
            >
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                alignItems={isMobile ? "flex-start" : "center"}
                gap={3}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: colors.redAccent[500],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SecurityIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: colors.grey[100],
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      Two-Factor Authentication
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grey[400] }}
                    >
                      Add an extra layer of security to your account
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ ml: isMobile ? 0 : "auto", mt: isMobile ? 2 : 0 }}
                >
                  <Chip
                    label="Disabled"
                    color="error"
                    variant="filled"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 28,
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: colors.greenAccent[400],
                      borderColor: colors.greenAccent[400],
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: colors.greenAccent[500],
                        borderColor: colors.greenAccent[300],
                        color: colors.grey[900],
                      },
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    Enable 2FA
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* School Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School Name"
                value={profileData.schoolName}
                variant="filled"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon sx={{ color: colors.grey[300] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: colors.primary[400],
                    "&:hover": {
                      backgroundColor: colors.primary[300],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.primary[300],
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School ID"
                value="SCH-2024-001"
                InputProps={{ readOnly: true }}
                variant="filled"
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: colors.primary[400],
                    "&:hover": {
                      backgroundColor: colors.primary[300],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.primary[300],
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value="123 Education Street, Academic City, AC 12345"
                variant="filled"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: colors.grey[300] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: colors.primary[400],
                    "&:hover": {
                      backgroundColor: colors.primary[300],
                    },
                    "&.Mui-focused": {
                      backgroundColor: colors.primary[300],
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Preferences Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: colors.grey[100],
                fontWeight: 600,
                mb: 4,
              }}
            >
              Application Preferences
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  backgroundColor: colors.primary[500],
                  borderRadius: 2,
                  border: `1px solid ${colors.grey[700]}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: colors.primary[400],
                    borderColor: colors.grey[600],
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: colors.grey[100],
                    fontWeight: 600,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SettingsIcon sx={{ fontSize: "1.25rem" }} />
                  Interface Settings
                </Typography>
                <Box display="flex" flexDirection="column" gap={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.darkMode}
                        onChange={(e) => (
                          colorMode.toggleColorMode(),
                          handlePreferenceChange("darkMode", e.target.checked)
                        )}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: colors.greenAccent[500],
                            "&:hover": {
                              backgroundColor: colors.greenAccent[500] + "20",
                            },
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: colors.greenAccent[500],
                            },
                          "& .MuiSwitch-track": {
                            backgroundColor: colors.grey[600],
                          },
                        }}
                      />
                    }
                    label="Dark Mode"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: colors.grey[100],
                        fontWeight: 500,
                      },
                      margin: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.grey[400],
                      ml: 4,
                      mt: -2,
                    }}
                  >
                    Toggle between light and dark themes
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 3,
                  backgroundColor: colors.primary[500],
                  borderRadius: 2,
                  border: `1px solid ${colors.grey[700]}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: colors.primary[400],
                    borderColor: colors.grey[600],
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: colors.grey[100],
                    fontWeight: 600,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: "1.25rem" }} />
                  Notification Settings
                </Typography>
                <Box display="flex" flexDirection="column" gap={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.emailNotifications}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "emailNotifications",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: colors.greenAccent[500],
                            "&:hover": {
                              backgroundColor: colors.greenAccent[500] + "20",
                            },
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: colors.greenAccent[500],
                            },
                          "& .MuiSwitch-track": {
                            backgroundColor: colors.grey[600],
                          },
                        }}
                      />
                    }
                    label="Email Notifications"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: colors.grey[100],
                        fontWeight: 500,
                      },
                      margin: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.grey[400],
                      ml: 4,
                      mt: -2,
                    }}
                  >
                    Receive notifications via email
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.smsNotifications}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "smsNotifications",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: colors.greenAccent[500],
                            "&:hover": {
                              backgroundColor: colors.greenAccent[500] + "20",
                            },
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: colors.greenAccent[500],
                            },
                          "& .MuiSwitch-track": {
                            backgroundColor: colors.grey[600],
                          },
                        }}
                      />
                    }
                    label="SMS Notifications"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: colors.grey[100],
                        fontWeight: 500,
                      },
                      margin: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.grey[400],
                      ml: 4,
                      mt: -2,
                    }}
                  >
                    Receive notifications via SMS
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={activeTab} index={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <List sx={{ backgroundColor: colors.primary[400] }}>
              <ListItem>
                <ListItemText
                  primary="Student Registration"
                  secondary="Get notified when new students register"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: colors.grey[100],
                    },
                    "& .MuiListItemText-secondary": {
                      color: colors.grey[300],
                    },
                  }}
                />
                <Switch
                  defaultChecked
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: colors.greenAccent[500],
                      "&:hover": {
                        backgroundColor: colors.greenAccent[500] + "20",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: colors.greenAccent[500],
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="System Updates"
                  secondary="Receive notifications about system maintenance"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: colors.grey[100],
                    },
                    "& .MuiListItemText-secondary": {
                      color: colors.grey[300],
                    },
                  }}
                />
                <Switch
                  defaultChecked
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: colors.greenAccent[500],
                      "&:hover": {
                        backgroundColor: colors.greenAccent[500] + "20",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: colors.greenAccent[500],
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Security Alerts"
                  secondary="Important security notifications"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: colors.grey[100],
                    },
                    "& .MuiListItemText-secondary": {
                      color: colors.grey[300],
                    },
                  }}
                />
                <Switch
                  defaultChecked
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: colors.greenAccent[500],
                      "&:hover": {
                        backgroundColor: colors.greenAccent[500] + "20",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: colors.greenAccent[500],
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Report Generation"
                  secondary="Notifications when reports are ready"
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: colors.grey[100],
                    },
                    "& .MuiListItemText-secondary": {
                      color: colors.grey[300],
                    },
                  }}
                />
                <Switch
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: colors.greenAccent[500],
                      "&:hover": {
                        backgroundColor: colors.greenAccent[500] + "20",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: colors.greenAccent[500],
                    },
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={activeTab} index={5}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List sx={{ backgroundColor: colors.primary[400] }}>
              {activityLog.map((activity) => (
                <ListItem
                  key={activity.id}
                  divider
                  sx={{
                    borderBottomColor: colors.grey[700],
                  }}
                >
                  <ListItemIcon>
                    <HistoryIcon sx={{ color: colors.grey[300] }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.action}
                    secondary={`${activity.timestamp} • IP: ${activity.ip}`}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: colors.grey[100],
                      },
                      "& .MuiListItemText-secondary": {
                        color: colors.grey[300],
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </TabPanel>
      </Paper>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: colors.primary[500],
            color: colors.grey[100],
          },
        }}
      >
        <DialogTitle>
          <Typography variant={isMobile ? "h6" : "h5"}>
            Change Password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: colors.grey[300] }}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: colors.primary[400],
                  color: colors.grey[100],
                },
                "& .MuiInputLabel-root": {
                  color: colors.grey[300],
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colors.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.greenAccent[500],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.greenAccent[500],
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: colors.primary[400],
                  color: colors.grey[100],
                },
                "& .MuiInputLabel-root": {
                  color: colors.grey[300],
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colors.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.greenAccent[500],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.greenAccent[500],
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: colors.primary[400],
                  color: colors.grey[100],
                },
                "& .MuiInputLabel-root": {
                  color: colors.grey[300],
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colors.grey[400],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.greenAccent[500],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.greenAccent[500],
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button
            onClick={() => setPasswordDialog(false)}
            sx={{
              color: colors.grey[300],
              "&:hover": {
                backgroundColor: colors.primary[400],
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[500],
              "&:hover": { backgroundColor: colors.greenAccent[600] },
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Account;
