import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
const API_BASE = import.meta.env.VITE_API_BASE;

const MobilityCategory = ({ resident, setResidents }) => {
  const [entries, setEntries] = useState(() => {
    if (!resident?.mobility) return [];
    return resident.mobility.map((m) => {
      if (typeof m === "string") {
        const time = m.match(/Time:\s*([0-9:apmAPM\s]+)/i)?.[1]?.trim() || "";
        const activity = m.match(/Activity:\s*([^,]+)/i)?.[1]?.trim() || "";
        const details = m.match(/Details:\s*([^,]+)/i)?.[1]?.trim() || "";
        const support = m.match(/Support:\s*([^,]+)/i)?.[1]?.trim() || "";
        return { time, activity, details, support };
      }
      return m;
    });
  });

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    activity: "",
    details: "",
    support: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatTimeWithUhr = (t) => {
    if (!t) return "—";
    return t.toLowerCase().includes("uhr") ? t : `${t} Uhr`;
  };

  const handleSave = async () => {
    if (!formData.activity.trim()) {
      setSnackbar({ open: true, message: "Bitte Aktivität eingeben!", severity: "warning" });
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const entry = {
      time: timeStr,
      activity: formData.activity.trim(),
      details: formData.details.trim() || "—",
      support: formData.support.trim() || "—",
    };

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/staff/${resident._id}/category/mobility`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: entry }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");

      // Erfolg
      setEntries((prev) => [...prev, entry]);
      if (setResidents) {
        setResidents((prev) =>
          prev.map((r) => (r._id === data.staff._id ? data.staff : r))
        );
      }

      // SCHÖNER SNACKBAR
      setSnackbar({
        open: true,
        message: "Mobilität dokumentiert",
        severity: "success",
      });

      setOpenForm(false);
      setFormData({ activity: "", details: "", support: "" });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      setSnackbar({
        open: true,
        message: "Fehler beim Speichern!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (value) => {
    if (!value) return "—";

    // already short HH:MM format
    if (/^\d{2}:\d{2}$/.test(value)) return value;

    // ISO string case -> convert
    try {
      const d = new Date(value);
      return d.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2, boxShadow: 1 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<AddIcon sx={{ color: "green" }} />}
            onClick={() => setOpenForm(true)}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderColor: "lightgray",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Neuer Eintrag
          </Button>
        </Box>

        {/* Zeitachse */}
        <Box sx={{ position: "relative", pl: "10px" }}>
          {entries.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                left: "112px",
                top: 0,
                bottom: 0,
                width: "2px",
                backgroundColor: "#2E7D32",
                opacity: 0.3,
              }}
            />
          )}

          {entries.length > 0 ? (
            entries.slice().reverse().map((e, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "90px 20px 1fr 200px",
                  alignItems: "center",
                  mb: 3,
                  position: "relative",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: "0.95rem",
                    pr: 1,
                  }}
                >
                  {formatTime(e.time)}
                </Typography>

                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#2E7D32",
                    position: "relative",
                    left: "6px",
                    zIndex: 2,
                    boxShadow: "0 0 0 4px rgba(46, 125, 50, 0.2)",
                  }}
                />

                <Box>
                  <Typography sx={{ fontWeight: "bold", color: "#2E7D32" }}>
                    {e.activity}
                  </Typography>
                  {e.details && (
                    <Typography sx={{ marginLeft: "10px", fontSize: "0.9rem", color: "#555" }}>
                      {e.details}
                    </Typography>
                  )}
                </Box>

                <Typography
                  sx={{
                    textAlign: "right",
                    fontSize: "0.9rem",
                    color: "#666",
                    pr: 2,
                  }}
                >
                  {e.support || "—"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ ml: 2 }}>
              Noch keine Mobilitätseinträge vorhanden.
            </Typography>
          )}
        </Box>

        {/* Dialog */}
        <Dialog
          open={openForm}
          onClose={() => !loading && setOpenForm(false)}
          PaperProps={{
            sx: { borderRadius: "16px", width: "420px", maxWidth: "95vw" },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={2}>
            <DialogTitle sx={{ fontWeight: "bold", color: "#2E7D32", p: 0 }}>
              Mobilitätseintrag hinzufügen
            </DialogTitle>
            <IconButton onClick={() => setOpenForm(false)} disabled={loading} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent dividers sx={{ pb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Aktivität (z. B. Transfer Bett → Stuhl)"
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Details (optional)"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Unterstützung / Bemerkungen"
                  name="support"
                  value={formData.support}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  onClick={handleSave}
                  disabled={loading}
                  sx={{ mt: 2, py: 1.5, fontWeight: "bold", textTransform: "none" }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Eintrag speichern"}
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>

      {/* EINHEITLICHER SNACKBAR */}
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
          sx={{ width: "100%", fontWeight: "bold", fontSize: "1rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MobilityCategory;