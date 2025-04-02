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

// Datos dummy para las descargas
const initialDescargas = [
  { id: 1, transporte_id: 1, tanque_id: 1, volumen_descargado: 29255.1, volumen_60: 29459.6, fecha: "2023-01-01 12:08:00", descripcion: "" },
  { id: 2, transporte_id: 2, tanque_id: 2, volumen_descargado: 29664.5, volumen_60: 29855.1, fecha: "2023-01-02 10:02:00", descripcion: "" },
  { id: 3, transporte_id: 3, tanque_id: 1, volumen_descargado: 19783.1, volumen_60: 19810.7, fecha: "2023-01-03 15:34:00", descripcion: "" },
  { id: 4, transporte_id: 4, tanque_id: 2, volumen_descargado: 19618.7, volumen_60: 19700, fecha: "2023-01-04 11:02:00", descripcion: "" },
  { id: 5, transporte_id: 5, tanque_id: 1, volumen_descargado: 29341.2, volumen_60: 29475.6, fecha: "2023-01-05 12:00:00", descripcion: "" },
  { id: 6, transporte_id: 6, tanque_id: 3, volumen_descargado: 9765.9, volumen_60: 9782.84, fecha: "2023-01-05 12:02:00", descripcion: "" },
  { id: 7, transporte_id: 7, tanque_id: 3, volumen_descargado: 9749.2, volumen_60: 9761.48, fecha: "2023-01-06 12:59:00", descripcion: "" },
  { id: 8, transporte_id: 8, tanque_id: 4, volumen_descargado: 19822, volumen_60: 19886, fecha: "2023-01-06 10:31:00", descripcion: "" },
  { id: 9, transporte_id: 9, tanque_id: 1, volumen_descargado: 29602.7, volumen_60: 29659.3, fecha: "2023-01-07 11:41:00", descripcion: "" },
  { id: 10, transporte_id: 10, tanque_id: 2, volumen_descargado: 29437.2, volumen_60: 29580.7, fecha: "2023-01-07 10:14:00", descripcion: "" },
  { id: 11, transporte_id: 11, tanque_id: 2, volumen_descargado: 39005.9, volumen_60: 39119.9, fecha: "2023-01-08 15:32:00", descripcion: "" },
  { id: 12, transporte_id: 12, tanque_id: 3, volumen_descargado: 9755, volumen_60: 9775, fecha: "2023-01-08 10:37:00", descripcion: "" },
  { id: 13, transporte_id: 13, tanque_id: 1, volumen_descargado: 59241.8, volumen_60: 59104.3, fecha: "2023-01-10 15:38:00", descripcion: "" }
];

const Descarga: React.FC = () => {
  const [descargas, setDescargas] = useState(initialDescargas);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    transporte_id: 0,
    tanque_id: 0,
    volumen_descargado: 0,
    volumen_60: 0,
    fecha: "",
    descripcion: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [descargaToDelete, setDescargaToDelete] = useState<number | null>(null);

  // Filtros
  const [transporteFilter, setTransporteFilter] = useState("");
  const [tanqueFilter, setTanqueFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredDescargas, setFilteredDescargas] = useState(initialDescargas);

  // Handle search button click
  const handleSearch = () => {
    const filtered = initialDescargas.filter((descarga) => {
      const transporteMatch = descarga.transporte_id.toString().includes(transporteFilter);
      const tanqueMatch = tanqueFilter ? descarga.tanque_id.toString() === tanqueFilter : true;
      const fechaMatch =
        (fechaInicioFilter ? new Date(descarga.fecha) >= new Date(fechaInicioFilter) : true) &&
        (fechaFinFilter ? new Date(descarga.fecha) <= new Date(fechaFinFilter) : true);

      return transporteMatch && tanqueMatch && fechaMatch;
    });
    setFilteredDescargas(filtered);
  };

  const handleOpenDialog = (descargaId: number | null) => {
    if (descargaId !== null) {
      const descargaToEdit = descargas.find((d) => d.id === descargaId);
      if (descargaToEdit) {
        setFormData(descargaToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        transporte_id: 0,
        tanque_id: 0,
        volumen_descargado: 0,
        volumen_60: 0,
        fecha: "",
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
      setDescargas(
        descargas.map((descarga) =>
          descarga.id === formData.id ? { ...formData } : descarga
        )
      );
    } else {
      const newDescarga = { ...formData, id: Date.now() };
      setDescargas([...descargas, newDescarga]);
    }
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDescargaToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDescargaToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (descargaToDelete !== null) {
      setDescargas(descargas.filter((d) => d.id !== descargaToDelete));
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
        Gestión de Descargas
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Buscar Transporte"
            fullWidth
            value={transporteFilter}
            onChange={(e) => setTransporteFilter(e.target.value)}
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

      {/* Agregar nueva descarga */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => setOpenDialog(true)}
      >
        Agregar Descarga
      </Button>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="descargas table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Transporte</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tanque</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen Descargado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Volumen 60</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDescargas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((descarga) => (
              <TableRow key={descarga.id}>
                <TableCell>{descarga.transporte_id}</TableCell>
                <TableCell>{descarga.tanque_id}</TableCell>
                <TableCell>{descarga.volumen_descargado}</TableCell>
                <TableCell>{descarga.volumen_60}</TableCell>
                <TableCell>{descarga.fecha}</TableCell>
                <TableCell width="150px">
                  <IconButton onClick={() => handleOpenDialog(descarga.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(descarga.id)}>
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
        count={filteredDescargas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog para agregar/editar descarga */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Descarga" : "Agregar Descarga"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Transporte"
                fullWidth
                name="transporte_id"
                value={formData.transporte_id}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
              >
                <option value={1}>Transporte 1</option>
                <option value={2}>Transporte 2</option>
                <option value={3}>Transporte 3</option>
                <option value={4}>Transporte 4</option>
              </TextField>
            </Grid>
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
                label="Volumen Descargado"
                fullWidth
                name="volumen_descargado"
                type="number"
                value={formData.volumen_descargado}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen 60"
                fullWidth
                name="volumen_60"
                type="number"
                value={formData.volumen_60}
                onChange={handleChange}
              />
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

export default Descarga;
