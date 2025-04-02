import React, { useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

// Datos dummy para las estaciones
const initialEstaciones = [
  { id: 1, nombre: "Carachugo", ubicacion: "Ubicación 1", tipo: "Estación Principal", descripcion: "Descripción de la estación" },
  { id: 2, nombre: "Nueva Planta", ubicacion: "Ubicación 2", tipo: "Estación Secundaria", descripcion: "Descripción de la planta" },
];

const Estaciones: React.FC = () => {
  const [estaciones, setEstaciones] = useState(initialEstaciones);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({ id: 0, nombre: "", ubicacion: "", tipo: "", descripcion: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [estacionToDelete, setEstacionToDelete] = useState<number | null>(null);

  // Handle open and close of the dialog
  const handleOpenDialog = (estacionId: number | null) => {
    if (estacionId !== null) {
      const estacionToEdit = estaciones.find((e) => e.id === estacionId);
      if (estacionToEdit) {
        setFormData(estacionToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({ id: 0, nombre: "", ubicacion: "", tipo: "", descripcion: "" });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isEditing) {
      setEstaciones(
        estaciones.map((estacion) =>
          estacion.id === formData.id ? { ...formData } : estacion
        )
      );
    } else {
      const newEstacion = { ...formData, id: Date.now() };
      setEstaciones([...estaciones, newEstacion]);
    }
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setEstacionToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setEstacionToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (estacionToDelete !== null) {
      setEstaciones(estaciones.filter((e) => e.id !== estacionToDelete));
      setOpenDeleteDialog(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Estaciones
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => handleOpenDialog(null)} // Open dialog to add a new estacion
      >
        Agregar Estación
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="estaciones table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ubicación</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estaciones.map((estacion) => (
              <TableRow key={estacion.id} sx={{ '&:hover': { backgroundColor: "#f1f1f1" } }}>
                <TableCell>{estacion.nombre}</TableCell>
                <TableCell>{estacion.ubicacion}</TableCell>
                <TableCell>{estacion.tipo}</TableCell>
                <TableCell>{estacion.descripcion}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(estacion.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(estacion.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing Estacion */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Estación" : "Agregar Estación"}</DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ubicación"
                fullWidth
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tipo"
                fullWidth
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            sx={{
              backgroundColor: "#f44336",
              color: "#fff",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            {isEditing ? "Guardar cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar esta estación? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="secondary"
            sx={{
              backgroundColor: "#f44336",
              color: "#fff",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Estaciones;
