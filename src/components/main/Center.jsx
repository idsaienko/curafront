import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
  TextField,
  CircularProgress,
  Modal,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ArticleIcon from "@mui/icons-material/Article";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import { analyzeNote } from "../services/llmApi";
const API_BASE = import.meta.env.API_BASE;

const Center = () => {
  const [setStaffList] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [setVoiceText] = useState("");
  const [textNote, setTextNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [setAiResponse] = useState("");

  const [newStaff, setNewStaff] = useState({
    name: "",
    medication: "",
    urination: "",
    room: "",
    careLevel: "",
  });

  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  const capitalizeFirst = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const buttonStyle = (isActive) => ({
    bgcolor: isActive ? "success.main" : "white",
    color: isActive ? "white" : "black",
    fontSize: "1.2rem",
    width: "200px",
    height: "140px",
    borderRadius: "16px",
    boxShadow: 3,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textTransform: "capitalize",
    "&:hover": { bgcolor: isActive ? "success.main" : "white" },
  });

  // 📦 Fetch all staff
  useEffect(() => {
    fetch(
      `${API_BASE}/api/staff`
    )
      .then((res) => res.json())
      .then((data) => setStaffList(data.staff || data))
      .catch((err) => console.error("Fetch staff error:", err));
  }, []);

  // 🎙️ Voice Note Handler
  const handleVoiceNote = () => {
    setActiveButton("voice");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      await handleSendToAI(transcript);
    };

    recognition.onerror = (event) => {
      alert("Speech error: " + event.error);
    };
  };

  // 🧠 Send Note (Text/Voice) to AI
  const handleSendToAI = async () => {
    if (!textNote.trim()) return;

    setLoading(true);
    setAiResponse("");

    try {
      const result = await analyzeNote(textNote);

      setAiResponse(JSON.stringify(result, null, 2));
      setTextNote("");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze report");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add Staff
  const handleAddStaff = () => {
    setActiveButton("add");
    setOpenModal(true);
  };

  const handleSaveStaff = async () => {
    const { name } = newStaff;
    if (!name.trim()) return alert("Enter staff name!");

    setAdding(true);
    try {
      const res = await fetch(
        "${API_BASE}/api/staff",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStaff),
        }
      );

      if (!res.ok) throw new Error("Failed to add staff");
      const data = await res.json();

      setStaffList((prev) => [...prev, data.staff || data]);
      setOpenModal(false);
      setNewStaff({
        name: "",
        medication: "",
        urination: "",
        room: "",
        careLevel: "",
      });
    } catch (err) {
      console.error("Add error:", err);
      alert("Error adding staff.");
    } finally {
      setAdding(false);
    }
  };

  // ✏️ Edit staff
  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setNewStaff(staff);
    setEditModal(true);
  };

  const handleUpdateStaff = async () => {
    setUpdating(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/staff/${selectedStaff._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStaff),
        }
      );

      const data = await res.json();
      setStaffList((prev) =>
        prev.map((s) => (s._id === selectedStaff._id ? data.staff || data : s))
      );
      setEditModal(false);
      setSelectedStaff(null);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fefefe", minHeight: "100vh" }}>
      {/* Main Buttons */}
      <Box display="flex" justifyContent="center" gap={4} mb={3}>
        <Box display="flex" justifyContent="center" gap={4} mb={3}>
        {/* 🎙 Voice button */}
          <Button
            component="label"
            htmlFor="voice-upload"
            sx={buttonStyle(activeButton === "voice")}
          >
            <MicIcon sx={{ fontSize: 60 }} />
            Voice Note
          </Button>

          {/* 📝 Text button */}
          <Button
            onClick={() => setActiveButton("text")}
            sx={buttonStyle(activeButton === "text")}
          >
            <ArticleIcon sx={{ fontSize: 60 }} />
            Text Note
          </Button>
        </Box>
      </Box>

      {/* <Divider /> */}

      {/* ✍️ Text Note Input */}
      {activeButton === "text" && (
        <Box
          mt={3}
          p={3}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fafafa",
          }}
        >
          <Typography>Enter a note for staff:</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={textNote}
            onChange={(e) => setTextNote(e.target.value)}
            placeholder="Type your note..."
          />
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => handleSendToAI()}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
          </Button>
        </Box>
      )}

      {/* Staff Cards */}
      {/* <Grid container spacing={2} mt={3} mb={4}>
        {staffList.length > 0 ? (
          staffList.map((staff) => (
            <Grid item xs={12} sm={6} md={4} key={staff._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    {capitalizeFirst(staff.name)}
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Medication"
                        secondary={staff.medication || "empty"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Urination"
                        secondary={staff.urination || "empty"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Room"
                        secondary={staff.room || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Care Level"
                        secondary={staff.careLevel || "N/A"}
                      />
                    </ListItem>
                  </List>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditStaff(staff)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ mt: 4, mx: "auto" }}>No staff found.</Typography>
        )}
      </Grid> */}

      {/* Add/Edit Modal */}
      <Modal
        open={openModal || editModal}
        onClose={() => {
          setOpenModal(false);
          setEditModal(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 340,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            mb={2}
            color="success.main"
          >
            {openModal ? "Add New Staff" : "Edit Staff"}
          </Typography>
          {["name", "medication", "urination", "room", "careLevel"].map(
            (field) => (
              <TextField
                key={field}
                label={capitalizeFirst(field)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                value={newStaff[field]}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, [field]: e.target.value })
                }
              />
            )
          )}
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={openModal ? handleSaveStaff : handleUpdateStaff}
            disabled={adding || updating}
          >
            {adding || updating ? (
              <CircularProgress size={22} color="inherit" />
            ) : openModal ? (
              "Save"
            ) : (
              "Update"
            )}
          </Button>
        </Box>
      </Modal>
      <input
        type="file"
        accept="audio/*"
        hidden
        id="voice-upload"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          setLoading(true);
          try {
            const res = await handleVoiceNote(file);
            setAiResponse(JSON.stringify(res, null, 2));
          } catch (err) {
            alert("Voice analysis failed");
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
};

export default Center;
