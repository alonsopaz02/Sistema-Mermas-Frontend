import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2E7D32", // Verde oscuro
    },
    secondary: {
      main: "#388E3C",
    },
    background: {
      default: "#F5F5F5", // Fondo claro
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Fuente moderna
    h1: {
      fontFamily: "'Merriweather', serif", // Fuente especial para el header
    },
  },
});

export default theme;
