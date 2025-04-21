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

const ConsumoTanque: React.FC = () => {
  const [consumos, setConsumos] = useState<any[]>([]);
  const [tanques, setTanques] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    tanqueId: 0,
    volumenConsumido: 0,
    volumen60: 0,
    fecha: "",
    motivoConsumo: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [consumoToDelete, setConsumoToDelete] = useState<number | null>(null);
  const [tanqueFilter, setTanqueFilter] = useState("");
  const [motivoFilter, setMotivoFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredConsumos, setFilteredConsumos] = useState<any[]>([]);

  // Fetch data on load
  useEffect(() => {
    // Fetch consumos data
    axios.get(`${BASE_URL}/consumos`)
      .then(response => {
        setConsumos(response.data);
        setFilteredConsumos(response.data);
      })
      .catch(error => console.error("Error fetching consumos:", error));

    // Fetch tanques data
    axios.get(`${BASE_URL}/tanques`)
      .then(response => {
        setTanques(response.data);
      })
      .catch(error => console.error("Error fetching tanques:", error));
  }, []);

  const handleSearch = () => {
    const filtered = consumos.filter((consumo) => {
      const tanqueMatch = tanqueFilter ? consumo.tanque.id === parseInt(tanqueFilter, 10) : true;
      const motivoMatch = motivoFilter ? consumo.motivoConsumo.toLowerCase().includes(motivoFilter.toLowerCase()) : true;
      const fechaMatch =
        (fechaInicioFilter ? new Date(consumo.fecha) >= new Date(fechaInicioFilter) : true) &&
        (fechaFinFilter ? new Date(consumo.fecha) <= new Date(fechaFinFilter) : true);

      return tanqueMatch && motivoMatch && fechaMatch;
    });
    setFilteredConsumos(filtered);
  };

  const handleOpenDialog = (consumoId: number | null) => {
    if (consumoId !== null) {
      const consumoToEdit = consumos.find((c) => c.id === consumoId);
      if (consumoToEdit) {
        setFormData({
          ...consumoToEdit,
          tanqueId: consumoToEdit.tanque.id, // Asegúrate de que tanqueId se asigne correctamente
        });
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        tanqueId: 0,
        volumenConsumido: 0,
        volumen60: 0,
        fecha: "",
        motivoConsumo: ""
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
      // Update consumo
      axios.put(`${BASE_URL}/consumos/${formData.id}`, formData)
        .then(response => {
          setConsumos(consumos.map((consumo) => consumo.id === formData.id ? { ...formData } : consumo));
          setOpenDialog(false);
        })
        .catch(error => console.error('Error updating consumo:', error));
    } else {
      // Create new consumo
      axios.post(`${BASE_URL}/consumos`, formData)
        .then(response => {
          setConsumos([...consumos, response.data]);
          setOpenDialog(false);
        })
        .catch(error => console.error('Error adding consumo:', error));
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setConsumoToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setConsumoToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (consumoToDelete !== null) {
      axios.delete(`${BASE_URL}/consumos/${consumoToDelete}`)
        .then(response => {
          setConsumos(consumos.filter((c) => c.id !== consumoToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => console.error('Error deleting consumo:', error));
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
        Gestión de Consumo de Tanques
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Motivo de Consumo"
            fullWidth
            value={motivoFilter}
            onChange={(e) => setMotivoFilter(e.target.value)}
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

      {/* Agregar nuevo consumo */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => setOpenDialog(true)}
      >
        Agregar Consumo
      </Button>

      {/* Tabla de Consumos */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="consumos table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Tanque</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen Consumido</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen 60</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Motivo de Consumo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConsumos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((consumo) => (
              <TableRow key={consumo.id}>
                <TableCell>{`${consumo.tanque.id} - Tanque ${consumo.tanque.codigo}`}</TableCell>
                <TableCell>{consumo.volumenConsumido}</TableCell>
                <TableCell>{consumo.volumen60}</TableCell>
                <TableCell>{consumo.motivoConsumo}</TableCell>
                <TableCell>{consumo.fecha}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(consumo.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(consumo.id)}>
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
        count={filteredConsumos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialogo para agregar/editar consumo */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{formData.id ? "Editar Consumo" : "Agregar Consumo"}</DialogTitle>
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
                label="Volumen Consumido"
                fullWidth
                name="volumenConsumido"
                value={formData.volumenConsumido}
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
                label="Motivo de Consumo"
                fullWidth
                name="motivoConsumo"
                value={formData.motivoConsumo}
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
            ¿Estás seguro de que deseas eliminar este consumo? Esta acción no se puede deshacer.
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

export default ConsumoTanque;
