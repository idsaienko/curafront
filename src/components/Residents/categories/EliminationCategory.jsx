import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const EliminationCategory = ({ resident, setResidents }) => {
  const [entries, setEntries] = useState(resident?.elimination || []);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    interval: "",
    amount: "",
    consistency: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const now = new Date();
    const entryTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const eventTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDate = `${entryTime} ${eventTime}`;

    const newEntry = {
      date: formattedDate,
      interval: formData.interval.trim() || "—",
      amount: formData.amount.trim() || "—",
      consistency: formData.consistency.trim() || "—",
    };

    try {
      setLoading(true);
      const res = await fetch(
        `https://cura-backend-augp-m4x644103-kainat-s-projects-f1e94478.vercel.app/api/staff/${resident._id}/category/elimination`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entry: newEntry }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");

      // Update Einträge
      setEntries(data.staff.elimination);
      if (setResidents) {
        setResidents((prev) =>
          prev.map((r) => (r._id === data.staff._id ? data.staff : r))
        );
      }

      // Erfolgsnachricht – wie bei der KI!
      setSnackbar({
        open: true,
        message: "Ausscheidung hinzugefügt",
        severity: "success",
      });

      setOpenForm(false);
      setFormData({ interval: "", amount: "", consistency: "" });
    } catch (err) {
      console.error("Fehler:", err);
      setSnackbar({
        open: true,
        message: "Fehler beim Speichern!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        overflowX: "auto",
        position: "relative",
        boxShadow: 1,
      }}
    >
      {/* Lade-Overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            borderRadius: 2,
          }}
        >
          <CircularProgress size={50} thickness={5} sx={{ color: "#2E7D32" }} />
        </Box>
      )}

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={1}
      >
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
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            px: { xs: 1.5, sm: 2 },
            whiteSpace: "nowrap",
          }}
        >
          Neuer Eintrag
        </Button>

        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            textAlign: "right",
            flexGrow: 1,
          }}
        >
          Ausscheidung – Letzte Einträge
        </Typography>
      </Box>

      {/* Tabelle */}
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", borderRadius: 2 }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                Datum/Uhrzeit
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                Abstand
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                Menge
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                Konsistenz
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? (
              entries
                .slice()
                .reverse()
                .map((e, i) => (
                  <TableRow key={i}>
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {e.date || "—"}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {e.interval || "—"}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {e.amount || "—"}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                    >
                      {e.consistency || "—"}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ color: "gray", py: 3 }}
                >
                  Keine Einträge vorhanden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog
        open={openForm}
        onClose={() => !loading && setOpenForm(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            width: { xs: "90vw", sm: "420px" },
            maxWidth: "95vw",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={2}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "#2E7D32", p: 0 }}>
            Neuer Ausscheidungseintrag
          </DialogTitle>
          <IconButton
            onClick={() => setOpenForm(false)}
            disabled={loading}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Abstand (z. B. heute Morgen, 2x)"
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                fullWidth
                size="small"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Menge (viel / normal / wenig)"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                size="small"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Konsistenz (fest / weich / flüssig)"
                name="consistency"
                value={formData.consistency}
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
                onClick={handleSave}
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
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

      {/* Snackbar – wie bei der KI! */}
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
    </Box>
  );
};

export default EliminationCategory;
