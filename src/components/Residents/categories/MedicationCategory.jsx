import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const MedicationCategory = ({ resident, onAddResident }) => (
  <Box>
    <Button
      variant="outlined"
      startIcon={<AddIcon sx={{ color: "darkgreen" }} />}
      onClick={onAddResident}
      sx={{
        textTransform: "none",
        borderColor: "#ccc",
        color: "#000",
        fontWeight: "bold",
        fontSize: "0.9rem",
        mb: 2,
      }}
    >
      Neuer Bewohner
    </Button>

    <Typography variant="h6" fontWeight="bold" sx={{ color: "#2E7D32", mb: 1 }}>
      Medikamentennotizen
    </Typography>

    {resident.medication?.length ? (
      resident.medication.map((note, i) => (
        <Typography key={i} sx={{ mb: 1 }}>
          • {note}
        </Typography>
      ))
    ) : (
      <Typography>Keine Medikamentennotizen vorhanden.</Typography>
    )}
  </Box>
);

export default MedicationCategory;
