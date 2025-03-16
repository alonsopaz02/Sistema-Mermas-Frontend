import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; // Importar Outlet para renderizar las rutas hijas

const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden",width: "100vw" }}>
      {/* Sidebar */}
      <Sidebar open={drawerOpen} />

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {/* Header */}
        <Header toggleSidebar={() => setDrawerOpen(!drawerOpen)} />

        {/* Contenido de la página - Aquí se renderiza Home o cualquier otra página */}
        <Box sx={{ p: 3, mt: 8 }}>
          <Outlet /> {/* Ahora las rutas hijas se renderizan dentro del Layout */}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
