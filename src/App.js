import { useEffect, useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Routes, Route } from "react-router-dom";
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
import Login from "./scenes/login";
import { AUTH_TOKEN_KEY } from "./api";
// import Calendar from "./scenes/calendar";
import { apiRequest } from "./api";

function App() {
  const [theme, colorMode] = useMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  );

  // create user context and provider to manage auth state across the app
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCurrentUser() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      const response = await apiRequest
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
  }, []);

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

  const handleLoginSuccess = (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setLoggedIn(false);
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
                />
                {isLoggedIn && (
                  <Typography variant="h4" sx={{ ml: 2, mt: 1 }}>
                    {isLoading ? (
                      "Loading user..."
                    ) : (
                      <>
                        Welcome, {user.name || "Admin"}, {user.role}{" "}
                      </>
                    )}
                  </Typography>
                )}
              </header>
              <section className="page-scroll-area">
                <Routes>
                  <Route path="/" element={<Dashboard />}></Route>
                  <Route path="/students" element={<Students />}></Route>
                  <Route path="/teachers" element={<Teachers />}></Route>
                  <Route path="/classes" element={<Classes />}></Route>
                  <Route path="/attendance" element={<Attendance />}></Route>
                  <Route path="/exams-grades" element={<Exams />}></Route>
                  <Route path="/assignments" element={<Assignments />}></Route>
                  <Route path="/fees" element={<Fees />}></Route>
                  <Route path="/messages" element={<Messages />}></Route>
                  <Route
                    path="/notifications"
                    element={<Notifications />}
                  ></Route>
                  <Route path="/timetable" element={<Timetable />}></Route>
                  <Route
                    path="/reports-analytics"
                    element={<Reports />}
                  ></Route>
                  <Route path="/users-roles" element={<Users />}></Route>
                  <Route path="/account" element={<Account />}></Route>
                  <Route path="/settings" element={<Settings />}></Route>

                  {/* <Route path="/calendar" element={<Calendar />}></Route> */}
                </Routes>
              </section>
            </main>
          </div>
        ) : (
          <Login isMobile={isMobile} onLogin={handleLoginSuccess} />
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
