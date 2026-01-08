import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Curalogo from "./assets/10d51647-7fe0-410a-a7b3-21caa144a4a8.png";
const API_BASE = import.meta.env.API_BASE;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setSnack({
        open: true,
        message: "Bitte alle Felder ausfüllen 😭",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "${API_BASE}/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        setSnack({
          open: true,
          message: "✅ Erfolgreich angemeldet!",
          severity: "success",
        });

        // Delay navigation slightly to let user see success message
        setTimeout(() => navigate("/", { replace: true }), 1000);
      } else {
        setSnack({
          open: true,
          message: "❌ " + data.error,
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnack({
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
      {/* ✅ Small Loading Spinner Overlay */}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <img
            src={Curalogo}
            alt="CuraLink Logo"
            style={{
              width: 45,
              height: 45,
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          />
          <Typography variant="h5" sx={{ color: "#1B5E20", fontWeight: 600 }}>
            Anmelden
          </Typography>
        </Box>

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
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Wird geladen..." : "Anmelden"}
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Noch kein Konto?{" "}
          <Link
            to="/register"
            style={{ color: "#1B5E20", textDecoration: "none" }}
          >
            Registrieren
          </Link>
        </Typography>
      </Paper>

      {/* ✅ Snackbar for messages */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
