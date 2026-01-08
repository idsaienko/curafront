import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.API_BASE;

const roles = [
  { label: "Pflegekraft", value: "nurse" },
  { label: "Arzt", value: "doctor" },
  { label: "Administrator", value: "admin" },
  { label: "Andere", value: "others" },
];

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      setSnackbar({
        open: true,
        message: "Bitte alle Felder ausfüllen 😭",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "${API_BASE}/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSnackbar({
          open: true,
          message: "✅ Erfolgreich registriert!",
          severity: "success",
        });
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        setSnackbar({
          open: true,
          message: "❌ " + (data.error || "Fehler bei der Registrierung"),
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #C8E6C9, #A5D6A7)",
        position: "relative",
      }}
    >
      {/* ✅ Loading Overlay */}
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
          }}
        >
          <CircularProgress size={35} thickness={4} sx={{ color: "#1B5E20" }} />
        </Box>
      )}

      {/* ✅ Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Paper
        sx={{
          p: 4,
          width: 400,
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, color: "#1B5E20", fontWeight: 600 }}
        >
          🩺 Konto erstellen
        </Typography>

        <TextField
          label="Vollständiger Name"
          fullWidth
          sx={{ mb: 2 }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="E-Mail"
          fullWidth
          sx={{ mb: 2 }}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          label="Passwort"
          fullWidth
          sx={{ mb: 2 }}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Autocomplete
          options={roles}
          getOptionLabel={(option) => option.label}
          onChange={(e, value) =>
            setForm({ ...form, role: value?.value || "" })
          }
          renderInput={(params) => (
            <TextField {...params} label="Rolle auswählen" sx={{ mb: 2 }} />
          )}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#1B5E20",
            "&:hover": { backgroundColor: "#2E7D32" },
            color: "#fff",
            py: 1.2,
            fontSize: "1rem",
            textTransform: "none",
          }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Wird geladen..." : "Registrieren"}
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Bereits ein Konto?{" "}
          <Link
            to="/login"
            style={{ color: "#1B5E20", textDecoration: "none" }}
          >
            Anmelden
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
