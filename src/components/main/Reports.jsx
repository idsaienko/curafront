import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Pagination,
} from "@mui/material";

const reports = [
  {
    date: "15. Mai 2024",
    time: "10:30 Uhr",
    category: "Pflegebereich",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 12",
    details: "Bewohnerin kooperativ",
    author: "Peter M.",
  },
  {
    date: "15. Mai 2024",
    time: "08:00 Uhr",
    category: "Vitalwerte",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 12",
    details: "Blutdruck: 125/80",
    author: "Lisa K.",
  },
  {
    date: "15. Mai 2024",
    time: "18:00 Uhr",
    category: "Erregnbericht",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 5",
    details: "Arzt informiert",
    author: "Peter M.",
  },
  {
    date: "14. Mai 2024",
    time: "09:00 Uhr",
    category: "Vitalwerte",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 12",
    details: "Puls gut",
    author: "Lisa K.",
  },
  {
    date: "14. Mai 2024",
    time: "17:00 Uhr",
    category: "Pflegebericht",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 12",
    details: "Ruhig",
    author: "Peter M.",
  },
  {
    date: "13. Mai 2024",
    time: "12:15 Uhr",
    category: "Pflegebereich",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 10",
    details: "Hilfe beim Umlagern",
    author: "Peter M.",
  },
  {
    date: "13. Mai 2024",
    time: "07:45 Uhr",
    category: "Vitalwerte",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 10",
    details: "Blutzucker 98 mg/dl",
    author: "Lisa K.",
  },
  {
    date: "12. Mai 2024",
    time: "14:30 Uhr",
    category: "Erregnbericht",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 8",
    details: "Unruhe bemerkt",
    author: "Peter M.",
  },
  {
    date: "12. Mai 2024",
    time: "16:00 Uhr",
    category: "Vitalwerte",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 8",
    details: "Sättigung 97%",
    author: "Lisa K.",
  },
  {
    date: "11. Mai 2024",
    time: "19:20 Uhr",
    category: "Pflegebericht",
    resident: "Frau Mariberrät Mustermann",
    room: "Zimmer 12",
    details: "Abendroutine abgeschlossen",
    author: "Peter M.",
  },
];

const Reports = () => {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);

  const recordsPerPage = 3;
  const totalPages = Math.ceil(reports.length / recordsPerPage);
  const currentRecords = reports.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

  return (
    <Box p={3} height="100%" display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Allgemeine Berichte
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mb: 3 }}
        textColor="inherit"
        TabIndicatorProps={{ sx: { backgroundColor: "#1B5E20" } }}
      >
        <Tab label="Täglich" sx={{ color: "#1B5E20", fontWeight: "bold" }} />
        <Tab
          label="Wöchentliche"
          sx={{ color: "#1B5E20", fontWeight: "bold" }}
        />
        <Tab label="Ergebnisse" sx={{ color: "#1B5E20", fontWeight: "bold" }} />
      </Tabs>

      <Typography variant="body2" color="text.secondary">
        Zeitraum: Letzte 180 Tage
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Berichtstyp: Vitalwerte, Medikamentengabe...
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Scrollable Box */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
          maxHeight: "390px",
        }}
      >
        {currentRecords.map((item, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: "12px",
              borderColor: "#dedbdbff", // lighter gray
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // subtle shadow
            }}
          >
            <CardContent>
              <Typography fontWeight="bold" color="#1B5E20">
                {item.date}, {item.time} – {item.category}
              </Typography>
              <Typography variant="body2" mt={1}>
                Bewohner: <strong>{item.resident}</strong>, {item.room}
              </Typography>
              <Typography variant="body2" mt={1}>
                {item.details}
              </Typography>
              <Typography variant="caption" display="block" mt={2}>
                Text: {item.author}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Pagination inside scroll */}
        <Box display="flex" justifyContent="center" py={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, p) => setPage(p)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#1B5E20",
                borderColor: "#1B5E20",
              },
              "& .Mui-selected": {
                backgroundColor: "#1B5E20 !important",
                color: "#fff !important",
              },
            }}
            shape="rounded"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
