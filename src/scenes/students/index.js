import * as React from "react";
import { useContext, useState } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  InputBase,
  IconButton,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { AuthContext } from "../../context/AuthContext";

import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "../../theme";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SaveIcon from "@mui/icons-material/Save";
import { apiRequest } from "../../api";
import StudentsTable from "../../components/Data";

const Students = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [error, setError] = React.useState("");
  const { user } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [studentData, setStudentData] = React.useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    classLevel: "",
    phone: "",
    school_name: user?.school_name,
    admissionNumber: "",
    stream: "",
    combination: "",
    nin: "",
    address: "",
    healthStatus: "",
    emergencyContact: "",
    username: "",
    lin: "",
  });
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [isexport, setIsexport] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (event) => {
    setStudentData({ ...studentData, [event.target.name]: event.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      setError("");
      clearForm();
    }
  };

  const clearForm = () => {
    setStudentData({
      name: "",
      email: "",
      gender: "",
      password: "",
      classLevel: "",
      phone: "",
      school_name: user?.school_name,
      admissionNumber: "",
      stream: "",
      combination: "",
      nin: "",
      address: "",
      healthStatus: "",
      emergencyContact: "",
      username: "",
      lin: "",
    });
  };

  const handleSave = async () => {
    try {
      const response = await apiRequest.post(
        "/api/admin/signup-student",
        studentData,
      );

      const msg = response.data.message;

      setOpenSuccess(msg || "Student added successfully!");
      clearForm();
      setOpen(false);
      setError("");
      setRefresh((prev) => !prev);
    } catch (err) {
      setError("Failed. Please check fields and try again.");
    }
  };

  const downloadTemplate = () => {
    // Create a sample template with all required fields
    const templateData = [
      {
        "ADMISSION NO": "ADM001",
        NAME: "John Doe",
        CLASS: "S1",
        STREAM: "SCI",
        GENDER: "male",
        PHONE: "+256700000000",
        EMAIL: "john.doe@school.com",
        NIN: "CM123456789ABC",
        COMBINATION: "PCM",
        ADDRESS: "123 Main Street, Kampala",
        "HEALTH STATUS": "Healthy",
        "EMERGENCY CONTACT": "+256711111111",
        USERNAME: "johndoe",
        LIN: "Kmss",
        PASSWORD: "defaultpassword123",
      },
      {
        "ADMISSION NO": "ADM002",
        NAME: "Jane Smith",
        CLASS: "S2",
        STREAM: "ARTS",
        GENDER: "female",
        PHONE: "+256722222222",
        EMAIL: "jane.smith@school.com",
        NIN: "CF987654321XYZ",
        COMBINATION: "BCM",
        ADDRESS: "456 Oak Avenue, Entebbe",
        "HEALTH STATUS": "Healthy",
        "EMERGENCY CONTACT": "+256733333333",
        USERNAME: "janesmith",
        LIN: "Kmss",
        PASSWORD: "defaultpassword123",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Student_Template");

    XLSX.writeFile(workbook, "student_import_template.xlsx");
  };

  const uploadMultipleFiles = async (selectedFiles) => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    let totalSuccess = 0;
    let totalFailed = 0;
    let allErrors = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("school_name", user?.school_name);

      try {
        const response = await apiRequest.post(
          "/api/bulk/students/import",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.data.results) {
          totalSuccess += response.data.results.success;
          totalFailed += response.data.results.failed;
          if (
            response.data.results.errors &&
            response.data.results.errors.length > 0
          ) {
            allErrors.push(...response.data.results.errors);
          }
        } else {
          totalSuccess += 1; // For backward compatibility
        }
      } catch (error) {
        totalFailed++;
        const errorMessage =
          error.response?.data?.message || `Failed to upload ${file.name}`;
        allErrors.push(errorMessage);
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    setRefresh((prev) => !prev);
    setFiles([]);
    setIsUploading(false);

    if (totalFailed === 0) {
      setOpenSuccess(`${totalSuccess} student(s) imported successfully!`);
    } else if (totalSuccess === 0) {
      setError(`Bulk import failed: ${allErrors.join(", ")}`);
    } else {
      setOpenSuccess(
        `${totalSuccess} student(s) imported, ${totalFailed} failed. ${allErrors.length > 0 ? "Check console for details." : ""}`,
      );
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      uploadMultipleFiles(selectedFiles);
    }
  };

  // close success on windo click
  React.useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        setOpenSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSuccess, error]);

  return (
    <Box m="20px">
      {/* error */}
      {error && (
        <Box>
          <Alert severity="info" sx={{ color: colors.blueAccent[300] }}>
            {error}
          </Alert>
        </Box>
      )}
      {openSuccess && (
        <Box sx={{ color: colors.blueAccent[300] }}>
          <Alert severity="success" sx={{ color: colors.blueAccent[300] }}>
            {openSuccess}
          </Alert>
        </Box>
      )}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        mb="20px"
        gap={2}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Students
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your Students.
          </Typography>
        </Box>
        <Box
          sx={{
            color: colors.blueAccent[300],
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: colors.blueAccent[300] }}
          >
            <strong>Bulk Import:</strong> Download template, fill with student
            data, then upload Excel file.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Required fields: Admission No, Name, Email, Username
          </Typography>
        </Box>
      </Box>

      {/* dialog */}

      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill Student Data</DialogTitle>
        {error && (
          <Box>
            <Alert severity="info" sx={{ color: colors.blueAccent[300] }}>
              {error}
            </Alert>
          </Box>
        )}
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            className="student-form"
            component="form"
            sx={{
              color: colors.blueAccent[300],
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: "100%",
            }}
          >
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="name"
                label="Name"
                variant="filled"
                value={studentData.name}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="phone"
                label="Phone"
                variant="filled"
                value={studentData.phone}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <InputLabel
                id="gender-id"
                sx={{
                  color: colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                }}
              >
                Gender
              </InputLabel>
              <Select
                labelId="gender-id"
                name="gender"
                value={studentData.gender}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    label="Gender"
                    sx={{
                      backgroundColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 900 : 100
                        ],
                      color:
                        colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                      "& fieldset": {
                        borderColor:
                          colors.primary[
                            theme.palette.mode === "dark" ? 600 : 300
                          ],
                      },
                      "&:hover fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 500 : 600
                          ],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 400 : 500
                          ],
                      },
                    }}
                  />
                }
                onFocus={() => setError("")}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="email"
                label="Email"
                variant="filled"
                value={studentData.email}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="filled"
                value={studentData.password}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>{" "}
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <InputLabel
                id="classLevel-id"
                sx={{
                  color: colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                }}
              >
                Class Level
              </InputLabel>
              <Select
                labelId="classLevel-id"
                name="classLevel"
                value={studentData.classLevel}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    label="Class Level"
                    sx={{
                      backgroundColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 900 : 100
                        ],
                      color:
                        colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                      "& fieldset": {
                        borderColor:
                          colors.primary[
                            theme.palette.mode === "dark" ? 600 : 300
                          ],
                      },
                      "&:hover fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 500 : 600
                          ],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 400 : 500
                          ],
                      },
                    }}
                  />
                }
                onFocus={() => setError("")}
              >
                <MenuItem value="S1">S1</MenuItem>
                <MenuItem value="S2">S2</MenuItem>
                <MenuItem value="S3">S3</MenuItem>
                <MenuItem value="S4">S4</MenuItem>
                <MenuItem value="S5">S5</MenuItem>
                <MenuItem value="S6">S6</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="admissionNumber"
                label="Admission Number"
                variant="filled"
                value={studentData.admissionNumber}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <InputLabel
                id="stream-id"
                sx={{
                  color: colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                }}
              >
                Stream
              </InputLabel>
              <Select
                labelId="stream-id"
                name="stream"
                value={studentData.stream}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    label="Stream"
                    sx={{
                      backgroundColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 900 : 100
                        ],
                      color:
                        colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                      "& fieldset": {
                        borderColor:
                          colors.primary[
                            theme.palette.mode === "dark" ? 600 : 300
                          ],
                      },
                      "&:hover fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 500 : 600
                          ],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 400 : 500
                          ],
                      },
                    }}
                  />
                }
                onFocus={() => setError("")}
              >
                <MenuItem value="SCI">SCI</MenuItem>
                <MenuItem value="ARTS">ARTS</MenuItem>
                <MenuItem value="N">N</MenuItem>
                <MenuItem value="E">E</MenuItem>
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="W">W</MenuItem>
                <MenuItem value="NE">NE</MenuItem>
                <MenuItem value="NW">NW</MenuItem>
                <MenuItem value="SE">SE</MenuItem>
                <MenuItem value="SW">SW</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <InputLabel
                id="combination-id"
                sx={{
                  color: colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                }}
              >
                Combination
              </InputLabel>
              <Select
                labelId="combination-id"
                name="combination"
                value={studentData.combination}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    label="Combination"
                    sx={{
                      backgroundColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 900 : 100
                        ],
                      color:
                        colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                      "& fieldset": {
                        borderColor:
                          colors.primary[
                            theme.palette.mode === "dark" ? 600 : 300
                          ],
                      },
                      "&:hover fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 500 : 600
                          ],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 400 : 500
                          ],
                      },
                    }}
                  />
                }
                onFocus={() => setError("")}
              >
                <MenuItem value="PCM">PCM</MenuItem>
                <MenuItem value="PCB">PCB</MenuItem>
                <MenuItem value="BCM">BCM</MenuItem>
                <MenuItem value="BCFN">BCFN</MenuItem>
                <MenuItem value="N/A">N/A</MenuItem>
                <MenuItem value="MEE">MEE</MenuItem>
                <MenuItem value="MEA">MEA</MenuItem>
                <MenuItem value="HELL">HELL</MenuItem>
                <MenuItem value="MAT">MAT</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="nin"
                label="NIN"
                variant="filled"
                value={studentData.nin}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="address"
                label="Address"
                variant="filled"
                value={studentData.address}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <InputLabel
                id="healthStatus-id"
                sx={{
                  color: colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                }}
              >
                Health Status
              </InputLabel>
              <Select
                labelId="healthStatus-id"
                name="healthStatus"
                value={studentData.healthStatus}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    label="Health Status"
                    sx={{
                      backgroundColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 900 : 100
                        ],
                      color:
                        colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                      "& fieldset": {
                        borderColor:
                          colors.primary[
                            theme.palette.mode === "dark" ? 600 : 300
                          ],
                      },
                      "&:hover fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 500 : 600
                          ],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          colors.greenAccent[
                            theme.palette.mode === "dark" ? 400 : 500
                          ],
                      },
                    }}
                  />
                }
                onFocus={() => setError("")}
              >
                <MenuItem value="Sick">Sick</MenuItem>
                <MenuItem value="N/A">N/A</MenuItem>
                <MenuItem value="Healthy">Healthy</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="emergencyContact"
                label="Emergency Contact"
                variant="filled"
                value={studentData.emergencyContact}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="username"
                label="Username"
                variant="filled"
                value={studentData.username}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
            <FormControl sx={{ color: colors.blueAccent[300] }}>
              <TextField
                name="lin"
                label="LIN"
                variant="filled"
                value={studentData.lin}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                    "& fieldset": {
                      borderColor:
                        colors.primary[
                          theme.palette.mode === "dark" ? 600 : 300
                        ],
                    },
                    "&:hover fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 500 : 600
                        ],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        colors.greenAccent[
                          theme.palette.mode === "dark" ? 400 : 500
                        ],
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      colors.grey[theme.palette.mode === "dark" ? 300 : 700],
                  },
                }}
                onFocus={() => setError("")}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: colors.greenAccent[500],
              borderColor: colors.greenAccent[500],
              "&:hover": {
                backgroundColor: colors.greenAccent[500],
                color: colors.primary[500],
              },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading
            variant="filled"
            loadingPosition="end"
            startIcon={<SaveIcon />}
            sx={{
              color: colors.greenAccent[500],
              borderColor: colors.greenAccent[500],
              "&:hover": {
                backgroundColor: colors.greenAccent[500],
                color: colors.primary[500],
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* end */}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb="16px"
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ width: "100%" }}
      >
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          sx={{ flex: 1, width: { xs: "100%", md: "auto" } }}
        >
          <Button
            sx={{
              color: colors.primary[500],
              width: { xs: "100%", sm: "auto" },
              minWidth: { xs: "100%", sm: "120px" },
            }}
            onClick={handleClickOpen}
            variant="contained"
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Add Student
          </Button>

          <Button
            sx={{
              color: colors.blueAccent[300],
              width: { xs: "100%", sm: "auto" },
              minWidth: { xs: "100%", sm: "120px" },
            }}
            onClick={downloadTemplate}
            variant="outlined"
            color={theme.palette.mode === "dark" ? "primary" : "secondary"}
          >
            Download Template
          </Button>

          {/* Single upload button for multiple files */}
          <Box
            sx={{
              color: colors.blueAccent[300],
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              multiple
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="upload-files-input"
            />
            <Button
              component="label"
              htmlFor="upload-files-input"
              disabled={isUploading}
              sx={{
                color: colors.primary[500],
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "100%", sm: "120px" },
              }}
              variant="contained"
              color={theme.palette.mode === "dark" ? "secondary" : "primary"}
            >
              {isUploading ? "Uploading..." : "Upload Multiple Files"}
            </Button>
          </Box>

          <Button
            sx={{
              color: colors.primary[500],
              width: { xs: "100%", sm: "auto" },
              minWidth: { xs: "100%", sm: "120px" },
            }}
            onClick={() => setIsexport(!isexport)}
            variant="contained"
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Export
          </Button>
        </Stack>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            sx={{
              color: colors.blueAccent[300],
              width: { xs: "100%", sm: "200px" },
            }}
          >
            <InputBase
              sx={{ color: colors.blueAccent[300], flex: 1, px: 2 }}
              placeholder="Search student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton type="button" sx={{ color: colors.blueAccent[300] }}>
              <SearchIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              color: colors.blueAccent[300],
              width: { xs: "100%", sm: "150px" },
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="classLevel-label">Class</InputLabel>
              <Select
                labelId="label"
                value={classFilter}
                label="Class"
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Students</em>
                </MenuItem>
                <MenuItem value="S1">S1</MenuItem>
                <MenuItem value="S2">S2</MenuItem>
                <MenuItem value="S3">S3</MenuItem>
                <MenuItem value="S4">S4</MenuItem>
                <MenuItem value="S5">S5</MenuItem>
                <MenuItem value="S6">S6</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Stack>
      <StudentsTable
        search={search}
        classFilter={classFilter}
        isexport={isexport}
        refresh={refresh}
      />
    </Box>
  );
};

export default Students;
