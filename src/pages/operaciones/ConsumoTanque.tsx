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

// Datos dummy para los consumos de tanque
const initialConsumos = [
  { id: 1, tanque_id: 3, volumen_consumido: 6.50, volumen_60: 6.54, fecha: "2023-01-01 14:34:00", motivo_consumo: "Mantenimiento de equipos" },
  { id: 2, tanque_id: 3, volumen_consumido: 22.23, volumen_60: 22.36, fecha: "2023-01-02 11:29:00", motivo_consumo: "Operacion de generadores" },
  { id: 3, tanque_id: 3, volumen_consumido: 30.05, volumen_60: 30.23, fecha: "2023-01-03 12:00:00", motivo_consumo: "Operacion de generadores" },
  { id: 4, tanque_id: 3, volumen_consumido: 14.02, volumen_60: 14.10, fecha: "2023-01-04 12:02:00", motivo_consumo: "Mantenimiento de equipos" },
  { id: 5, tanque_id: 4, volumen_consumido: 11.03, volumen_60: 11.09, fecha: "2023-01-05 10:55:00", motivo_consumo: "Mantenimiento de equipos" },
  { id: 6, tanque_id: 3, volumen_consumido: 8.40, volumen_60: 8.45, fecha: "2023-01-06 15:31:00", motivo_consumo: "Limpieza de tanques" },
  { id: 7, tanque_id: 4, volumen_consumido: 4.50, volumen_60: 4.52, fecha: "2023-01-06 15:47:00", motivo_consumo: "Mantenimiento de equipos" },
  { id: 8, tanque_id: 4, volumen_consumido: 11.28, volumen_60: 11.35, fecha: "2023-01-08 11:01:00", motivo_consumo: "Limpieza de tanques" },
  { id: 9, tanque_id: 3, volumen_consumido: 21.00, volumen_60: 21.13, fecha: "2023-01-09 12:17:00", motivo_consumo: "Operacion de generadores" },
  { id: 10, tanque_id: 3, volumen_consumido: 11.47, volumen_60: 11.54, fecha: "2023-01-10 12:17:00", motivo_consumo: "Operacion de generadores" },
  { id: 11, tanque_id: 3, volumen_consumido: 58.19, volumen_60: 58.58, fecha: "2023-01-11 14:24:00", motivo_consumo: "Limpieza de tanques" },
  { id: 12, tanque_id: 4, volumen_consumido: 23.59, volumen_60: 23.75, fecha: "2023-01-12 12:48:00", motivo_consumo: "Limpieza de tanques" },
  { id: 13, tanque_id: 4, volumen_consumido: 14.03, volumen_60: 14.11, fecha: "2023-01-13 11:26:00", motivo_consumo: "Limpieza de tanques" },
  { id: 14, tanque_id: 3, volumen_consumido: 4.99, volumen_60: 5.02, fecha: "2023-01-14 11:12:00", motivo_consumo: "Pruebas de consumo" },
  { id: 15, tanque_id: 4, volumen_consumido: 31.70, volumen_60: 31.92, fecha: "2023-01-15 10:28:00", motivo_consumo: "Pruebas de consumo" }
];

const ConsumoTanque: React.FC = () => {
  const [consumos, setConsumos] = useState(initialConsumos);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    tanque_id: 0,
    volumen_consumido: 0,
    volumen_60: 0,
    fecha: "",
    motivo_consumo: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [consumoToDelete, setConsumoToDelete] = useState<number | null>(null);

  // Filtros
  const [tanqueFilter, setTanqueFilter] = useState("");
  const [motivoFilter, setMotivoFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredConsumos, setFilteredConsumos] = useState(initialConsumos);

  // Handle search button click
  const handleSearch = () => {
    const filtered = initialConsumos.filter((consumo) => {
      const tanqueMatch = tanqueFilter ? consumo.tanque_id.toString() === tanqueFilter : true;
      const motivoMatch = motivoFilter ? consumo.motivo_consumo.toLowerCase().includes(motivoFilter.toLowerCase()) : true;
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
        setFormData(consumoToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        tanque_id: 0,
        volumen_consumido: 0,
        volumen_60: 0,
        fecha: "",
        motivo_consumo: ""
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
      setConsumos(
        consumos.map((consumo) =>
          consumo.id === formData.id ? { ...formData } : consumo
        )
      );
    } else {
      const newConsumo = { ...formData, id: Date.now() };
      setConsumos([...consumos, newConsumo]);
    }
    setOpenDialog(false);
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
      setConsumos(consumos.filter((c) => c.id !== consumoToDelete));
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
              <MenuItem value="3">Tanque 3</MenuItem>
              <MenuItem value="4">Tanque 4</MenuItem>
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

      {/* Confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar este consumo? Esta acción no se puede deshacer.
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

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="consumos table">
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
                <TableCell>{`Tanque ${consumo.tanque_id}`}</TableCell>
                <TableCell>{consumo.volumen_consumido}</TableCell>
                <TableCell>{consumo.volumen_60}</TableCell>
                <TableCell>{consumo.motivo_consumo}</TableCell>
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

      {/* Dialog para agregar/editar consumo */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Consumo" : "Agregar Consumo"}</DialogTitle>
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
                <option value={4}>Tanque 4</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen Consumido"
                fullWidth
                name="volumen_consumido"
                value={formData.volumen_consumido}
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
                label="Motivo de Consumo"
                fullWidth
                name="motivo_consumo"
                value={formData.motivo_consumo}
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

export default ConsumoTanque;
