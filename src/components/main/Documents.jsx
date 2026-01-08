import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Avatar,
  IconButton,
} from "@mui/material";
import { Upload, Download } from "@mui/icons-material";

const documentsData = [
  {
    name: "Patientenverfügung_Maria_M.pdf",
    type: "PDF",
    date: "12.03.2023",
    size: "450 KB",
    iconColor: "#D32F2F", // Red for PDF
  },
  {
    name: "Ärztliches_Attest_Dr_Müller.pdf",
    type: "PDF",
    date: "16.05.2024",
    size: "620 KB",
    iconColor: "#D32F2F",
  },
  {
    name: "Pflegevertrag_Zi12.pdf",
    type: "PDF",
    date: "01.05.2024",
    size: "1.1 MB",
    iconColor: "#D32F2F",
  },
  {
    name: "Medikamentenplan_Aktuell.jpg",
    type: "IMG",
    date: "10.02.2023",
    size: "890 KB",
    iconColor: "#1B5E20", // Green for Image/Excel style
  },
];

const Documents = () => {
  const [page, setPage] = useState(1);
  const recordsPerPage = 3;

  const totalPages = Math.ceil(documentsData.length / recordsPerPage);
  const startIndex = (page - 1) * recordsPerPage;
  const currentDocs = documentsData.slice(startIndex, startIndex + recordsPerPage);

  return (
    <Box p={3}>
      {/* Heading */}
      <Typography variant="h5" fontWeight="bold" color="#1B5E20">
        Dokumente
      </Typography>
      <Typography variant="body1" mb={2}>
        Frau Maria Mustermann, Zimmer 12
      </Typography>

      {/* Upload Button */}
      <Box textAlign="right" mb={2}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1B5E20",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#144a18" },
          }}
        >
          + Neues Dokument hochladen
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Typ</strong></TableCell>
              <TableCell><strong>Hinzugefügt</strong></TableCell>
              <TableCell><strong>Größe</strong></TableCell>
              <TableCell><strong>Aktion</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentDocs.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{
                        bgcolor: doc.iconColor,
                        width: 30,
                        height: 30,
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {doc.type === "PDF" ? "DF" : doc.type === "IMG" ? "XE" : "FI"}
                    </Avatar>
                    {doc.name}
                  </Box>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>
                  <IconButton color="success">
                    <Download sx={{ color: "#1B5E20" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2">
          Seite {page} von {totalPages}
        </Typography>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, v) => setPage(v)}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": { color: "#1B5E20" },
            "& .Mui-selected": {
              backgroundColor: "#1B5E20 !important",
              color: "#fff",
            },
          }}
        />
      </Box>

    </Box>
  );
};

export default Documents;
