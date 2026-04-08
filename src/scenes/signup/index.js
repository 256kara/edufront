import { useMemo, useState, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { tokens } from "../../theme";
import { apiRequest } from "../../api";
import { useNavigate } from "react-router-dom";

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

export default function Signup({ isMobile }) {
  const theme = useTheme();
  const colors = tokens("light");
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    school_name: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
    location: "",
    plan: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorDialog, setErrorDialog] = useState({
    open: false,
    title: "",
    message: "",
  });

  const [isPayment, setIsPayment] = useState(false);

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
      opacity: 1,
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
    const baseValidation =
      formValues.name?.trim() &&
      formValues.email?.trim() &&
      EMAIL_REGEX.test(formValues.email) &&
      formValues.password?.trim() &&
      formValues.password === formValues.confirmPassword &&
      formValues.school_name?.trim() &&
      formValues.phone?.trim();

    if (!isPayment) {
      return baseValidation;
    }

    // Include payment validation when payment is enabled
    return (
      baseValidation &&
      formValues.cardNumber?.trim() &&
      formValues.expiry?.trim() &&
      formValues.cvv?.trim() &&
      formValues.nameOnCard?.trim()
    );
  }, [formValues, isPayment]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [fieldErrors],
  );

  const validateForm = () => {
    const errors = {};
    if (!formValues.name?.trim()) errors.name = "Name is required";
    if (!formValues.email?.trim()) errors.email = "Email is required";
    else if (!EMAIL_REGEX.test(formValues.email))
      errors.email = "Invalid email format";
    if (!formValues.password?.trim()) errors.password = "Password is required";
    if (formValues.password !== formValues.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!formValues.school_name?.trim())
      errors.school_name = "School name is required";
    if (!formValues.phone?.trim()) errors.phone = "Phone is required";

    // Validate payment fields only if isPayment is true
    if (isPayment) {
      if (!formValues.cardNumber?.trim())
        errors.cardNumber = "Card number is required";
      if (!formValues.expiry?.trim()) errors.expiry = "Expiry date is required";
      if (!formValues.cvv?.trim()) errors.cvv = "CVV is required";
      if (!formValues.nameOnCard?.trim())
        errors.nameOnCard = "Name on card is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const { confirmPassword, ...data } = formValues;
      // Demo payment: just log, don't process
      console.log("Payment details (demo):", {
        cardNumber: data.cardNumber,
        expiry: data.expiry,
        cvv: data.cvv,
        nameOnCard: data.nameOnCard,
      });

      const response = await apiRequest.post("/auth/signup-admin", data);
      if (response.data.message) {
        setErrorDialog({
          open: true,
          title: "Success",
          message: response.data.message + " Please login.",
        });
        // Redirect to login after success
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundColor: colors.primary[500],
        padding: 3,
      }}
    >
      <Box className="login-card" sx={{ width: "100%", maxWidth: 600 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color={colors.greenAccent[500]}
        >
          Admin Signup
        </Typography>

        <Box component="form" className="login-form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                sx={textFieldSx}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                sx={textFieldSx}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleInputChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                sx={textFieldSx}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                sx={textFieldSx}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Name"
                name="school_name"
                value={formValues.school_name}
                onChange={handleInputChange}
                error={!!fieldErrors.school_name}
                helperText={fieldErrors.school_name}
                sx={textFieldSx}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                sx={textFieldSx}
                margin="normal"
              />
            </Grid>
          </Grid>

          {isPayment && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mt: 3, color: colors.greenAccent[500] }}
              >
                Payment Information (Demo)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formValues.cardNumber}
                    onChange={handleInputChange}
                    error={!!fieldErrors.cardNumber}
                    helperText={fieldErrors.cardNumber}
                    sx={textFieldSx}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Expiry (MM/YY)"
                    name="expiry"
                    value={formValues.expiry}
                    onChange={handleInputChange}
                    error={!!fieldErrors.expiry}
                    helperText={fieldErrors.expiry}
                    sx={textFieldSx}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    value={formValues.cvv}
                    onChange={handleInputChange}
                    error={!!fieldErrors.cvv}
                    helperText={fieldErrors.cvv}
                    sx={textFieldSx}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Name on Card"
                    name="nameOnCard"
                    value={formValues.nameOnCard}
                    onChange={handleInputChange}
                    error={!!fieldErrors.nameOnCard}
                    helperText={fieldErrors.nameOnCard}
                    sx={textFieldSx}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Box mt={3} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid || isSubmitting}
              sx={{
                backgroundColor: colors.greenAccent[600],
                "&:hover": { backgroundColor: colors.greenAccent[700] },
                minWidth: 150,
              }}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </Box>

          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ color: colors.greenAccent[500] }}
            >
              Already have an account? Login
            </Button>
          </Box>
        </Box>
      </Box>

      <ErrorDialog
        open={errorDialog.open}
        title={errorDialog.title}
        message={errorDialog.message}
        onClose={() => setErrorDialog({ open: false, title: "", message: "" })}
      />
    </Box>
  );
}
