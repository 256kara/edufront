import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { tokens } from "../../theme";
import { apiRequest } from "../../api";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error dialog component
const ErrorDialog = ({ open, title, message, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="contained">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default function Login({ isMobile, onLogin }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    rememberMe: true,
    school_name: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorDialog, setErrorDialog] = useState({
    open: false,
    title: "",
    message: "",
  });

  const textFieldSx = {
    input: {
      color: colors.greenAccent[500],
      borderColor: colors.greenAccent[500],
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: colors.greenAccent[500],
      },
      "&:hover fieldset": {
        borderColor: colors.greenAccent[500],
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.greenAccent[500],
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: colors.greenAccent[500],
    },
    "& .MuiInputBase-input": {
      color: colors.greenAccent[500],
    },
    "& .MuiInputBase-root": {
      color: colors.greenAccent[500],
    },
    "& .MuiInputLabel-root": {
      color: colors.greenAccent[500],
    },
    "& .MuiInputLabel-outlined": {
      color: colors.greenAccent[500],
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: colors.greenAccent[500],
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      color: colors.greenAccent[500],
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink.Mui-focused": {
      color: colors.greenAccent[500],
      opacity: 1,
    },
  };

  const isFormValid = useMemo(() => {
    return (
      formValues.username.trim() &&
      formValues.email.trim() &&
      EMAIL_REGEX.test(formValues.email.trim()) &&
      formValues.password.trim() &&
      formValues.school_name.trim()
    );
  }, [formValues]);

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...fieldErrors };

      switch (name) {
        case "email":
          if (!value.trim()) {
            errors.email = "Email is required";
          } else if (!EMAIL_REGEX.test(value.trim())) {
            errors.email = "Please enter a valid email address";
          } else {
            delete errors.email;
          }
          break;
        case "username":
          if (!value.trim()) {
            errors.username = "Username is required";
          } else if (value.trim().length < 2) {
            errors.username = "Username must be at least 2 characters";
          } else {
            delete errors.username;
          }
          break;
        case "password":
          if (!value.trim()) {
            errors.password = "Password is required";
          } else if (value.trim().length < 4) {
            errors.password = "Password must be at least 4 characters";
          } else {
            delete errors.password;
          }
          break;
        case "school_name":
          if (!value.trim()) {
            errors.school_name = "School name is required";
          } else {
            delete errors.school_name;
          }
          break;
        default:
          break;
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [fieldErrors],
  );

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate field as user types (only for email)
    if (name === "email" && value.trim()) {
      validateField(name, value);
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name && value.trim()) {
      validateField(name, value);
    }
  };

  const showErrorDialog = (title, message) => {
    setErrorDialog({
      open: true,
      title,
      message,
    });
  };

  const closeErrorDialog = () => {
    setErrorDialog({ open: false, title: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields
    const validation = {
      username: validateField("username", formValues.username),
      email: validateField("email", formValues.email),
      password: validateField("password", formValues.password),
      school_name: validateField("school_name", formValues.school_name),
    };

    const hasErrors = !Object.values(validation).every((v) => v);

    if (hasErrors) {
      showErrorDialog(
        "Validation Error",
        "Please fix the errors in the form before submitting.",
      );
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        name: formValues.username.trim(),
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
        school_name: formValues.school_name.trim(),
      };

      const response = await apiRequest.post("/api/auth/login", payload);
      const token =
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.data?.data?.token;

      // return console.log("Login response data:", response.data.error, token);

      if (response?.data?.error) {
        showErrorDialog("Login Error", response.data.error);
        return;
      }
      onLogin?.(token);
    } catch (submitError) {
      let errorMessage = "Login failed. Please check your credentials.";

      if (submitError.response?.data?.error) {
        errorMessage = submitError.response.data.error;
        console.error("Login error details:", submitError.response.data.error);
      } else if (submitError.response?.data?.message) {
        errorMessage = submitError.response.data.message;
      } else if (submitError.message) {
        errorMessage = submitError.message;
      }

      showErrorDialog("Login Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="login-page">
      {!isMobile && (
        <Box className="login-visual" backgroundColor={colors.primary[400]}>
          <Typography variant="h2" sx={{ color: colors.greenAccent[400] }}>
            Edupulse
          </Typography>
          <Typography variant="h6" color="text.secondary" mt={1} mb={2}>
            Smarter school operations in one dashboard.
          </Typography>

          <Box>
            <img
              src="edulogo.png"
              alt="Login Illustration"
              className="login-illustration"
            />
          </Box>
        </Box>
      )}

      <Box className="login-card">
        <Typography
          variant="h3"
          color={colors.greenAccent[500]}
          fontWeight={700}
        >
          Welcome Back
        </Typography>
        <Typography variant="body1" color={colors.grey[500]} mt={1} mb={2}>
          Login to continue to Edupulse Admin.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            required
            variant="outlined"
            error={!!fieldErrors.username}
            helperText={fieldErrors.username}
            sx={textFieldSx}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            required
            variant="outlined"
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            sx={textFieldSx}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            required
            variant="outlined"
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            sx={textFieldSx}
          />
          <TextField
            label="School Name"
            name="school_name"
            value={formValues.school_name}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            required
            variant="outlined"
            error={!!fieldErrors.school_name}
            helperText={fieldErrors.school_name}
            sx={textFieldSx}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formValues.rememberMe}
                onChange={handleChange}
                sx={{
                  "& .MuiSvgIcon-root": {
                    color: colors.greenAccent[500],
                  },
                }}
              />
            }
            label="Remember me"
          />

          <Button
            variant="contained"
            type="submit"
            disabled={!isFormValid || isSubmitting}
            size="large"
            sx={{
              "&.Mui-disabled": {
                backgroundColor: colors.grey[800],
                color: colors.grey[500],
              },
            }}
          >
            {isSubmitting ? "Signing In..." : "Log In"}
          </Button>
        </form>

        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="text"
            onClick={() => navigate("/signup")}
            sx={{ color: colors.greenAccent[500] }}
          >
            Don't have an account? Sign Up
          </Button>
        </Box>

        <ErrorDialog
          open={errorDialog.open}
          title={errorDialog.title}
          message={errorDialog.message}
          onClose={closeErrorDialog}
        />
      </Box>
    </Box>
  );
}
