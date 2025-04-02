import React, { useState } from "react";
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

// Datos dummy para las ventas
const initialVentas = [
  { id: 1, tanque_id: 1, volumen_vendido: 5000.00, volumen_60: 5100.00, fecha: "2023-05-02 14:00:00", cliente: "Cliente A", descripcion: "Venta de combustible" },
  { id: 2, tanque_id: 1, volumen_vendido: 3938.15, volumen_60: 3962.17, fecha: "2023-01-01 13:47:15", cliente: "D", descripcion: "Venta interna" },
  { id: 3, tanque_id: 3, volumen_vendido: 538.13, volumen_60: 541.25, fecha: "2023-01-01 10:02:17", cliente: "B", descripcion: "Venta de combustible" },
  { id: 4, tanque_id: 1, volumen_vendido: 1248.73, volumen_60: 1257.10, fecha: "2023-01-02 10:17:51", cliente: "E", descripcion: "Venta de combustible" },
  { id: 5, tanque_id: 2, volumen_vendido: 12526.48, volumen_60: 12610.41, fecha: "2023-01-02 11:56:58", cliente: "D", descripcion: "Acción como proveedor" },
  { id: 6, tanque_id: 3, volumen_vendido: 1200.22, volumen_60: 1207.06, fecha: "2023-01-02 12:21:30", cliente: "A", descripcion: "Venta interna" },
  { id: 7, tanque_id: 1, volumen_vendido: 5673.76, volumen_60: 5711.77, fecha: "2023-01-03 15:00:04", cliente: "B", descripcion: "Venta interna" },
  { id: 8, tanque_id: 3, volumen_vendido: 6283.24, volumen_60: 6321.57, fecha: "2023-01-03 15:02:22", cliente: "C", descripcion: "Acción como proveedor" },
  { id: 9, tanque_id: 2, volumen_vendido: 3956.05, volumen_60: 3984.14, fecha: "2023-01-04 10:23:37", cliente: "D", descripcion: "Venta de combustible" },
  { id: 10, tanque_id: 3, volumen_vendido: 12612.20, volumen_60: 12684.09, fecha: "2023-01-04 12:14:51", cliente: "A", descripcion: "Venta de combustible" },
  { id: 11, tanque_id: 5, volumen_vendido: 196.44, volumen_60: 197.19, fecha: "2023-01-04 15:11:39", cliente: "D", descripcion: "Venta interna" }
];

const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState(initialVentas);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    tanque_id: 0,
    volumen_vendido: 0,
    volumen_60: 0,
    fecha: "",
    cliente: "",
    descripcion: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState<number | null>(null);

  // Filtros
  const [clienteFilter, setClienteFilter] = useState("");
  const [tanqueFilter, setTanqueFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredVentas, setFilteredVentas] = useState(initialVentas);

  // Handle search button click
  const handleSearch = () => {
    const filtered = initialVentas.filter((venta) => {
      const clienteMatch = venta.cliente.toLowerCase().includes(clienteFilter.toLowerCase());
      const tanqueMatch = tanqueFilter ? venta.tanque_id.toString() === tanqueFilter : true;
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
        setFormData(ventaToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        tanque_id: 0,
        volumen_vendido: 0,
        volumen_60: 0,
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
      setVentas(
        ventas.map((venta) =>
          venta.id === formData.id ? { ...formData } : venta
        )
      );
    } else {
      const newVenta = { ...formData, id: Date.now() };
      setVentas([...ventas, newVenta]);
    }
    setOpenDialog(false);
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
      setVentas(ventas.filter((v) => v.id !== ventaToDelete));
      setOpenDeleteDialog(false);
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
              <MenuItem value="1">Tanque 1</MenuItem>
              <MenuItem value="2">Tanque 2</MenuItem>
              <MenuItem value="3">Tanque 3</MenuItem>
              <MenuItem value="5">Tanque 5</MenuItem>
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

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="ventas table">
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
                <TableCell>{`Tanque ${venta.tanque_id}`}</TableCell>
                <TableCell>{venta.volumen_vendido}</TableCell>
                <TableCell>{venta.volumen_60}</TableCell>
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

      {/* Dialog para agregar/editar venta */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Venta" : "Agregar Venta"}</DialogTitle>
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
                <option value={1}>Tanque 1</option>
                <option value={2}>Tanque 2</option>
                <option value={3}>Tanque 3</option>
                <option value={5}>Tanque 5</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen Vendido"
                fullWidth
                name="volumen_vendido"
                value={formData.volumen_vendido}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen 60"
                fullWidth
                name="volumen_60"
                value={formData.volumen_60}
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
    </Box>
  );
};

export default Ventas;
