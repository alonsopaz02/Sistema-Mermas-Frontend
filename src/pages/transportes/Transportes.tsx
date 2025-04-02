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
  TablePagination,
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress
} from "@mui/material";
import { Edit, Delete, Add, Search, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registro de las operaciones que hacen la gráfica
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Datos dummy para transportes
const initialTransportes = [
  { id: 1, fecha: "2023-01-01 13:56:00", cisterna_id: 2, temperatura_carga: 45, temperatura_descarga: 46, volumen_cargado: 29600, volumen_cargado_60: 29442.8, comentario: "aaa" },
  { id: 2, fecha: "2023-01-02 13:20:00", cisterna_id: 1, temperatura_carga: 47, temperatura_descarga: 49, volumen_cargado: 30000, volumen_cargado_60: 29842.1, comentario: "bbbb" },
  { id: 3, fecha: "2023-01-03 11:26:00", cisterna_id: 1, temperatura_carga: 50, temperatura_descarga: 43, volumen_cargado: 19900, volumen_cargado_60: 19789.6, comentario: "cccc" },
  { id: 4, fecha: "2023-01-04 12:57:00", cisterna_id: 4, temperatura_carga: 45, temperatura_descarga: 46, volumen_cargado: 19800, volumen_cargado_60: 19689.7, comentario: "ddd" },
  { id: 5, fecha: "2023-01-05 13:23:00", cisterna_id: 1, temperatura_carga: 48, temperatura_descarga: 48, volumen_cargado: 29600, volumen_cargado_60: 29448.3, comentario: "eeee" },
  { id: 6, fecha: "2023-01-05 13:46:00", cisterna_id: 4, temperatura_carga: 44, temperatura_descarga: 48, volumen_cargado: 9800, volumen_cargado_60: 9751.49, comentario: "fffff" },
  { id: 7, fecha: "2023-01-06 11:01:00", cisterna_id: 1, temperatura_carga: 50, temperatura_descarga: 50, volumen_cargado: 9800, volumen_cargado_60: 9753.84, comentario: "gggg" },
  { id: 8, fecha: "2023-01-06 13:00:00", cisterna_id: 1, temperatura_carga: 47, temperatura_descarga: 48, volumen_cargado: 20000, volumen_cargado_60: 19913.9, comentario: "hhhh" },
  { id: 9, fecha: "2023-01-07 13:16:00", cisterna_id: 2, temperatura_carga: 45, temperatura_descarga: 45, volumen_cargado: 29800, volumen_cargado_60: 29661.6, comentario: "iiiiii" },
  { id: 10, fecha: "2023-01-07 11:44:00", cisterna_id: 2, temperatura_carga: 47, temperatura_descarga: 44, volumen_cargado: 29700, volumen_cargado_60: 29559.8, comentario: "jjjjj" }
];

const Transportes: React.FC = () => {
  const [transportes, setTransportes] = useState(initialTransportes);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    fecha: "",
    cisterna_id: 0,
    temperatura_carga: 0,
    temperatura_descarga: 0,
    volumen_cargado: 0,
    volumen_cargado_60: 0,
    comentario: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [transporteToDelete, setTransporteToDelete] = useState<number | null>(null);

  const [cisternas] = useState([
    { id: 1, placa: "ABC123" },
    { id: 2, placa: "XYZ456" },
    { id: 3, placa: "LMN789" },
    { id: 4, placa: "QRS012" },
  ]);

  // Filtros
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");
  const [transporteFilter, setTransporteFilter] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Manejador de cambios para los campos de formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name!]: value,
    }));
  };

  const handleOpenDialog = (transporteId: number | null) => {
    if (transporteId !== null) {
      const transporteToEdit = transportes.find((t) => t.id === transporteId);
      if (transporteToEdit) {
        setFormData(transporteToEdit);
        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        fecha: "",
        cisterna_id: 0,
        temperatura_carga: 0,
        temperatura_descarga: 0,
        volumen_cargado: 0,
        volumen_cargado_60: 0,
        comentario: ""
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    if (isEditing) {
      setTransportes(
        transportes.map((transporte) =>
          transporte.id === formData.id ? { ...formData } : transporte
        )
      );
    } else {
      const newTransporte = { ...formData, id: Date.now() };
      setTransportes([...transportes, newTransporte]);
    }
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setTransporteToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setTransporteToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (transporteToDelete !== null) {
      setTransportes(transportes.filter((t) => t.id !== transporteToDelete));
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

  // Lógica de búsqueda para los filtros
  const handleSearch = () => {
    let filteredTransportes = initialTransportes;

    if (fechaInicioFilter) {
      filteredTransportes = filteredTransportes.filter((t) =>
        new Date(t.fecha) >= new Date(fechaInicioFilter)
      );
    }

    if (fechaFinFilter) {
      filteredTransportes = filteredTransportes.filter((t) =>
        new Date(t.fecha) <= new Date(fechaFinFilter)
      );
    }

    if (transporteFilter) {
      filteredTransportes = filteredTransportes.filter(
        (t) => t.cisterna_id === Number(transporteFilter)
      );
    }

    setTransportes(filteredTransportes);
  };

  const chartData = {
    labels: ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06", "2023-01-07"],
    datasets: [
      {
        label: "Transportes Realizados",
        data: [1, 2, 1, 1, 2, 3, 1],
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* Lado izquierdo: CRUD de Transportes */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Gestión de Transportes
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Cisterna</InputLabel>
                <Select
                  value={transporteFilter}
                  onChange={(e) => setTransporteFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {cisternas.map((cisterna) => (
                    <MenuItem key={cisterna.id} value={cisterna.id}>
                      {cisterna.placa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
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

          {/* Botón para agregar transporte */}
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            sx={{ mb: 2 }}
            onClick={() => handleOpenDialog(null)} // Abre el formulario vacío
          >
            Agregar Transporte
          </Button>

          {/* Tabla de Transportes */}
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="transportes table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Cisterna</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Volumen Cargado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Temperatura Carga</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Comentario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} width="150px">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transportes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transporte) => (
                  <TableRow key={transporte.id}>
                    <TableCell>{transporte.fecha}</TableCell>
                    <TableCell>{cisternas.find(cisterna => cisterna.id === transporte.cisterna_id)?.placa}</TableCell>
                    <TableCell>{transporte.volumen_cargado}</TableCell>
                    <TableCell>{transporte.temperatura_carga}</TableCell>
                    <TableCell>{transporte.comentario}</TableCell>
                    <TableCell width="150px">
                      <IconButton onClick={() => handleOpenDialog(transporte.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(transporte.id)}>
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
            count={transportes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>

        {/* Lado derecho: Descripción y Tarjeta */}
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: "#e3f2fd", borderRadius: 2 }}>
                <CardHeader
                  title="Transportes Realizados"
                  subheader="Resumen de transportes realizados hasta la fecha"
                  sx={{ backgroundColor: "#90caf9", borderRadius: 2 }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Total Transportes: {transportes.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Un transporte consta de la acción de un camión cisterna propiedad de Numay...
              </Typography>
            </Grid>

            {/* Gráfico de Transportes */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Variación en la cantidad de transportes realizados
                  </Typography>
                  <Line data={chartData} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Dialog para agregar/editar transporte */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Transporte" : "Agregar Transporte"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
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
              <FormControl fullWidth>
                <InputLabel>Cisterna</InputLabel>
                <Select
                  value={formData.cisterna_id}
                  onChange={handleChange}
                  name="cisterna_id"
                >
                  {cisternas.map((cisterna) => (
                    <MenuItem key={cisterna.id} value={cisterna.id}>
                      {cisterna.placa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Temperatura Carga"
                fullWidth
                name="temperatura_carga"
                value={formData.temperatura_carga}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Temperatura Descarga"
                fullWidth
                name="temperatura_descarga"
                value={formData.temperatura_descarga}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen Cargado"
                fullWidth
                name="volumen_cargado"
                value={formData.volumen_cargado}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Volumen 60"
                fullWidth
                name="volumen_cargado_60"
                value={formData.volumen_cargado_60}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comentario"
                fullWidth
                name="comentario"
                value={formData.comentario}
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

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar este transporte?
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

export default Transportes;
