import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Typography,
  Button,
  Toolbar,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Settings,
  LocalGasStation,
  Logout,
  Person,
  Report,
  Notifications,
  Home,
  AccountCircle,
  LocalShipping, // Icono de Transportes
} from "@mui/icons-material";

interface SidebarProps {
  open: boolean;
}

const menuItems = [
  {
    title: "Gestión",
    icon: <Dashboard />,
    subItems: [
      { name: "Tanques", route: "/gestion/tanques" },
      { name: "Productos", route: "/gestion/productos" },
      { name: "Cisternas", route: "/gestion/cisternas" },
      { name: "Estaciones", route: "/gestion/estaciones" },
    ],
  },
  {
    title: "Reportes",
    icon: <Report />,
    subItems: [
      { name: "Consulta", route: "/reportes/consulta" },
      { name: "Dashboard", route: "/reportes/dashboard" },
    ],
  },
  {
    title: "Alertas",
    icon: <Notifications />,
    subItems: [
      { name: "Últimas alertas", route: "/alertas/ultimas" },
      { name: "Historial", route: "/alertas/historial" },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => {
      const newOpenMenus: { [key: string]: boolean } = {};
      Object.keys(prev).forEach((key) => {
        newOpenMenus[key] = false; // Cierra todos los menús
      });
      newOpenMenus[title] = !prev[title]; // Abre el menú seleccionado
      return newOpenMenus;
    });
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
            <Person />
          </Avatar>
        </Box>
        <Typography variant="h6">Usuario</Typography>
        <Typography variant="body2" color="text.secondary">
          Admin - user@email.com
        </Typography>
      </Box>

      <List>
        {/* Inicio */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/home")}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>

        {/* Menú desplegable dinámico */}
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleMenu(item.title)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
                {openMenus[item.title] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
              <List sx={{ pl: 4 }}>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.name} disablePadding>
                    <ListItemButton onClick={() => navigate(subItem.route)}>
                      <ListItemText primary={subItem.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}

        {/* Transportes (opción plana sin desplegable) */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/operaciones")}>
            <ListItemIcon>
              <LocalGasStation />
            </ListItemIcon>
            <ListItemText primary="Operaciones" />
          </ListItemButton>
        </ListItem>

        {/* Transportes (opción plana sin desplegable) */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/transportes")}>
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>
            <ListItemText primary="Transportes" />
          </ListItemButton>
        </ListItem>

        {/* Perfil */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/perfil")}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItemButton>
        </ListItem>

      </List>

      {/* Botón Cerrar Sesión */}
      <Box sx={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center" }}>
        <Button variant="contained" color="error" startIcon={<Logout />}>
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;