import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const API_BASE = import.meta.env.REACT_APP_API_BASE;

const AddResidentDialog = ({ open, onClose, setResidents }) => {
  const [newResident, setNewResident] = useState({
    name: "",
    pain: "",
    nutrition: "",
    mobility: "",
    elimination: "",
    medication: "",
    urination: "",
    general: "",
    room: "",
    bedNumber: "",
    careLevel: "",
    photo: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // ✅ Photo upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewResident((prev) => ({ ...prev, photo: imageUrl }));
      setSelectedFile(file);
    }
  };

  // ✅ Save resident
  const handleSave = async () => {
    const { name } = newResident;
    if (!name.trim()) {
      setSnackbar({
        open: true,
        message: "Bitte den Namen eingeben!",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newResident.name);
    formData.append("room", newResident.room);
    formData.append("bedNumber", newResident.bedNumber);
    formData.append("careLevel", newResident.careLevel);
    formData.append("pain", newResident.pain);
    formData.append("nutrition", newResident.nutrition);
    formData.append("medication", newResident.medication);
    formData.append("urination", newResident.urination);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/staff`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setSnackbar({
          open: true,
          message: data.error || "Fehler beim Hinzufügen",
          severity: "error",
        });
        return;
      }

      setResidents((prev) => [...prev, data.staff]);

      setSnackbar({
        open: true,
        message: "✅ Bewohner erfolgreich hinzugefügt!",
        severity: "success",
      });

      // ✅ Reset and close after success
      setTimeout(() => {
        onClose();
        setNewResident({
          name: "",
          pain: "",
          nutrition: "",
          mobility: "",
          elimination: "",
          medication: "",
          urination: "",
          general: "",
          room: "",
          bedNumber: "",
          careLevel: "",
          photo: null,
        });
        setSelectedFile(null);
      }, 1200);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setSnackbar({
        open: true,
        message: "Etwas ist schiefgelaufen 😭",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "16px", maxWidth: 420, width: "90%", p: 3 },
      }}
    >
      {/* ✅ Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ✅ Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            borderRadius: "16px",
          }}
        >
          <CircularProgress size={35} sx={{ color: "#1B5E20" }} />
        </Box>
      )}

      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            color: "#888",
            "&:hover": { color: "#d32f2f" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            mt: 1,
            fontWeight: "bold",
            textAlign: "center",
            color: "#2E7D32",
          }}
        >
          ➕ Neuen Bewohner hinzufügen
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="Vollständiger Name"
          value={newResident.name}
          onChange={(e) =>
            setNewResident({ ...newResident, name: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={1.5} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Zimmer"
            value={newResident.room}
            onChange={(e) =>
              setNewResident({ ...newResident, room: e.target.value })
            }
          />
          <TextField
            fullWidth
            size="small"
            label="Bett"
            value={newResident.bedNumber}
            onChange={(e) =>
              setNewResident({ ...newResident, bedNumber: e.target.value })
            }
          />
        </Box>

        <TextField
          fullWidth
          size="small"
          label="Pflegestufe"
          value={newResident.careLevel}
          onChange={(e) =>
            setNewResident({ ...newResident, careLevel: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Schmerz-Notizen"
          value={newResident.pain}
          onChange={(e) =>
            setNewResident({ ...newResident, pain: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Ernährungs-Notizen"
          value={newResident.nutrition}
          onChange={(e) =>
            setNewResident({ ...newResident, nutrition: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Medikations-Notizen"
          value={newResident.medication}
          onChange={(e) =>
            setNewResident({ ...newResident, medication: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Harn-Notizen"
          value={newResident.urination}
          onChange={(e) =>
            setNewResident({ ...newResident, urination: e.target.value })
          }
          sx={{ mb: 1.5 }}
        />

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Button
            variant="outlined"
            component="label"
            sx={{ color: "#2E7D32" }}
          >
            Foto hochladen
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>

          {newResident.photo && (
            <Avatar
              src={newResident.photo}
              sx={{ width: 50, height: 50, border: "2px solid #2E7D32" }}
            />
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleSave}
          disabled={loading}
          sx={{
            py: 0.9,
            fontWeight: "bold",
            fontSize: "0.95rem",
            textTransform: "none",
          }}
        >
          💾 Bewohner speichern
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddResidentDialog;
