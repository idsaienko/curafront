import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import AppleIcon from "@mui/icons-material/Apple";
import WineBarIcon from "@mui/icons-material/WineBar";
const API_BASE = import.meta.env.REACT_APP_API_BASE;

const NutritionCategory = ({ resident, setResidents }) => {
  const [entries, setEntries] = useState(() => {
    if (!resident?.nutrition) return [];
    
    return resident.nutrition.map((n) => {
      // Already an object → return as-is
      if (typeof n === "object" && n !== null) {
        return n;
      }

      // String that might be JSON
      if (typeof n === "string") {
        try {
          return JSON.parse(n);
        } catch {
          return {
            mealType: n,
            amount: "—",
            time: "—",
            notes: "—",
          };
        }
      }

      // Fallback
      return {
        mealType: "—",
        amount: "—",
        time: "—",
        notes: "—",
      };
    });
  });

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    mealType: "",
    amount: "",
    notes: "",
  });

  // Stilregeln pro Mahlzeitentyp
  const getMealStyle = (type = "") => {
    const lower = type?.toLowerCase?.() || "";

    if (lower.includes("früh") || lower.includes("break"))
      return { icon: <LocalCafeIcon />, bg: "#E8F5E9", border: "#A5D6A7", color: "darkgreen", dark: false };

    if (lower.includes("zwischen") || lower.includes("snack"))
      return { icon: <AppleIcon />, bg: "#C8E6C9", border: "#81C784", color: "#1B5E20", dark: false };

    if (lower.includes("mittag") || lower.includes("lunch"))
      return { icon: <LunchDiningIcon />, bg: "#A5D6A7", border: "#66BB6A", color: "black", dark: false };

    if (lower.includes("abend") || lower.includes("dinner"))
      return { icon: <WineBarIcon />, bg: "#388E3C", border: "#1B5E20", color: "white", dark: true };

    return { icon: <LunchDiningIcon />, bg: "#E8F5E9", border: "#A5D6A7", color: "#2E7D32", dark: false };
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!formData.mealType.trim()) {
      setSnackbar({ open: true, message: "Bitte Mahlzeit eingeben!", severity: "warning" });
      return;
    }

    const entry = {
      mealType: formData.mealType.trim(),
      amount: formData.amount.trim() || "—",
      time: getCurrentTime(),
      notes: formData.notes.trim() || "—",
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/staff/${resident._id}/category/nutrition`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: entry }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");

      // Erfolg: Eintrag hinzufügen
      setEntries((prev) => [...prev, entry]);
      setResidents?.((prev) =>
        prev.map((r) => (r._id === data.staff._id ? data.staff : r))
      );

      // SCHÖNER SNACKBAR
      setSnackbar({
        open: true,
        message: "Ernährung gespeichert",
        severity: "success",
      });

      setOpenForm(false);
      setFormData({ mealType: "", amount: "", notes: "" });
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
      <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: 2 }}>
        {/* Header */}
        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
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

        {/* Kartenanzeige */}
        <Grid container spacing={2}>
          {entries.length > 0 ? (
            entries.map((e, i) => {
              const style = getMealStyle(e?.mealType);
              return (
                <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      width: 320,
                      border: `2px solid ${style.border}`,
                      borderRadius: "10px",
                      overflow: "hidden",
                      height: 150,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: style.bg,
                        color: style.color,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        {style.icon}
                        <Typography sx={{ fontWeight: "bold", fontSize: "1rem", color: style.color }}>
                          {e.mealType}
                        </Typography>
                        <Typography sx={{ ml: "auto", fontWeight: "bold", color: style.color }}>
                          {formatTime(e.time)} Uhr
                        </Typography>
                      </Box>
                      <Typography sx={{ mt: 0.5, ml: 4.5, fontSize: "0.9rem", color: style.dark ? "white" : "black" }}>
                        {e.amount}
                      </Typography>
                    </Box>
                    <Box sx={{ backgroundColor: "#fff", p: 2 }}>
                      <Typography sx={{ color: "black" }}>
                        {e.notes || "—"}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography color="text.secondary" sx={{ ml: 2 }}>
              Keine Ernährungsdaten vorhanden.
            </Typography>
          )}
        </Grid>

        {/* Dialog */}
        <Dialog
          open={openForm}
          onClose={() => !loading && setOpenForm(false)}
          PaperProps={{ sx: { borderRadius: "16px", width: "420px", maxWidth: "95vw" } }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
            <DialogTitle sx={{ fontWeight: "bold", color: "#2E7D32", p: 0 }}>
              Neuer Ernährungseintrag
            </DialogTitle>
            <IconButton onClick={() => setOpenForm(false)} disabled={loading} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent dividers>
            <TextField
              label="Mahlzeit (z. B. Frühstück, Mittagessen)"
              name="mealType"
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              disabled={loading}
            />
            <TextField
              label="Menge (z. B. Ganz, Halb, Wenig)"
              name="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              disabled={loading}
            />
            <TextField
              label="Notizen (optional)"
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleSave}
              disabled={loading}
              sx={{ textTransform: "none", fontWeight: "bold", py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Eintrag speichern"}
            </Button>
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

export default NutritionCategory;