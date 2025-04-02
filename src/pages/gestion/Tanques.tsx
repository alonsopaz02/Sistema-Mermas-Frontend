import React, { useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

// Datos dummy para las estaciones y productos (relaciones)
const estaciones = [
  { id: 1, nombre: "Carachugo" },
  { id: 2, nombre: "Nueva Planta" },
];

const productos = [
  { id: 1, nombre: "Diesel B5 S50" },
  { id: 2, nombre: "Gasohol 84" },
  { id: 3, nombre: "Combustible CRC 02" },
];

// Datos dummy para los tanques
const initialTanques = [
  {
    id: 3,
    codigo: "101",
    estacion_id: 2,
    producto_id: 1,
    capacidad_litros: 30000.00,
    volumen_actual: 24000.00,
    volumen_60: 24300.00,
    temperatura_media: "",
    porcentaje_ocupacion: "",
    estado: "Inactivo",
    ultima_actualizacion: "2023-05-01 08:00:00",
  },
  {
    id: 4,
    codigo: "102",
    estacion_id: 2,
    producto_id: 1,
    capacidad_litros: 30000.00,
    volumen_actual: 24000.00,
    volumen_60: 24300.00,
    temperatura_media: "",
    porcentaje_ocupacion: "",
    estado: "Activo",
    ultima_actualizacion: "2023-05-01 08:00:00",
  },
  {
    id: 5,
    codigo: "103",
    estacion_id: 2,
    producto_id: 3,
    capacidad_litros: 30000.00,
    volumen_actual: 24000.00,
    volumen_60: 24300.00,
    temperatura_media: "",
    porcentaje_ocupacion: "",
    estado: "Activo",
    ultima_actualizacion: "2023-05-01 08:00:00",
  },
  {
    id: 1,
    codigo: "119",
    estacion_id: 1,
    producto_id: 1,
    capacidad_litros: 20000.00,
    volumen_actual: 15000.00,
    volumen_60: 15200.00,
    temperatura_media: "",
    porcentaje_ocupacion: "",
    estado: "Activo",
    ultima_actualizacion: "2023-05-01 08:00:00",
  },
  {
    id: 2,
    codigo: "120",
    estacion_id: 1,
    producto_id: 1,
    capacidad_litros: 25000.00,
    volumen_actual: 20000.00,
    volumen_60: 20200.00,
    temperatura_media: "",
    porcentaje_ocupacion: "",
    estado: "Activo",
    ultima_actualizacion: "2023-05-01 08:00:00",
  },
];

const Tanques: React.FC = () => {
  const [tanques, setTanques] = useState(initialTanques);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    codigo: "",
    estacion_id: 0,
    producto_id: 0,
    capacidad_litros: 0,
    volumen_actual: 0,
    volumen_60: 0,
    temperatura_media: "",
    porcentaje_ocupacion: "",
    estado: "",
    ultima_actualizacion: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tanqueToDelete, setTanqueToDelete] = useState<number | null>(null);

  const handleOpenDialog = (tanqueId: number | null) => {
    if (tanqueId !== null) {
      const tanqueToEdit = tanques.find((t) => t.id === tanqueId);
      if (tanqueToEdit) {
        setFormData(tanqueToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        codigo: "",
        estacion_id: 0,
        producto_id: 0,
        capacidad_litros: 0,
        volumen_actual: 0,
        volumen_60: 0,
        temperatura_media: "",
        porcentaje_ocupacion: "",
        estado: "",
        ultima_actualizacion: "",
      });
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
      setTanques(
        tanques.map((tanque) =>
          tanque.id === formData.id ? { ...formData } : tanque
        )
      );
    } else {
      const newTanque = { ...formData, id: Date.now() };
      setTanques([...tanques, newTanque]);
    }
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setTanqueToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setTanqueToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (tanqueToDelete !== null) {
      setTanques(tanques.filter((t) => t.id !== tanqueToDelete));
      setOpenDeleteDialog(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Tanques
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => handleOpenDialog(null)} // Open dialog to add a new tanque
      >
        Agregar Tanque
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tanques table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Código</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estación</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Capacidad (L)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen Actual</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen a 60° F</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tanques.map((tanque) => (
              <TableRow key={tanque.id} sx={{ '&:hover': { backgroundColor: "#f1f1f1" } }}>
                <TableCell>{tanque.codigo}</TableCell>
                <TableCell>{estaciones.find(e => e.id === tanque.estacion_id)?.nombre}</TableCell>
                <TableCell>{productos.find(p => p.id === tanque.producto_id)?.nombre}</TableCell>
                <TableCell>{tanque.capacidad_litros}</TableCell>
                <TableCell>{tanque.volumen_actual}</TableCell>
                <TableCell>{tanque.volumen_60}</TableCell>
                <TableCell>{tanque.estado}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(tanque.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(tanque.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing Tanque */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Tanque" : "Agregar Tanque"}</DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Código"
                fullWidth
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Estación"
                fullWidth
                name="estacion_id"
                value={formData.estacion_id}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
              >
                {estaciones.map((estacion) => (
                  <option key={estacion.id} value={estacion.id}>
                    {estacion.nombre}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Producto"
                fullWidth
                name="producto_id"
                value={formData.producto_id}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
              >
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Capacidad (L)"
                fullWidth
                name="capacidad_litros"
                type="number"
                value={formData.capacidad_litros}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen Actual"
                fullWidth
                name="volumen_actual"
                type="number"
                value={formData.volumen_actual}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen a 60° F"
                fullWidth
                name="volumen_60"
                type="number"
                value={formData.volumen_60}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Estado"
                fullWidth
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Última Actualización"
                fullWidth
                name="ultima_actualizacion"
                type="datetime-local"
                value={formData.ultima_actualizacion}
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
            ¿Estás seguro de que deseas eliminar este tanque? Esta acción no se puede deshacer.
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

export default Tanques
