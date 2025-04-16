import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";

// URL base del API
const BASE_URL = "http://localhost:8080/api";

// Componente principal para gestionar tanques
const Tanques: React.FC = () => {
  const [tanques, setTanques] = useState<any[]>([]);
  const [estaciones, setEstaciones] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    codigo: "",
    estacion_id: 0,
    producto_id: 0,
    capacidadlitros: 0,
    volumenActual: 0,
    volumen60: 0,
    temperaturaMedia: "",
    porcentajeOcupacion: "",
    estado: "",
    ultimaActualizacion: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tanqueToDelete, setTanqueToDelete] = useState<number | null>(null);

  // Obtener los datos de los tanques, estaciones y productos al cargar el componente
  useEffect(() => {
    // Obtener los tanques
    axios.get(`${BASE_URL}/tanques`)
      .then(response => {
        setTanques(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los tanques", error);
      });

    // Obtener las estaciones
    axios.get(`${BASE_URL}/estaciones`)
      .then(response => {
        setEstaciones(response.data);
      })
      .catch(error => {
        console.error("Error al obtener las estaciones", error);
      });

    // Obtener los productos
    axios.get(`${BASE_URL}/productos`)
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los productos", error);
      });
  }, []);

  const handleOpenDialog = (tanqueId: number | null) => {
    if (tanqueId !== null) {
      const tanqueToEdit = tanques.find((t) => t.id === tanqueId);
      if (tanqueToEdit) {
        setFormData({
          ...tanqueToEdit,
          estacion_id: tanqueToEdit.estacion.id,  // Extraer ID de la estación
          producto_id: tanqueToEdit.producto.id,  // Extraer ID del producto
        });
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        codigo: "",
        estacion_id: 0,
        producto_id: 0,
        capacidadlitros: 0,
        volumenActual: 0,
        volumen60: 0,
        temperaturaMedia: "",
        porcentajeOcupacion: "",
        estado: "",
        ultimaActualizacion: "",
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
      // Actualizar tanque
      axios.put(`${BASE_URL}/tanques/${formData.id}`, formData)
        .then(response => {
          setTanques(
            tanques.map((tanque) =>
              tanque.id === formData.id ? { ...formData } : tanque
            )
          );
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error al actualizar el tanque:', error);
        });
    } else {
      // Crear nuevo tanque
      axios.post(`${BASE_URL}/tanques`, formData)
        .then(response => {
          setTanques([...tanques, response.data]);
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error al agregar el tanque:', error);
        });
    }
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
      axios.delete(`${BASE_URL}/tanques/${tanqueToDelete}`)
        .then(response => {
          setTanques(tanques.filter((t) => t.id !== tanqueToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => {
          console.error('Error al eliminar el tanque:', error);
        });
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
      <TableCell>{tanque.estacion.nombre}</TableCell>
      <TableCell>{tanque.producto.nombre}</TableCell>
      <TableCell>{tanque.capacidadLitros?.toFixed(2) ?? 'N/A'}</TableCell> {/* Formatear con dos decimales */}
      <TableCell>{tanque.volumenActual?.toFixed(2) ?? 'N/A'}</TableCell> {/* Formatear con dos decimales */}
      <TableCell>{tanque.volumen60?.toFixed(2) ?? 'N/A'}</TableCell> {/* Formatear con dos decimales */}
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
                value={formData.capacidadlitros}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen Actual"
                fullWidth
                name="volumen_actual"
                type="number"
                value={formData.volumenActual}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen a 60° F"
                fullWidth
                name="volumen_60"
                type="number"
                value={formData.volumen60}
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
                value={formData.ultimaActualizacion}
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

export default Tanques;
