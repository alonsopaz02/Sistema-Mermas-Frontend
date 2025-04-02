import React, { useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Paper } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

// Datos dummy para los productos
const initialProductos = [
  { id: 1, nombre: "DB5 S50", descripcion: "Diesel B5 S50", tipo: "Combustible" },
  { id: 2, nombre: "CRC 02", descripcion: "Combustible CRC 02", tipo: "Combustible" },
  { id: 3, nombre: "Gasohol 84", descripcion: "Gasolina y Etanol", tipo: "Gasolina y Etanol" },
];

const Producto: React.FC = () => {
  const [productos, setProductos] = useState(initialProductos);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({ id: 0, nombre: "", descripcion: "", tipo: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

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
      setProductos(
        productos.map((producto) =>
          producto.id === formData.id ? { ...formData } : producto
        )
      );
    } else {
      const newProducto = { ...formData, id: Date.now() };
      setProductos([...productos, newProducto]);
    }
    setOpenDialog(false);
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
      setProductos(productos.filter((p) => p.id !== productToDelete));
      setOpenDeleteDialog(false);
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
