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

const OtrasOperaciones: React.FC = () => {
  const [otrasOperaciones, setOtrasOperaciones] = useState<any[]>([]);
  const [tanques, setTanques] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    tanqueId: 0,
    fecha: "",
    descripcion: "",
    volumenObservado: 0,
    volumen60: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [operacionToDelete, setOperacionToDelete] = useState<number | null>(null);
  const [tanqueFilter, setTanqueFilter] = useState("");
  const [descripcionFilter, setDescripcionFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredOtrasOperaciones, setFilteredOtrasOperaciones] = useState<any[]>([]);

  // Fetch data on load
  useEffect(() => {
    // Fetch otras operaciones data
    axios.get(`${BASE_URL}/otras-operaciones`)
      .then(response => {
        setOtrasOperaciones(response.data);
        setFilteredOtrasOperaciones(response.data);
      })
      .catch(error => console.error("Error fetching otras operaciones:", error));

    // Fetch tanques data
    axios.get(`${BASE_URL}/tanques`)
      .then(response => {
        setTanques(response.data);
      })
      .catch(error => console.error("Error fetching tanques:", error));
  }, []);

  const handleSearch = () => {
    const filtered = otrasOperaciones.filter((operacion) => {
      const tanqueMatch = tanqueFilter ? operacion.tanque.id === parseInt(tanqueFilter, 10) : true;
      const descripcionMatch = descripcionFilter ? operacion.descripcion.toLowerCase().includes(descripcionFilter.toLowerCase()) : true;
      const fechaMatch =
        (fechaInicioFilter ? new Date(operacion.fecha) >= new Date(fechaInicioFilter) : true) &&
        (fechaFinFilter ? new Date(operacion.fecha) <= new Date(fechaFinFilter) : true);

      return tanqueMatch && descripcionMatch && fechaMatch;
    });
    setFilteredOtrasOperaciones(filtered);
  };

  const handleOpenDialog = (operacionId: number | null) => {
    if (operacionId !== null) {
      const operacionToEdit = otrasOperaciones.find((o) => o.id === operacionId);
      if (operacionToEdit) {
        setFormData({
          ...operacionToEdit,
          tanqueId: operacionToEdit.tanque.id, // Asegúrate de que tanqueId se asigne correctamente
        });
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        tanqueId: 0,
        fecha: "",
        descripcion: "",
        volumenObservado: 0,
        volumen60: 0
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
      // Update operación
      axios.put(`${BASE_URL}/otras-operaciones/${formData.id}`, formData)
        .then(response => {
          setOtrasOperaciones(otrasOperaciones.map((operacion) => operacion.id === formData.id ? { ...formData } : operacion));
          setOpenDialog(false);
        })
        .catch(error => console.error('Error updating operación:', error));
    } else {
      // Create new operación
      axios.post(`${BASE_URL}/otras-operaciones`, formData)
        .then(response => {
          setOtrasOperaciones([...otrasOperaciones, response.data]);
          setOpenDialog(false);
        })
        .catch(error => console.error('Error adding operación:', error));
    }
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
      axios.delete(`${BASE_URL}/otras-operaciones/${operacionToDelete}`)
        .then(response => {
          setOtrasOperaciones(otrasOperaciones.filter((o) => o.id !== operacionToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => console.error('Error deleting operación:', error));
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
          <TextField
            label="Motivo de Operación"
            fullWidth
            value={descripcionFilter}
            onChange={(e) => setDescripcionFilter(e.target.value)}
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
                  {`Tanque ${tanque.codigo} - ${tanque.estacion.nombre}`}
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

      {/* Agregar nueva operación */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => setOpenDialog(true)}
      >
        Agregar Otras Operación
      </Button>

      {/* Tabla de Operaciones */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="otras operaciones table">
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
            {filteredOtrasOperaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((operacion) => (
              <TableRow key={operacion.id}>
                <TableCell>{`${operacion.tanque.codigo}`}</TableCell>
                <TableCell>{operacion.fecha}</TableCell>
                <TableCell>{operacion.descripcion}</TableCell>
                <TableCell>{operacion.volumenObservado}</TableCell>
                <TableCell>{operacion.volumen60}</TableCell>
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
        count={filteredOtrasOperaciones.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialogo para agregar/editar operación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{formData.id ? "Editar Otras Operación" : "Agregar Otras Operación"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tanque"
                fullWidth
                name="tanqueId"
                value={formData.tanqueId}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
              >
                {tanques.map((tanque) => (
                  <option key={tanque.id} value={tanque.id}>
                    {`${tanque.id} - Tanque ${tanque.codigo}`}
                  </option>
                ))}
              </TextField>
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
                name="volumenObservado"
                value={formData.volumenObservado}
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
                label="Fecha"
                fullWidth
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
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
            ¿Estás seguro de que deseas eliminar esta operación? Esta acción no se puede deshacer.
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

export default OtrasOperaciones;
