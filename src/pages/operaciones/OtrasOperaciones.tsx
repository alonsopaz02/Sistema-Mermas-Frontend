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

// Datos dummy para las otras operaciones
const initialOperaciones = [
  { id: 486, tanque_id: 5, fecha: "2023-11-11 13:00:00", descripcion: "Uso en estacion de emergencia", volumen_observado: -119.98, volumen_60: -119.98 },
  { id: 259, tanque_id: 5, fecha: "2023-05-31 12:03:00", descripcion: "Ajuste por temperatura", volumen_observado: -119.94, volumen_60: -120.43 },
  { id: 22, tanque_id: 5, fecha: "2023-05-31 15:53:00", descripcion: "Ajuste por temperatura", volumen_observado: 119.94, volumen_60: 120.43 },
  { id: 44, tanque_id: 5, fecha: "2023-11-11 14:53:00", descripcion: "Ajuste por temperatura", volumen_observado: 119.98, volumen_60: 119.98 },
  { id: 43, tanque_id: 4, fecha: "2023-11-11 15:44:00", descripcion: "Ajuste por medición de inventario", volumen_observado: 120.05, volumen_60: 120.55 },
  { id: 21, tanque_id: 4, fecha: "2023-05-31 11:31:00", descripcion: "Recarga de combustible en estación", volumen_observado: 288.27, volumen_60: 289.68 },
  { id: 26, tanque_id: 3, fecha: "2023-07-04 10:11:00", descripcion: "Corrección de error en medición de tanque", volumen_observado: 477.33, volumen_60: 480.29 }
];

const OtrasOperaciones: React.FC = () => {
  const [operaciones, setOperaciones] = useState(initialOperaciones);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    tanque_id: 0,
    fecha: "",
    descripcion: "",
    volumen_observado: 0,
    volumen_60: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [operacionToDelete, setOperacionToDelete] = useState<number | null>(null);

  // Filtros
  const [tanqueFilter, setTanqueFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredOperaciones, setFilteredOperaciones] = useState(initialOperaciones);

  // Handle search button click
  const handleSearch = () => {
    const filtered = initialOperaciones.filter((operacion) => {
      const tanqueMatch = tanqueFilter ? operacion.tanque_id.toString() === tanqueFilter : true;
      const fechaMatch =
        (fechaInicioFilter ? new Date(operacion.fecha) >= new Date(fechaInicioFilter) : true) &&
        (fechaFinFilter ? new Date(operacion.fecha) <= new Date(fechaFinFilter) : true);

      return tanqueMatch && fechaMatch;
    });
    setFilteredOperaciones(filtered);
  };

  const handleOpenDialog = (operacionId: number | null) => {
    if (operacionId !== null) {
      const operacionToEdit = operaciones.find((o) => o.id === operacionId);
      if (operacionToEdit) {
        setFormData(operacionToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        tanque_id: 0,
        fecha: "",
        descripcion: "",
        volumen_observado: 0,
        volumen_60: 0
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
      setOperaciones(
        operaciones.map((operacion) =>
          operacion.id === formData.id ? { ...formData } : operacion
        )
      );
    } else {
      const newOperacion = { ...formData, id: Date.now() };
      setOperaciones([...operaciones, newOperacion]);
    }
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setOperacionToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOperacionToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (operacionToDelete !== null) {
      setOperaciones(operaciones.filter((o) => o.id !== operacionToDelete));
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
        Gestión de Otras Operaciones
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Tanque</InputLabel>
            <Select
              value={tanqueFilter}
              onChange={(e) => setTanqueFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="3">Tanque 3</MenuItem>
              <MenuItem value="4">Tanque 4</MenuItem>
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

      {/* Agregar nueva operación */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => setOpenDialog(true)}
      >
        Agregar Operación
      </Button>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="otras operaciones table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Tanque</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen Observado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen 60</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOperaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((operacion) => (
              <TableRow key={operacion.id}>
                <TableCell>{operacion.tanque_id}</TableCell>
                <TableCell>{operacion.fecha}</TableCell>
                <TableCell>{operacion.descripcion}</TableCell>
                <TableCell>{operacion.volumen_observado}</TableCell>
                <TableCell>{operacion.volumen_60}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(operacion.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(operacion.id)}>
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
        count={filteredOperaciones.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog para agregar/editar operación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Operación" : "Agregar Operación"}</DialogTitle>
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
                <option value={3}>Tanque 3</option>
                <option value={4}>Tanque 4</option>
                <option value={5}>Tanque 5</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha"
                fullWidth
                name="fecha"
                type="datetime-local"
                value={formData.fecha}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
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
                label="Volumen Observado"
                fullWidth
                name="volumen_observado"
                value={formData.volumen_observado}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen 60"
                fullWidth
                name="volumen_60"
                value={formData.volumen_60}
                onChange={handleChange}
                type="number"
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

export default OtrasOperaciones;
