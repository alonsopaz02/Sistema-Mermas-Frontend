import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Colores para pie chart
const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#f44336"];

// === Datos Dummy ===

const transporteMerma = [
  { fecha: "01-01", merma: 180 },
  { fecha: "01-02", merma: 120 },
  { fecha: "01-03", merma: 250 },
  { fecha: "01-04", merma: 100 },
  { fecha: "01-05", merma: 200 },
];

const mermaPorTipo = [
  { name: "Transporte", value: 780 },
  { name: "Tanques", value: 520 },
];

const tanquesMerma = [
  { nombre: "Tanque A", merma: 300 },
  { nombre: "Tanque B", merma: 180 },
  { nombre: "Tanque C", merma: 90 },
  { nombre: "Tanque D", merma: 120 },
];

const cisternasResumen = [
  { placa: "CIS-001", volumen: 20000, merma: 320 },
  { placa: "CIS-002", volumen: 25000, merma: 180 },
  { placa: "CIS-003", volumen: 19000, merma: 220 },
  { placa: "CIS-004", volumen: 15000, merma: 60 },
  { placa: "CIS-005", volumen: 23000, merma: 140 },
];

const temperaturaPorDia = [
  { dia: "Lun", temperatura: 21.5 },
  { dia: "Mar", temperatura: 23.2 },
  { dia: "Mié", temperatura: 22.8 },
  { dia: "Jue", temperatura: 24.1 },
  { dia: "Vie", temperatura: 25.0 },
  { dia: "Sáb", temperatura: 26.5 },
  { dia: "Dom", temperatura: 23.8 },
];

const temperaturaRangos = [
  { name: "< 20°C", value: 3 },
  { name: "20–25°C", value: 10 },
  { name: "> 25°C", value: 4 },
];

const inventarioComparativo = [
  { fecha: "01-01", observado: 19500, ug6: 19250 },
  { fecha: "01-02", observado: 20300, ug6: 20000 },
  { fecha: "01-03", observado: 19800, ug6: 19600 },
  { fecha: "01-04", observado: 20500, ug6: 20280 },
  { fecha: "01-05", observado: 20000, ug6: 19840 },
];

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 4, fontFamily: "'Montserrat', sans-serif" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard de Merma de Combustible
      </Typography>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Merma Transporte", value: "870 L", color: "error.main" },
          { label: "Merma Tanques", value: "690 L", color: "warning.main" },
          { label: "Volumen Transportado", value: "58,000 L" },
          { label: "Temp. Promedio (7 días)", value: "23.5 °C" },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle1">{kpi.label}</Typography>
              <Typography variant="h6" color={kpi.color || "text.primary"}>
                {kpi.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Línea de merma */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Merma diaria por transporte</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={transporteMerma}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="merma" stroke="#1976d2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie de merma por tipo */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Distribución de Merma</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mermaPorTipo}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {mermaPorTipo.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Barras cisternas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Cisternas con mayor merma</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cisternasResumen} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="placa" type="category" />
                <Tooltip />
                <Bar dataKey="merma" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tabla cisternas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Resumen de Cisternas</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Placa</TableCell>
                  <TableCell>Volumen</TableCell>
                  <TableCell>Merma</TableCell>
                  <TableCell>% Merma</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cisternasResumen.map((c) => (
                  <TableRow key={c.placa}>
                    <TableCell>{c.placa}</TableCell>
                    <TableCell>{c.volumen}</TableCell>
                    <TableCell>{c.merma}</TableCell>
                    <TableCell>{((c.merma / c.volumen) * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Línea temperatura */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Temperatura promedio por día</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={temperaturaPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperatura" stroke="#ff9800" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie temperatura */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Distribución por rangos de temperatura</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={temperaturaRangos} dataKey="value" nameKey="name" outerRadius={80} label>
                  {temperaturaRangos.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Área comparativa de inventario */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Inventario Observado vs UG6</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={inventarioComparativo}>
                <defs>
                  <linearGradient id="colorObs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUG6" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="observado" stroke="#1976d2" fillOpacity={1} fill="url(#colorObs)" />
                <Area type="monotone" dataKey="ug6" stroke="#4caf50" fillOpacity={1} fill="url(#colorUG6)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
