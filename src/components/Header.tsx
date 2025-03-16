import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "Merriweather" }}>
          Sistema de Gestión de Merma de Combustible
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
