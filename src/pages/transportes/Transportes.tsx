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
  TablePagination,
  Card,
  CardContent,
  CardHeader
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";

// Registro de las operaciones que hacen la gráfica
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BASE_URL = "http://localhost:8080/api";  // URL base de tu API

const Transportes: React.FC = () => {
  const [transportes, setTransportes] = useState<any[]>([]);
  const [cisternas, setCisternas] = useState<any[]>([]);
  const [mesesData, setMesesData] = useState<any[]>([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    fecha: "",
    cisternaId: 0,
    temperaturaCarga: 0,
    temperaturaDescarga: 0,
    volumenCargado: 0,
    volumenCargado60: 0,
    comentario: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [transporteToDelete, setTransporteToDelete] = useState<number | null>(null);
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");
  const [transporteFilter, setTransporteFilter] = useState("");
  const [filteredTransportes, setFilteredTransportes] = useState<any[]>([]);

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data on load
  useEffect(() => {
    // Obtener transportes
    axios.get(`${BASE_URL}/transportes`)
      .then(response => {
        setTransportes(response.data)
        setFilteredTransportes(response.data);
      })
      .catch(error => console.error("Error fetching transportes:", error));

    // Obtener cisternas
    axios.get(`${BASE_URL}/cisternas`)
      .then(response => {
        setCisternas(response.data);
      })
      .catch(error => console.error("Error fetching cisternas:", error));

    // Obtener los datos por mes
    axios.get(`${BASE_URL}/transportes/meses`)
      .then(response => {
        setMesesData(response.data);
      })
      .catch(error => console.error("Error fetching meses data:", error));
  }, []);

  const handleSearch = () => {
    const filtered = transportes.filter((transporte) => {
      // Filtro por cisterna
      const cisternaMatch = transporteFilter ? transporte.cisterna.id === parseInt(transporteFilter, 10) : true;

      // Filtro por fecha (inicio y fin)
      const fechaMatch =
        (fechaInicioFilter ? new Date(transporte.fecha) >= new Date(fechaInicioFilter) : true) &&
        (fechaFinFilter ? new Date(transporte.fecha) <= new Date(fechaFinFilter) : true);

      return cisternaMatch && fechaMatch;
    });

    setFilteredTransportes(filtered);  // Actualizar el estado con los resultados filtrados
  };

  // Manejador de cambios para los campos de formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name!]: value,  // Asegúrate de que 'name' no sea undefined
    }));
  };


  const handleOpenDialog = (transporteId: number | null) => {
    if (transporteId !== null) {
      const transporteToEdit = transportes.find((t) => t.id === transporteId);
      if (transporteToEdit) {

        setFormData({
          ...transporteToEdit,
          cisternaId: transporteToEdit.cisterna.id, // Asegúrate de que cisternaId se asigne correctamente
        });

        setIsEditing(true);
      }
    } else {
      setFormData({
        id: 0,
        fecha: "",
        cisternaId: 0,
        temperaturaCarga: 0,
        temperaturaDescarga: 0,
        volumenCargado: 0,
        volumenCargado60: 0,
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
      // Si estamos editando, realizamos un PUT para actualizar el transporte
      axios.put(`${BASE_URL}/transportes/${formData.id}`, formData)
        .then(response => {
          // Actualizamos el estado con el transporte modificado
          setTransportes(
            transportes.map((transporte) =>
              transporte.id === formData.id ? { ...response.data } : transporte
            )
          );
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error updating transporte:', error);
          alert("Error al actualizar el transporte");
        });
    } else {
      // Si estamos agregando, realizamos un POST para crear un nuevo transporte
      axios.post(`${BASE_URL}/transportes`, formData)
        .then(response => {
          // Añadimos el nuevo transporte a la lista
          setTransportes([...transportes, response.data]);
          setOpenDialog(false);
        })
        .catch(error => {
          console.error('Error adding transporte:', error);
          alert("Error al agregar el transporte");
        });
    }
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
      axios.delete(`${BASE_URL}/transportes/${transporteToDelete}`)
        .then(response => {
          console.log('Delete response:', response);
          setTransportes(transportes.filter((o) => o.id !== transporteToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => console.error('Error deleting operación:', error));
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  // Datos del gráfico
  const chartData = {
    labels: mesesData.map((mes: any) => mes[0]),  // Año-Mes
    datasets: [
      {
        label: "Transportes Realizados",
        data: mesesData.map((mes: any) => mes[1]), // Número de transportes
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        min: 0,  // Configura el valor mínimo en 0
        max: 60,  // Configura el valor máximo en 100
      },
    },
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
                {filteredTransportes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transporte) => (
                  <TableRow key={transporte.id}>
                    <TableCell>{transporte.fecha}</TableCell>
                    <TableCell>{transporte.cisterna.placa}</TableCell>
                    <TableCell>{transporte.volumenCargado}</TableCell>
                    <TableCell>{transporte.temperaturaCarga}</TableCell>
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
            count={filteredTransportes.length}
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
                  <Line data={chartData} options={chartOptions}/>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{formData.id ? "Editar Transporte" : "Agregar Transporte"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Campo de fecha */}
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

            {/* Campo de cisterna */}
            <Grid item xs={12}>
              <TextField
                label="Cisterna"
                fullWidth
                name="cisternaId"
                value={formData.cisternaId}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
              >
                {cisternas.map((cisterna) => (
                  <option key={cisterna.id} value={cisterna.id}>
                    {`${cisterna.id} - Placa ${cisterna.placa}`}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Campo de temperatura de carga */}
            <Grid item xs={12}>
              <TextField
                label="Temperatura de Carga"
                fullWidth
                name="temperaturaCarga"
                value={formData.temperaturaCarga}
                onChange={handleChange}
              />
            </Grid>

            {/* Campo de temperatura de descarga */}
            <Grid item xs={12}>
              <TextField
                label="Temperatura de Descarga"
                fullWidth
                name="temperaturaDescarga"
                value={formData.temperaturaDescarga}
                onChange={handleChange}
              />
            </Grid>

            {/* Campo de volumen cargado */}
            <Grid item xs={12}>
              <TextField
                label="Volumen Cargado"
                fullWidth
                name="volumenCargado"
                value={formData.volumenCargado}
                onChange={handleChange}
              />
            </Grid>

            {/* Campo de volumen 60 */}
            <Grid item xs={12}>
              <TextField
                label="Volumen 60"
                fullWidth
                name="volumenCargado60"
                value={formData.volumenCargado60}
                onChange={handleChange}
              />
            </Grid>

            {/* Campo de comentario */}
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
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            {formData.id ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar este transporte? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default Transportes;
