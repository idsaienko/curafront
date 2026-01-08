import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  Divider,
  Chip,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import MedicationIcon from "@mui/icons-material/Medication";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const activities = [
  {
    time: "08:00 Uhr",
    title: "Morgenpflege",
    room: "Zimmer 12",
    subtitle: "Unterstützung beim Waschen",
    icon: <PersonIcon />,
    status: "done",
  },
  {
    time: "09:30",
    title: "Medikamentengabe",
    room: "Zimmer 5",
    subtitle: "Tabletten wie verordnet",
    icon: <MedicationIcon />,
    status: "done",
  },
  {
    time: "11:00",
    title: "Physiotherapie",
    room: "Zimmer 17",
    subtitle: "Frau Anna Schmidt, Gartenrunde",
    icon: <DirectionsWalkIcon />,
    status: "done",
  },
  {
    time: "",
    title: "Herr Schmidt",
    room: "Zimmer 5",
    subtitle: "Übung zur Mobilisation",
    icon: <RestaurantIcon />,
    status: "pending",
  },
  {
    time: "11:00",
    title: "Physiotherapie",
    room: "Zimmer 17",
    subtitle: "Frau Anna Schmidt, Gartenrunde",
    icon: <DirectionsWalkIcon />,
    status: "done",
  },
  {
    time: "",
    title: "Herr Schmidt",
    room: "Zimmer 5",
    subtitle: "Übung zur Mobilisation",
    icon: <RestaurantIcon />,
    status: "pending",
  },
];

const Schedule = () => {
  const [tab, setTab] = useState(0);

  // -----------------------------
  // 🔥 Pagination State
  // -----------------------------
  const [page, setPage] = useState(1);
  const itemsPerPage = 3; // change items shown per page

  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const paginatedActivities = activities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <Box p={3} sx={{ width: "100%" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          Zeitplan
        </Typography>

        <Button variant="contained" color="success">
          + Neue Aktivität
        </Button>
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" mt={1}>
        Heute, 17. Mai 2024
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ mt: 1 }}
        textColor="success"
        indicatorColor="success"
      >
        <Tab label="Heute" />
        <Tab label="Woche" />
      </Tabs>

      {tab === 0 && (
        <>
          {/* Scrollable Activity List */}
          <Box
            mt={2}
            sx={{
              maxHeight: "55vh",
              overflowY: "auto",
              pr: 1,
            }}
          >
            <Stack spacing={2}>
              {paginatedActivities.map((item, idx) => (
                <Card
                  key={idx}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#f2f2f2",
                    boxShadow: "none",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: "#1b5e20",
                          color: "white",
                          width: 35,
                          height: 35,
                        }}
                      >
                        {item.icon}
                      </Avatar>

                      <Box flex={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {item.time && (
                            <Typography fontWeight={600} fontSize={15}>
                              {item.time} –
                            </Typography>
                          )}
                          <Typography fontWeight={600} fontSize={15}>
                            {item.title}
                          </Typography>
                          <Typography fontSize={14} color="text.secondary">
                            {item.room}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={0.5}
                        >
                          {item.subtitle}
                        </Typography>
                      </Box>

                      {item.status === "done" ? (
                        <CheckCircleIcon
                          sx={{ color: "#1b5e20", fontSize: 26 }}
                        />
                      ) : (
                        <Stack alignItems="flex-end" spacing={1}>
                          <Chip
                            icon={<AccessTimeIcon />}
                            label="Ausstehend"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{
                              borderColor: "#d38b24",
                              color: "#c77607",
                              "& .MuiChip-icon": { color: "#c77607" },
                            }}
                          />

                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                          >
                            + Dokumentieren
                          </Button>
                        </Stack>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Pagination Bar */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "white",
              py: 1,
            }}
          >
            {/* Left: Pagination Text */}
            <Typography variant="body2" color="text.secondary">
              Seite {page} von {totalPages}
            </Typography>

            {/* Right: Pagination Icons */}
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={handlePrev}
                disabled={page === 1}
              >
                <ChevronLeftIcon />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleNext}
                disabled={page === totalPages}
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Care Text Below */}
          <Typography
            variant="body2"
            sx={{
              color: "#1b5e20",
              fontWeight: 900,
              fontSize: 16,
              textAlign: "left",
              mt: 0.5,
              mb: 1,
            }}
          >
            Care that connects.
          </Typography>

          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {tab === 1 && (
        <Typography variant="body1" color="text.secondary" mt={2}>
          Wöchentlicher Zeitplan kommt hier…
        </Typography>
      )}
    </Box>
  );
};

export default Schedule;
