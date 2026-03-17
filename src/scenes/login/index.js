import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { apiRequest } from "../../api";

export default function Login({ isMobile, onLogin }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    rememberMe: true,
    school_name: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      formValues.password.trim()
    );
  }, [formValues]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      setError("Please fill in username, email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        name: formValues.username.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        school_name: formValues.school_name.trim(),
      };

      const response = await apiRequest.post("/api/auth/login", payload);
      const token =
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.data?.data?.token;

      if (!token) {
        throw new Error("Token missing from login response.");
      }

      onLogin?.(token);
    } catch (submitError) {
      const apiMessage =
        submitError?.response?.data?.message ||
        submitError?.response?.data?.error;

      setError(apiMessage || "Check your fields and try again.");
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

          <img
            src="https://edupulse.netlify.app/static/media/login-illustration.9c8b1e5a.png"
            alt="Login Illustration"
            className="login-illustration"
          />
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
            fullWidth
            required
            variant="outlined"
            sx={textFieldSx}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldSx}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            fullWidth
            required
            sx={textFieldSx}
          />
          <TextField
            label="School Name"
            name="school_name"
            value={formValues.school_name}
            onChange={handleChange}
            fullWidth
            required
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
      </Box>
    </Box>
  );
}
