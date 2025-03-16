import React from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

const Login: React.FC = () => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: '50vw',
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main", mb: 2 }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>

        {/* Campos de Entrada */}
        <Box component="form" sx={{ width: "100%", mt: 1 }}>
          <TextField
            fullWidth
            label="Correo electrónico"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Ingresar
          </Button>
        </Box>

        {/* Opción de Recuperación */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          ¿Olvidaste tu contraseña?
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
