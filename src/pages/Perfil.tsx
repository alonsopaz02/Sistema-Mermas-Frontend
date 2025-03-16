import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    IconButton,
    Grid,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";

const Perfil: React.FC = () => {
    // Estados del perfil
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({
        nombre: "Juan Pérez",
        email: "user@email.com",
        rol: "Administrador",
        password: "",
        confirmPassword: "",
    });

    // Manejo de cambios en los inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Alternar entre Modo Edición y Guardar
    const toggleEditMode = () => {
        if (editMode) {
            // Aquí se podrían enviar los datos a un backend
            console.log("Datos guardados:", userData);
        }
        setEditMode(!editMode);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Box sx={{ p: 4, width: "70%",height: "90vh" }}>
                <Paper elevation={3} sx={{ p: 4, width: "100%", textAlign: "center" }}>
                    {/* Avatar y Título */}
                    <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, mx: "auto", mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Mi Perfil
                    </Typography>

                    {/* Sección de Datos Personales */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                variant="outlined"
                                value={userData.nombre}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                name="email"
                                variant="outlined"
                                value={userData.email}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Rol"
                                name="rol"
                                variant="outlined"
                                value={userData.rol}
                                disabled
                            />
                        </Grid>
                    </Grid>

                    {/* Botón para alternar entre Editar/Guardar */}
                    <IconButton onClick={toggleEditMode} sx={{ mt: 2 }}>
                        {editMode ? <Save /> : <Edit />}
                    </IconButton>

                    {/* Cambio de Contraseña (Solo visible si está en modo edición) */}
                    {editMode && (
                        <>
                            <Typography variant="h6" sx={{ mt: 4 }}>
                                Cambiar Contraseña
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Nueva Contraseña"
                                        name="password"
                                        variant="outlined"
                                        value={userData.password}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Confirmar Contraseña"
                                        name="confirmPassword"
                                        variant="outlined"
                                        value={userData.confirmPassword}
                                        onChange={handleInputChange}
                                        error={userData.password !== userData.confirmPassword}
                                        helperText={
                                            userData.password !== userData.confirmPassword
                                                ? "Las contraseñas no coinciden"
                                                : ""
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}

                    {/* Botón Guardar Cambios (Solo visible en modo edición) */}
                    {editMode && (
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={toggleEditMode}
                            disabled={userData.password !== userData.confirmPassword}
                        >
                            Guardar Cambios
                        </Button>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default Perfil;
