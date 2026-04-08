import { useEffect, useState } from "react";
import { useContext } from "react";
import { ColorModeContext, useMode } from "./theme";
import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  Typography,
  Box,
} from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidenav from "./scenes/global/Sidenav";
import Dashboard from "./scenes/dashboard";
import Students from "./scenes/students";
import Notifications from "./scenes/notifications";
import Teachers from "./scenes/teachers";
import Classes from "./scenes/classes";
import Attendance from "./scenes/attendance";
import Exams from "./scenes/exam-and-grades";
import Assignments from "./assignments";
import Fees from "./scenes/fees-and-finance";
import Timetable from "./scenes/timetable";
import Messages from "./scenes/messages";
import Reports from "./scenes/reports";
import Users from "./scenes/users";
import Settings from "./scenes/settings";
import Account from "./scenes/account";
import StudentDashboard from "./scenes/studentDashboard";
import Login from "./scenes/login";
import Signup from "./scenes/signup";
import { AUTH_TOKEN_KEY } from "./api";
// import Calendar from "./scenes/calendar";
import { apiRequest } from "./api";
import { AuthContext } from "./context/AuthContext";
import capusername from "./components/Capitalize";

function App() {
  const [theme, colorMode] = useMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  );

  const { setUser } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCurrentUser() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      await apiRequest
        .post("/api/auth/validate-token", { token })
        .then((response) => {
          setUser(response.data.user);
          setIsLoggedIn(true);
        })
        .catch(() => {
          setUser(null);
          setIsLoggedIn(false);
        });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    fetchCurrentUser();
  }, [loggedIn]);

  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const syncAuthState = () => {
      setLoggedIn(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));
    };

    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const handleLoginSuccess = async (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setLoggedIn(true);
    // Fetch user data immediately after login
    await fetchCurrentUser();
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loggedIn ? (
          <div className="app-shell">
            <aside
              className={`sidebar-pane ${isMobile ? "sidebar-mobile" : ""} ${
                mobileSidebarOpen ? "sidebar-open" : ""
              }`}
            >
              <Sidenav
                isMobile={isMobile}
                onNavigate={() => setMobileSidebarOpen(false)}
                user={user}
              />
            </aside>
            {isMobile && mobileSidebarOpen && (
              <button
                type="button"
                className="sidebar-backdrop"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close menu"
              />
            )}
            <main className="content-pane">
              <header className="topbar-pane">
                <Topbar
                  showMenuButton={isMobile}
                  onMenuClick={() => setMobileSidebarOpen(true)}
                  onLogout={handleLogout}
                  user={user}
                />
                {isLoggedIn && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h4" sx={{ ml: 2, mb: 1 }}>
                      {isLoading ? (
                        "Loading user..."
                      ) : (
                        <>Welcome, {user ? capusername(user.name) : "Admin"}</>
                      )}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        mr: 2,
                        mb: 1,
                        color: "text.primary",
                        backgroundColor: "background.paper",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {isLoading ? (
                        "Loading user..."
                      ) : (
                        <>
                          {user?.role === "super-admin" && "Admin"}
                          {user?.role === "admin" && "Admin"}
                          {user?.role === "teacher" && "Teacher"}
                          {user?.role === "student" && "Student"}
                        </>
                      )}
                    </Typography>
                  </Box>
                )}
              </header>
              <section className="page-scroll-area">
                <Routes>
                  {user?.role === "student" ? (
                    <Route path="/" element={<StudentDashboard />} />
                  ) : (
                    <Route path="/" element={<Dashboard />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/students" element={<Students />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/teachers" element={<Teachers />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/classes" element={<Classes />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/attendance" element={<Attendance />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/exams-grades" element={<Exams />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route
                      path="/assignments"
                      element={<Assignments />}
                    ></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/fees" element={<Fees />}></Route>
                  )}
                  <Route path="/messages" element={<Messages />}></Route>
                  {user?.role !== "student" && (
                    <Route
                      path="/notifications"
                      element={<Notifications />}
                    ></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/timetable" element={<Timetable />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route
                      path="/reports-analytics"
                      element={<Reports user={user} />}
                    ></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/users-roles" element={<Users />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/account" element={<Account />}></Route>
                  )}
                  {user?.role !== "student" && (
                    <Route path="/settings" element={<Settings />}></Route>
                  )}
                </Routes>
              </section>
            </main>
          </div>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={
                <Login isMobile={isMobile} onLogin={handleLoginSuccess} />
              }
            />
            <Route path="/signup" element={<Signup isMobile={isMobile} />} />
            <Route
              path="*"
              element={
                <Login isMobile={isMobile} onLogin={handleLoginSuccess} />
              }
            />
          </Routes>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
