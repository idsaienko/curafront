import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import AddResidentDialog from "./AddResidentDialog";
import ResidentProfileDialog from "./ResidentProfileDialog";
import ResidentsFooter from "./ResidentsFooter";
import { analyzeNote } from "../services/llmApi";
const REACT_APP_API_BASE = import.meta.env.VITE_API_BASE;

const ResidentsProfiles = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [textNote, setTextNote] = useState("");
  const [setVoiceText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

/*  const handleSnackbar = (msg, severity = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
*/
  // Load residents
  useEffect(() => {
    fetch(
      `http://${REACT_APP_API_BASE}/api/staff`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setResidents(data);
        else if (Array.isArray(data.staff)) setResidents(data.staff);
        else setResidents([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Voice Note
  const handleVoiceNote = () => {
    setActiveButton("voice");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Spracherkennung nicht unterstützt");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSendToAI(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      alert("Sprachfehler: " + e.error);
    };
  };

  const capitalizeFirst = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const btnStyle = (active) => ({
    bgcolor: active ? "success.main" : "white",
    color: active ? "white" : "black",
    width: 180,
    height: 100,
    borderRadius: "14px",
    boxShadow: 2,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": { bgcolor: active ? "success.dark" : "#f5f5f5" },
  });

const handleSendToAI = async () => {
  if (!textNote.trim() || !selectedResident?._id) {
    alert("Bitte zuerst einen Bewohner auswählen.");
    return;
  }

  try {
    const result = await analyzeNote(
      textNote,
      selectedResident._id
    );

    setAiResponse(JSON.stringify(result, null, 2));
    setTextNote("");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};




return (
    <Box sx={{ padding: "20px", maxWidth: "1000px", mx: "auto" }}>
      {/* Top Controls */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        mb={3}
      >
        <Box display="flex" justifyContent="center" gap={3}>
          <Button
            onClick={handleVoiceNote}
            sx={btnStyle(activeButton === "voice")}
          >
            <MicIcon sx={{ fontSize: 45 }} /> Sprachnotiz
          </Button>
          <Button
            onClick={() => setActiveButton("text")}
            sx={btnStyle(activeButton === "text")}
          >
            <ArticleIcon sx={{ fontSize: 45 }} /> Textnotiz
          </Button>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ color: "darkgreen" }} />}
          onClick={() => setShowAddForm(true)}
          sx={{
            mt: 1,
            px: 2.2,
            py: 0.6,
            borderColor: "#ccc",
            color: "#000",
            borderRadius: "8px",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Bewohner hinzufügen
        </Button>
      </Box>

      {/* Text Note Input */}
      {activeButton === "text" && (
        <Box
          mt={3}
          p={3}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            background: "#fafafa",
            position: "relative",
            boxShadow: 1,
          }}
        >
          <IconButton
            onClick={() => {
              setActiveButton(null);
              setTextNote("");
              setAiResponse("");
            }}
            sx={{ position: "absolute", top: 8, right: 8, color: "grey" }}
          >
            <CloseIcon />
          </IconButton>

          <Typography gutterBottom fontWeight="bold" color="#2E7D32">
            Textnotiz eingeben
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={textNote}
            onChange={(e) => setTextNote(e.target.value)}
            placeholder="z.B. Frau Müller hat Mittagessen nur halb gegessen, klagt über Rückenschmerzen 7/10, wurde Ibuprofen gegeben..."
            sx={{ mb: 2 }}
          />
          {console.log("aiLoading:", aiLoading, "textNote:", textNote)}

          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() =>{
              console.log("🟢 Button clicked");
              handleSendToAI()}}
            disabled={aiLoading || !textNote.trim()}
            sx={{ minWidth: 180 }} // optional: schönerer Look
          >
            {aiLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "An KI senden"
            )}
          </Button>

          {/* AI Response Box */}
          {aiResponse && (
            <Box
              mt={3}
              p={3}
              sx={{
                background: "#f0fff0",
                border: "2px solid #4caf50",
                borderRadius: 3,
                position: "relative",
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  setAiResponse("");
                  setActiveButton(null);
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography fontWeight="bold" color="#2E7D32" gutterBottom>
                KI hat verstanden & gespeichert:
              </Typography>
              <Typography
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: "0.95rem",
                }}
              >
                {aiResponse}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <AddResidentDialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        setResidents={setResidents}
      />

      {/* Residents List */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress color="success" size={60} />
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          mt={4}
        >
          {residents.map((r) => (
            <Card
              key={r._id}
              onClick={() => {
                setSelectedResident(r);
                setOpenProfile(true);
              }}
              sx={{
                width: "100%",
                maxWidth: 460,
                cursor: "pointer",
                borderRadius: 3,
                boxShadow: 4,
                "&:hover": { boxShadow: 8 },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {capitalizeFirst(r.name)}
                </Typography>
                <Typography color="text.secondary">
                  Zimmer: {r.room || "–"} • Bett: {r.bedNumber || "–"}
                </Typography>
                <Typography color="text.secondary">
                  Pflegegrad: {r.careLevel || "–"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <ResidentProfileDialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        resident={selectedResident}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />

      <ResidentsFooter />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResidentsProfiles;
