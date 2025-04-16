import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from 'axios';

// URL del backend (ajústalo según tu configuración)
const API_URL = "http://localhost:8080/api/estaciones";

const Estaciones: React.FC = () => {
  const [estaciones, setEstaciones] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({ id: 0, nombre: "", ubicacion: "", tipo: "", descripcion: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [estacionToDelete, setEstacionToDelete] = useState<number | null>(null);

  // Fetch estaciones from the backend
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setEstaciones(response.data);
      })
      .catch(error => {
        console.error("Error fetching estaciones:", error);
      });
  }, []);

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
      // Update estacion
      axios.put(`${API_URL}/${formData.id}`, formData)
        .then(response => {
          console.log('Actualizacion correcta', response);
          setEstaciones(
            estaciones.map((estacion) =>
              estacion.id === formData.id ? { ...formData } : estacion
            )
          );
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error al actualizar la estación:', error);
        });
    } else {
      // Create new estacion
      axios.post(API_URL, formData)
        .then(response => {
          setEstaciones([...estaciones, response.data]);
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error al agregar la estación:', error);
        });
    }
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
      // Delete estacion
      axios.delete(`${API_URL}/${estacionToDelete}`)
      .then(response => {
          console.log('Eliminacion correcta', response);
          setEstaciones(estaciones.filter((e) => e.id !== estacionToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => {
          console.error('Error al eliminar la estación:', error);
        });
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
