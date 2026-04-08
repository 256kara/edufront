import { useState, useEffect, useMemo } from "react";
import { useContext } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  InputAdornment,
  Grid,
  useTheme,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { apiRequest } from "../../api";
import { tokens } from "../../theme";
import { AuthContext } from "../../context/AuthContext";

const Messages = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const isStudent = user?.role === "student";

  const fetchMessages = async (schoolId) => {
    if (!schoolId) return;
    setFetching(true);
    setError("");
    try {
      const response = await apiRequest.get(`/api/messages/get/${schoolId}`);
      setMessages(response.data || []);
      if (response.data?.length) {
        setSelectedMessageId(response.data[0]._id);
      } else {
        setSelectedMessageId(null);
      }
    } catch (err) {
      setError("Failed to fetch messages. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  const refresh = () => {
    if (user?.school_id) fetchMessages(user?.school_id);
  };

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;
    const term = searchTerm.toLowerCase();
    return messages.filter(
      (msg) =>
        msg.title.toLowerCase().includes(term) ||
        msg.content.toLowerCase().includes(term),
    );
  }, [messages, searchTerm]);

  const selectedMessage = useMemo(
    () => messages.find((msg) => msg._id === selectedMessageId),
    [messages, selectedMessageId],
  );

  useEffect(() => {
    if (user?.school_id) fetchMessages(user.school_id);
  }, [user?.school_id]);

  // fetch messages when page loads
  useEffect(() => {
    if (user?.school_id) fetchMessages(user.school_id);
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await apiRequest.post("/api/messages/create", {
        title: form.title,
        content: form.content,
        school_name: user.school_name,
      });
      setForm({ title: "", content: "" });
      setSuccess("Message created successfully.");
      setCreateDialogOpen(false);
      refresh();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create message.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await apiRequest.delete(`/api/messages/delete/${id}`);
      setSuccess("Message deleted successfully.");
      if (selectedMessageId === id) setSelectedMessageId(null);
      refresh();
    } catch (err) {
      setError("Failed to delete message. Please try again.");
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const toggleCreateDialog = (open) => setCreateDialogOpen(open);

  return (
    <Box
      m={{ xs: "10px", sm: "15px", md: "20px" }}
      sx={{
        backgroundColor:
          colors.primary[theme.palette.mode === "dark" ? 500 : 500],
        minHeight: "100vh",
        paddingBottom: "20px",
      }}
    >
      <Box mb={{ xs: 2, md: 3 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          mb={1}
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            color: colors.blueAccent[300],
          }}
        >
          Messages
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
            color: colors.blueAccent[300],
          }}
        >
          {isStudent
            ? `Your Messages student ${user?.name}`
            : `Manage announcements for ${user?.school_name || "your organization"}`}
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            backgroundColor:
              colors.redAccent[theme.palette.mode === "dark" ? 800 : 100],
            color: colors.redAccent[theme.palette.mode === "dark" ? 100 : 900],
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            backgroundColor:
              colors.greenAccent[theme.palette.mode === "dark" ? 800 : 100],
            color:
              colors.greenAccent[theme.palette.mode === "dark" ? 100 : 900],
          }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} lg={5}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              display: "flex",
              gap: 1,
              alignItems: "center",
              backgroundColor:
                colors.primary[theme.palette.mode === "dark" ? 800 : 50] ||
                colors.grey[theme.palette.mode === "dark" ? 800 : 50] ||
                "#ffffff",
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 1px 10px rgba(0,0,0,0.3)"
                  : "0 1px 5px rgba(255, 255, 255, 0.5)",
            }}
          >
            <TextField
              size="small"
              placeholder="Search messages..."
              value={searchTerm}
              fullWidth
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.primary[500],

                  color: colors.primary[100],
                  "& fieldset": {
                    borderColor:
                      colors.greenAccent[
                        theme.palette.mode === "dark" ? 600 : 300
                      ],
                  },
                  "&:hover fieldset": {
                    borderColor:
                      colors.greenAccent[
                        theme.palette.mode === "dark" ? 300 : 700
                      ],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor:
                      theme.palette.mode === "dark" ? "secondary" : "primrary",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: colors.primary[100],
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color:
                          colors.primary[
                            theme.palette.mode === "dark" ? 100 : 100
                          ],
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            {isStudent ? null : (
              <Button
                variant="contained"
                color={theme.palette.mode === "dark" ? "secondary" : "primary"}
                startIcon={<AddIcon />}
                onClick={() => toggleCreateDialog(true)}
                sx={{
                  color: colors.primary[500],
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  padding: { xs: "6px 12px", sm: "8px 16px" },
                }}
              >
                Add
              </Button>
            )}
          </Paper>

          <Paper
            sx={{
              mt: 2,
              p: { xs: 1.5, sm: 2 },
              minHeight: { xs: 300, sm: 400, md: 460 },
              backgroundColor:
                colors.primary[theme.palette.mode === "dark" ? 800 : 50] ||
                colors.grey[theme.palette.mode === "dark" ? 800 : 50] ||
                "#ffffff",
              border: `1px solid ${colors.primary[theme.palette.mode === "dark" ? 700 : 200]}`,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "none",
            }}
          >
            {fetching ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress
                  sx={{
                    color:
                      colors.blueAccent[
                        theme.palette.mode === "dark" ? 500 : 600
                      ],
                  }}
                />
              </Box>
            ) : filteredMessages.length === 0 ? (
              <Typography
                sx={{
                  color: colors.blueAccent[300],
                  textAlign: "center",
                  mt: 4,
                }}
              >
                No messages found.
              </Typography>
            ) : (
              <List disablePadding>
                {filteredMessages.map((msg) => (
                  <Box key={msg._id}>
                    <ListItem
                      button
                      selected={msg._id === selectedMessageId}
                      onClick={() => setSelectedMessageId(msg._id)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        "&.Mui-selected": {
                          color: colors.primary[500],
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? colors.blueAccent[700]
                              : colors.blueAccent[500],
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? colors.blueAccent[700]
                                : colors.blueAccent[500],
                          },
                        },
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? colors.blueAccent[700]
                              : colors.blueAccent[900],

                          color: colors.primary[500],
                        },
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setDeleteDialog({ open: true, id: msg._id })
                          }
                          sx={{
                            color:
                              colors.redAccent[
                                theme.palette.mode === "dark" ? 400 : 600
                              ],
                            "&:hover": {
                              backgroundColor:
                                colors.redAccent[
                                  theme.palette.mode === "dark" ? 900 : 100
                                ],
                            },
                          }}
                        >
                          {isStudent ? null : <DeleteIcon />}
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              color:
                                msg._id === selectedMessageId
                                  ? theme.palette.mode === "dark"
                                    ? colors.grey[100]
                                    : colors.grey[900]
                                  : colors.blueAccent[300],

                              fontWeight:
                                msg._id === selectedMessageId ? 600 : 400,
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                          >
                            {msg.title}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color:
                                msg._id === selectedMessageId
                                  ? theme.palette.mode === "dark"
                                    ? colors.greenAccent[100]
                                    : colors.grey[900]
                                  : colors.blueAccent[300],
                              fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            }}
                          >
                            {msg.content.length > 50
                              ? `${msg.content.substring(0, 50)}...`
                              : msg.content}
                            {msg.time && (
                              <Typography
                                sx={{
                                  color:
                                    msg._id === selectedMessageId
                                      ? theme.palette.mode === "dark"
                                        ? colors.greenAccent[100]
                                        : colors.grey[900]
                                      : colors.blueAccent[300],
                                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                }}
                              >
                                {/* calculate time ago in minutes or hours */}
                                {(() => {
                                  const now = new Date();
                                  const createdAt = new Date(msg.createdAt);
                                  const diff =
                                    now.getTime() - createdAt.getTime();
                                  const minutes = Math.floor(
                                    diff / (1000 * 60),
                                  );
                                  if (minutes < 60) {
                                    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
                                  }
                                  const hours = Math.floor(minutes / 60);
                                  return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
                                })()}
                              </Typography>
                            )}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider
                      sx={{
                        backgroundColor:
                          colors.primary[
                            theme.palette.mode === "dark" ? 600 : 200
                          ],
                      }}
                    />
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              minHeight: { xs: 400, sm: 500, md: 600 },
              backgroundColor:
                colors.primary[theme.palette.mode === "dark" ? 800 : 50] ||
                colors.grey[theme.palette.mode === "dark" ? 800 : 50] ||
                "#ffffff",
              border: `1px solid ${colors.primary[theme.palette.mode === "dark" ? 700 : 200]}`,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "none",
            }}
          >
            {selectedMessage ? (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={1}
                  flexWrap="wrap"
                >
                  <MessageIcon
                    sx={{
                      color:
                        colors.blueAccent[
                          theme.palette.mode === "dark" ? 400 : 600
                        ],
                      fontSize: { xs: "1.5rem", sm: "2rem" },
                    }}
                  />
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      color: colors.blueAccent[300],
                      fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    {selectedMessage.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: colors.blueAccent[300],
                    mb: 2,
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  }}
                >
                  ID: {selectedMessage._id}
                </Typography>
                <Divider
                  sx={{
                    mb: 2,
                    backgroundColor:
                      colors.primary[theme.palette.mode === "dark" ? 600 : 200],
                  }}
                />
                <Typography
                  whiteSpace="pre-wrap"
                  sx={{
                    color: colors.blueAccent[300],
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {selectedMessage.content}
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  color: colors.blueAccent[300],
                  textAlign: "center",
                  mt: 8,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Select a message from the list to see content and delete it.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={createDialogOpen}
        onClose={() => toggleCreateDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor:
              colors.primary[theme.palette.mode === "dark" ? 800 : 50] ||
              colors.grey[theme.palette.mode === "dark" ? 800 : 50] ||
              "#ffffff",
            backgroundImage: "none",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.15)"
                : "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            color:
              theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.primary[500],
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.greenAccent[700]
                : colors.primary[100],
            borderBottom: `1px solid ${colors.primary[theme.palette.mode === "dark" ? 600 : 200]}`,
          }}
        >
          Create a New Message
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor:
              colors.primary[theme.palette.mode === "dark" ? 800 : 50] ||
              colors.grey[theme.palette.mode === "dark" ? 800 : 50] ||
              "#ffffff",
          }}
        >
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            fullWidth
            margin="dense"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor:
                  colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                color: colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                "& fieldset": {
                  borderColor:
                    colors.primary[theme.palette.mode === "dark" ? 600 : 300],
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
                color: colors.grey[theme.palette.mode === "dark" ? 300 : 800],
              },
              // label selected color
              "& .MuiInputLabel-root.Mui-focused": {
                color:
                  colors.primary[theme.palette.mode === "dark" ? 100 : 600],
              },
            }}
          />
          <TextField
            label="Content"
            value={form.content}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, content: e.target.value }))
            }
            fullWidth
            multiline
            rows={5}
            margin="dense"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor:
                  colors.primary[theme.palette.mode === "dark" ? 900 : 100],
                color: colors.grey[theme.palette.mode === "dark" ? 100 : 900],
                "& fieldset": {
                  borderColor:
                    colors.primary[theme.palette.mode === "dark" ? 600 : 300],
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
                color: colors.grey[theme.palette.mode === "dark" ? 300 : 800],
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color:
                  colors.primary[theme.palette.mode === "dark" ? 100 : 600],
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor:
              colors.primary[theme.palette.mode === "dark" ? 700 : 300],
          }}
        >
          <Button
            onClick={() => toggleCreateDialog(false)}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? colors.grey[100]
                  : colors.primary[500],
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
            onClick={handleCreate}
            disabled={loading}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? colors.grey[500]
                  : colors.primary[500],
            }}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        PaperProps={{
          sx: {
            backgroundColor:
              colors.primary[theme.palette.mode === "dark" ? 800 : 50] ||
              colors.grey[theme.palette.mode === "dark" ? 800 : 50] ||
              "#ffffff",
            backgroundImage: "none",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.15)"
                : "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: colors.grey[900],
            backgroundColor:
              colors.primary[theme.palette.mode === "dark" ? 700 : 200],
            borderBottom: `1px solid ${colors.primary[theme.palette.mode === "dark" ? 600 : 200]}`,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor:
              colors.primary[theme.palette.mode === "dark" ? 800 : 50] ||
              colors.grey[theme.palette.mode === "dark" ? 800 : 50] ||
              "#ffffff",
          }}
        >
          <Typography
            sx={{
              color: colors.blueAccent[300],
            }}
          >
            Are you sure you want to delete this message?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor:
              colors.primary[theme.palette.mode === "dark" ? 700 : 200],
          }}
        >
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? colors.grey[100]
                  : colors.primary[500],
              variant: "outlined",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.id)}
            color="error"
            variant="contained"
            sx={{
              backgroundColor:
                colors.redAccent[theme.palette.mode === "dark" ? 600 : 500],
              color: colors.grey[theme.palette.mode === "dark" ? 100 : 200],
              "&:hover": {
                backgroundColor:
                  colors.redAccent[theme.palette.mode === "dark" ? 500 : 600],
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Messages;
