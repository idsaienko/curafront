import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const API_BASE = import.meta.env.REACT_APP_API_BASE;

const PainChart = ({ resident, setResidents, aiEntry }) => {
  const [painEntries, setPainEntries] = useState(() => {
    if (!resident?.pain) return [];
    return resident.pain.map((p) => {
      if (typeof p === "string") {
        const levelMatch = p.match(/Pain Level:\s*(\d+)/i);
        const bodyMatch = p.match(/Body Part:\s*([^,]+)/i);
        const obsMatch = p.match(/Observation:\s*([^,]+)/i);
        const medMatch = p.match(/Medication:\s*([^,]+)/i);
        const dateMatch = p.match(/Date:\s*([\d-]+)/i);
        const timeMatch = p.match(/Time:\s*([^,]+)/i);

        return {
          painLevel: levelMatch ? Number(levelMatch[1]) : 0,
          bodyPart: bodyMatch ? bodyMatch[1].trim() : "",
          observation: obsMatch ? obsMatch[1].trim() : "",
          medicationGiven: medMatch ? medMatch[1].trim() : "",
          date: dateMatch
            ? dateMatch[1]
            : new Date().toISOString().slice(0, 10),
          time: timeMatch ? timeMatch[1].trim() : "—",
        };
      }
      return p;
    });
  });

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    painLevel: "",
    bodyPart: "",
    observation: "",
    medicationGiven: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // Eingabe ändern
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // In Backend speichern
  const handleSave = async () => {
    if (!formData.painLevel || !formData.bodyPart) {
      setSnackbar({
        open: true,
        message: "Bitte Schmerzstufe und Körperstelle ausfüllen!",
        severity: "warning",
      });
      return;
    }

    const currentTime = new Date().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newEntry = {
      ...formData,
      time: currentTime,
    };

    try {
      setLoading(true);

      const noteText = `Pain Level: ${newEntry.painLevel}/10, Body Part: ${
        newEntry.bodyPart
      }, Observation: ${newEntry.observation || "None"}, Medication: ${
        newEntry.medicationGiven || "None"
      }, Date: ${newEntry.date}, Time: ${newEntry.time}`;

      const res = await fetch(
        `${API_BASE}/api/staff/${resident._id}/category/pain`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: noteText }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Speichern fehlgeschlagen");

      // Erfolg: Eintrag hinzufügen
      setPainEntries((prev) => [...prev, newEntry]);
      if (setResidents) {
        setResidents((prev) =>
          prev.map((r) => (r._id === data.staff._id ? data.staff : r))
        );
      }

      // SCHÖNER SNACKBAR
      setSnackbar({
        open: true,
        message: "Schmerz dokumentiert",
        severity: "success",
      });

      setOpenForm(false);
      setFormData({
        painLevel: "",
        bodyPart: "",
        observation: "",
        medicationGiven: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      console.error("Fehler beim Speichern des Schmerzeintrags:", err);
      setSnackbar({
        open: true,
        message: "Fehler beim Speichern!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // AI-Eintrag automatisch hinzufügen
  useEffect(() => {
    if (!aiEntry) return;

    const entry = {
      painLevel: aiEntry.painLevel || 0,
      bodyPart: aiEntry.bodyPart || "—",
      observation: aiEntry.observation || "—",
      medicationGiven: aiEntry.medicationGiven || "—",
      date: aiEntry.date || new Date().toISOString().slice(0, 10),
      time:
        aiEntry.time ||
        new Date().toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    setPainEntries((prev) => [...prev, entry]);
  }, [aiEntry]);

  return (
    <>
      <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2 }}>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          mb={2}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
            sx={{
              textTransform: "none",
              borderColor: "#2E7D32",
              color: "#2E7D32",
              fontWeight: "bold",
              fontSize: "0.9rem",
              "&:hover": {
                backgroundColor: "#E8F5E9",
                borderColor: "#1B5E20",
              },
            }}
          >
            Neuer Eintrag
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {painEntries.length > 0 ? (
          <Box sx={{ width: "100%", height: 150, mb: 3 }}>
            <ResponsiveContainer>
              <LineChart data={painEntries}>
                <XAxis dataKey="time" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="painLevel"
                  stroke="#2E7D32"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Noch keine Schmerzdaten vorhanden.
          </Typography>
        )}

        {painEntries.map((entry, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              py: 1,
              fontSize: "0.9rem",
            }}
          >
            <Box sx={{ width: "100px", fontWeight: "bold" }}>{entry.time}</Box>
            <Box sx={{ flex: 1 }}>
              Schmerz {entry.painLevel}/10, {entry.bodyPart}
              {entry.observation && `, ${entry.observation}`}
            </Box>
            <Box sx={{ width: "200px", textAlign: "right", color: "#555" }}>
              {entry.medicationGiven || "Keine Medikation verabreicht"}
            </Box>
          </Box>
        ))}

        <Dialog
          open={openForm}
          onClose={() => setOpenForm(false)}
          PaperProps={{ sx: { borderRadius: "16px", width: "420px", p: 1 } }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            pt={1}
          >
            <DialogTitle sx={{ fontWeight: "bold", color: "#2E7D32", p: 0 }}>
              Schmerzeintrag hinzufügen
            </DialogTitle>
            <IconButton onClick={() => setOpenForm(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Schmerzstufe (0–10)"
                  name="painLevel"
                  value={formData.painLevel}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 10 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Körperstelle"
                  name="bodyPart"
                  value={formData.bodyPart}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Beobachtung"
                  name="observation"
                  value={formData.observation}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Verabreichte Medikation / Wirkung"
                  name="medicationGiven"
                  value={formData.medicationGiven}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Datum"
                  name="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={handleSave}
                  disabled={loading}
                  sx={{ textTransform: "none", fontWeight: "bold", mt: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Eintrag speichern"
                  )}
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>

      {/* SCHÖNER SNACKBAR – wie überall */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PainChart;
