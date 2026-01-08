import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Menu,
} from "@mui/icons-material";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { de } from "date-fns/locale";
import Check from "@mui/icons-material/Check";


const Appointments = () => {
  const currentDate = new Date(2024, 4, 1);
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  const weekdays = ["Montag", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const events = [
    {
      date: new Date(2024, 4, 15),
      time: "10:30 Uhr",
      title: "Hr. Müller Müller",
    },
    {
      date: new Date(2024, 4, 17),
      time: "14:30 Uhr",
      title: "Frau Musherapin, Arzt",
    },
    { date: new Date(2024, 4, 24), time: "09:00 Uhr", title: "Team-Meeting" },
    { date: new Date(2024, 4, 29), title: "Mittagessen nichts" },
  ];

  const getEventsForDay = (day) =>
    events.filter(
      (e) =>
        e.date && format(e.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );

  const firstDayOffset = start.getDay() === 0 ? 6 : start.getDay() - 1;

  return (
    <Box sx={{ p: { xs: 2, lg: 5 }, maxWidth: 1600, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
      >
        <Stack direction="row" alignItems="center" spacing={4}>
          <IconButton size="large">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h4" fontWeight={700}>
            {format(currentDate, "MMMM yyyy", { locale: de })}
          </Typography>
          <IconButton size="large">
            <ChevronRight />
          </IconButton>
        </Stack>
        <IconButton size="large">
          <Menu />
        </IconButton>
      </Stack>

      {/* Weekdays */}
      <Grid container sx={{ mb: 1 }}>
        {weekdays.map((day, i) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography
              align="center"
              fontWeight={700}
              fontSize="1.25rem"
              color={i >= 5 ? "text.secondary" : "text.primary"}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar */}
      <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
        <Paper elevation={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(70px, 1fr))",
              border: 1,
              borderColor: "grey.300",
              gap: "2px",
              maxWidth: "100%",
            }}
          >
            {/* Empty Cells */}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <Box
                key={`empty-${i}`}
                sx={{
                  height: 120,
                  bgcolor: "#f8f9fa",
                  borderRight: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "grey.300",
                }}
              />
            ))}

            {/* Days */}
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isTodayDate = isToday(day);

              return (
                <Box
                  key={day.toString()}
                  sx={{
                    height: 120,
                    borderRight: "1px solid",
                    borderBottom: "1px solid",
                    borderColor: "grey.300",
                    bgcolor: "background.paper",
                    gridColumn: dayEvents.length > 0 ? "span 2" : "span 1",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      align="right"
                      fontSize="1.3rem"
                      fontWeight={isTodayDate ? "bold" : 600}
                      color={isTodayDate ? "primary.main" : "text.primary"}
                      mb={1}
                    >
                      {format(day, "d")}
                    </Typography>

                   <Stack spacing={0.8} sx={{ flex: 1 }}>
  {dayEvents.map((event, idx) => (
    <Chip
      key={idx}
      size="medium"
      icon={<Check sx={{ fontSize: 16 }} />} // 🔥 pure tick icon
      label={
        <Box>
          {event.time && (
            <Typography variant="caption" fontWeight={600} display="block">
              {event.time}
            </Typography>
          )}
          <Typography variant="body2" fontWeight={600}>
            {event.title}
          </Typography>
        </Box>
      }
      sx={{
        bgcolor: "#e8f5e9",
        color: "#1b5e20",
        height: "auto",
        py: 0.8,
        display: "flex",
        flexDirection: "row-reverse",

        "& .MuiChip-icon": {
          backgroundColor: "#1b5e20",
          color: "#fff",
          borderRadius: "50%",
          padding: "4px",
          marginLeft: "6px",
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },

        "& .MuiChip-label": {
          display: "block",
          px: 1.5,
          whiteSpace: "normal",
        },
      }}
    />
  ))}
</Stack>

                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Appointments;
