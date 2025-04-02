import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from 'axios'; // Importamos axios

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
}

const Producto: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]); // Ahora se espera un array de productos
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({ id: 0, nombre: "", descripcion: "", tipo: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // UseEffect para cargar los productos desde el backend
  useEffect(() => {
    axios.get('http://localhost:8080/api/productos') // Asegúrate de que esta URL coincida con tu backend
      .then(response => {
        setProductos(response.data); // Establecer los productos cargados
      })
      .catch(error => {
        console.error('Hubo un error al obtener los productos:', error);
      });
  }, []); // Esto se ejecuta solo una vez, cuando el componente se monta

  // Handle open and close of the dialog
  const handleOpenDialog = (productoId: number | null) => {
    if (productoId !== null) {
      const productoToEdit = productos.find((p) => p.id === productoId);
      if (productoToEdit) {
        setFormData(productoToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({ id: 0, nombre: "", descripcion: "", tipo: "" });
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
      // Update producto
      axios.put(`http://localhost:8080/api/productos/${formData.id}`, formData)
        .then(response => {
          setProductos(
            productos.map((producto) =>
              producto.id === formData.id ? { ...formData } : producto
            )
          );
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error al actualizar el producto:', error);
        });
    } else {
      // Create new producto
      axios.post('http://localhost:8080/api/productos', formData)
        .then(response => {
          setProductos([...productos, response.data]);
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error al agregar el producto:', error);
        });
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setProductToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setProductToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (productToDelete !== null) {
      // Verificar que la URL es correcta y que el id es válido
      axios.delete(`http://localhost:8080/api/productos/${productToDelete}`)
        .then(() => {
          // Si la eliminación es exitosa, actualiza el estado
          setProductos(productos.filter((p) => p.id !== productToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error);
        });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Producto
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => handleOpenDialog(null)}
      >
        Agregar Producto
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="productos table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow
                key={producto.id}
                sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}
              >
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>{producto.tipo}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(producto.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(producto.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing Producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
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
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
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

export default Producto;
