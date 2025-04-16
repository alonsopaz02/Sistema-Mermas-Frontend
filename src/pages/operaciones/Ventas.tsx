import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TablePagination
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import axios from "axios";

// URL base del API
const BASE_URL = "http://localhost:8080/api";

const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [tanques, setTanques] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    tanque_id: 0,
    volumenVendido: 0,
    volumen60: 0,
    fecha: "",
    cliente: "",
    descripcion: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState<number | null>(null);
  const [clienteFilter, setClienteFilter] = useState("");
  const [tanqueFilter, setTanqueFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredVentas, setFilteredVentas] = useState<any[]>([]);

  // Fetch data on load
  useEffect(() => {
    // Fetch ventas data
    axios.get(`${BASE_URL}/ventas`)
      .then(response => {
        setVentas(response.data);
        setFilteredVentas(response.data);
      })
      .catch(error => console.error("Error fetching ventas:", error));

    // Fetch tanques data
    axios.get(`${BASE_URL}/tanques`)
      .then(response => {
        setTanques(response.data);
      })
      .catch(error => console.error("Error fetching tanques:", error));

    // Fetch distinct clientes (this could be an endpoint that returns all distinct clients)
    axios.get(`${BASE_URL}/ventas/clientes`)
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => console.error("Error fetching clientes:", error));
  }, []);

  const handleSearch = () => {
    const filtered = ventas.filter((venta) => {
      const clienteMatch = venta.cliente.toLowerCase().includes(clienteFilter.toLowerCase());
      const tanqueMatch = tanqueFilter ? venta.tanque.id.toString() === tanqueFilter : true;
      const fechaMatch =
        (fechaInicioFilter ? new Date(venta.fecha) >= new Date(fechaInicioFilter) : true) &&
        (fechaFinFilter ? new Date(venta.fecha) <= new Date(fechaFinFilter) : true);

      return clienteMatch && tanqueMatch && fechaMatch;
    });
    setFilteredVentas(filtered);
  };

  const handleOpenDialog = (ventaId: number | null) => {
    if (ventaId !== null) {
      const ventaToEdit = ventas.find((v) => v.id === ventaId);
      if (ventaToEdit) {
        setFormData({
          ...ventaToEdit,
          tanque_id: ventaToEdit.tanque.id,
        });
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        tanque_id: 0,
        volumenVendido: 0,
        volumen60: 0,
        fecha: "",
        cliente: "",
        descripcion: ""
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
      // Update venta
      axios.put(`${BASE_URL}/ventas/${formData.id}`, formData)
        .then(response => {
          setVentas(ventas.map((venta) => venta.id === formData.id ? { ...formData } : venta));
          setOpenDialog(false);
        })
        .catch(error => console.error('Error updating venta:', error));
    } else {
      // Create new venta
      axios.post(`${BASE_URL}/ventas`, formData)
        .then(response => {
          setVentas([...ventas, response.data]);
          setOpenDialog(false);
        })
        .catch(error => console.error('Error adding venta:', error));
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setVentaToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setVentaToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (ventaToDelete !== null) {
      axios.delete(`${BASE_URL}/ventas/${ventaToDelete}`)
        .then(response => {
          setVentas(ventas.filter((v) => v.id !== ventaToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => console.error('Error deleting venta:', error));
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Ventas
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Buscar Cliente"
            fullWidth
            value={clienteFilter}
            onChange={(e) => setClienteFilter(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Tanque</InputLabel>
            <Select
              value={tanqueFilter}
              onChange={(e) => setTanqueFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {tanques.map((tanque) => (
                <MenuItem key={tanque.id} value={tanque.id}>
                  {`Tanque ${tanque.codigo}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Fecha Inicio"
            type="date"
            fullWidth
            value={fechaInicioFilter}
            onChange={(e) => setFechaInicioFilter(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Fecha Fin"
            type="date"
            fullWidth
            value={fechaFinFilter}
            onChange={(e) => setFechaFinFilter(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Search />}
            fullWidth
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </Grid>
      </Grid>

      {/* Agregar nueva venta */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => setOpenDialog(true)}
      >
        Agregar Venta
      </Button>

      {/* Tabla de Ventas */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="ventas table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Tanque</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen Vendido</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen 60</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((venta) => (
              <TableRow key={venta.id}>
                <TableCell>{`Tanque ${venta.tanque.codigo}`}</TableCell>
                <TableCell>{venta.volumenVendido}</TableCell>
                <TableCell>{venta.volumen60}</TableCell>
                <TableCell>{venta.cliente}</TableCell>
                <TableCell>{venta.descripcion}</TableCell>
                <TableCell>{venta.fecha}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(venta.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(venta.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredVentas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialogo para agregar/editar venta */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{formData.id ? "Editar Venta" : "Agregar Venta"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tanque"
                fullWidth
                name="tanque_id"
                value={formData.tanque_id}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
              >
                {tanques.map((tanque) => (
                  <option key={tanque.id} value={tanque.id}>
                    {`Tanque ${tanque.codigo}`}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen Vendido"
                fullWidth
                name="volumenVendido"
                value={formData.volumenVendido}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen 60"
                fullWidth
                name="volumen60"
                value={formData.volumen60}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Cliente"
                fullWidth
                name="cliente"
                value={formData.cliente}
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
                label="Fecha"
                fullWidth
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">
            {formData.id ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleDelete} color="primary">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ventas;
