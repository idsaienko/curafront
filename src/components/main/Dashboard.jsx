import React, { useState } from "react";
import { Box, Drawer, IconButton, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LeftSide from "./LeftSide";
// import RightSide from "./RightSide";
import ResidentsProfiles from "../Residents/ResidentsProfiles";
import NavBar from "../NavBar"; 

const Dashboard = () => {
  const [activeScreen, setActiveScreen] = useState("home");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* ✅ Top NavBar */}
      <NavBar
        onLeftMenuClick={() => setLeftOpen(true)}
        onRightMenuClick={() => setRightOpen(true)}
      />

      {/* ✅ Main Content */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          mt: { xs: "20px", md: "10px" },
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* ✅ Left Sidebar (Desktop) */}
        {/* {!isMobile && (
          <Box
            sx={{
              width: "20%",
              borderRight: "1px solid #e0e0e0",
              background: "#fff",
            }}
          >
            <LeftSide onResidentsClick={() => setActiveScreen("residents")} onReportsClick={() => setActiveScreen("reports")} />
          </Box>
        )} */}

        {/* ✅ Center Content */}
        <Box
          sx={{
            flex: 1,
            background: "#fff",
            overflowY: "auto",
            p: { xs: 2, md: 3 },
          }}
        >
          {/* {activeScreen === "residents" ? (
            <ResidentsProfiles onBackHome={() => setActiveScreen("home")} />
          ) : (
            <Center />
          )} */}
          {/* <Center /> */}

          <ResidentsProfiles onBackHome={() => setActiveScreen("home")} />
        </Box>

        {/* ✅ Right Sidebar (Desktop) */}
        {!isMobile && (
          <Box
            sx={{
              width: "20%",
              borderLeft: "1px solid #e0e0e0",
              background: "#fff",
              overflowY: "auto",
            }}
          >
            {/* <RightSide /> */}
          </Box>
        )}
      </Box>

      {/* ✅ Left Drawer (Mobile) */}
      <Drawer
        anchor="left"
        open={leftOpen}
        onClose={() => setLeftOpen(false)}
        sx={{
          "& .MuiDrawer-paper": { width: 260, p: 2, backgroundColor: "#fff" },
        }}
      >
        <IconButton onClick={() => setLeftOpen(false)}>
          <CloseIcon />
        </IconButton>
        <LeftSide
          onResidentsClick={() => {
            setActiveScreen("residents");
            setLeftOpen(false);
          }}
        />
      </Drawer>

      {/* ✅ Right Drawer (Mobile) */}
      <Drawer
        anchor="right"
        open={rightOpen}
        onClose={() => setRightOpen(false)}
        sx={{
          "& .MuiDrawer-paper": { width: 280, p: 2, backgroundColor: "#fff" },
        }}
      >
        <IconButton onClick={() => setRightOpen(false)}>
          <CloseIcon />
        </IconButton>
        {/* <RightSide /> */}
      </Drawer>
    </Box>
  );
};

export default Dashboard;
