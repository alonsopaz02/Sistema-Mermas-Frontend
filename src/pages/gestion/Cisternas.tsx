import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";

// URL del backend
const BASE_URL = "http://localhost:8080/api/cisternas";

const Cisternas: React.FC = () => {
  const [cisternas, setCisternas] = useState<any[]>([]); // Cambié el tipo de estado
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({ id: 0, placa: "", descripcion: "", tipo: "", fecha_fabricacion: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [cisternaToDelete, setCisternaToDelete] = useState<number | null>(null);

  // Obtener los datos de cisternas al cargar el componente
  useEffect(() => {
    axios.get(BASE_URL)
      .then((response) => {
        setCisternas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las cisternas:", error);
      });
  }, []);

  // Handle open and close of the dialog
  const handleOpenDialog = (cisternaId: number | null) => {
    if (cisternaId !== null) {
      const cisternaToEdit = cisternas.find((c) => c.id === cisternaId);
      if (cisternaToEdit) {
        setFormData(cisternaToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({ id: 0, placa: "", descripcion: "", tipo: "", fecha_fabricacion: "" });
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
      // Update cisterna
      axios.put(`${BASE_URL}/${formData.id}`, formData)
        .then((response) => {
          console.log('Actualizacion correcta', response);
          setCisternas(
            cisternas.map((cisterna) =>
              cisterna.id === formData.id ? { ...formData } : cisterna
            )
          );
          setOpenDialog(false);
        })
        .catch((error) => {
          console.error("Error al actualizar la cisterna:", error);
        });
    } else {
      // Create new cisterna
      axios.post(BASE_URL, formData)
        .then((response) => {
          setCisternas([...cisternas, response.data]);
          setOpenDialog(false);
        })
        .catch((error) => {
          console.error("Error al agregar la cisterna:", error);
        });
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setCisternaToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setCisternaToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (cisternaToDelete !== null) {
      axios.delete(`${BASE_URL}/${cisternaToDelete}`)
        .then(() => {
          setCisternas(cisternas.filter((c) => c.id !== cisternaToDelete));
          setOpenDeleteDialog(false);
        })
        .catch((error) => {
          console.error("Error al eliminar la cisterna:", error);
        });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Cisternas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => handleOpenDialog(null)} // Open dialog to add a new cisterna
      >
        Agregar Cisterna
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="cisternas table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Placa</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha de Fabricación</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cisternas.map((cisterna) => (
              <TableRow key={cisterna.id} sx={{ '&:hover': { backgroundColor: "#f1f1f1" } }}>
                <TableCell>{cisterna.placa}</TableCell>
                <TableCell>{cisterna.descripcion}</TableCell>
                <TableCell>{cisterna.tipo}</TableCell>
                <TableCell>{cisterna.fecha_fabricacion}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(cisterna.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(cisterna.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing Cisterna */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Cisterna" : "Agregar Cisterna"}</DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Placa"
                fullWidth
                name="placa"
                value={formData.placa}
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
                label="Fecha de Fabricación"
                fullWidth
                name="fecha_fabricacion"
                type="date"
                value={formData.fecha_fabricacion}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
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
            ¿Estás seguro de que deseas eliminar esta cisterna? Esta acción no se puede deshacer.
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

export default Cisternas;
