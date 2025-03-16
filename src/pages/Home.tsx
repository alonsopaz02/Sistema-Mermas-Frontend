import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import {
  EvStation,
  Warning,
  Assessment,
  Storage,
  WorkOutline,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Cargar la fuente personalizada desde Google Fonts
const montserratFont = `'Montserrat', sans-serif`;


const Home: React.FC = () => {
  // Datos de ejemplo para los indicadores
  const dashboardData = {
    mermaTotal: "1,200 L",
    combustibleTransportado: "50,000 L",
    eventosTransporte: 120,
    alertasActivas: 5,
    vehiculosActivos: 25,
    tanquesActivos: 10,
    conductoresActivos: 18,
    estacionesActivas: 7,
    reportesGenerados: 15,
    operariosRegistrados: 32,
  };

  // Datos simulados para la tendencia de merma
  const trendData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Merma de Combustible (L)",
        data: [200, 180, 220, 250, 230, 240, 260, 270, 290, 300, 310, 320], // Datos simulados
        borderColor: "#c62828",
        backgroundColor: "rgba(198, 40, 40, 0.2)",
        fill: true,
        tension: 0.3, // Suaviza la línea
      },
    ],
  };

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, fontFamily: montserratFont }}>
      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: montserratFont, mb: 2 }}>
        Dashboard - Resumen General
      </Typography>

      <Grid container spacing={3}>
        {/* Métricas principales */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              bgcolor: "#ffebee",
              color: "#c62828",
              userSelect: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: montserratFont,}}>
                Merma Total
              </Typography>
              <Typography variant="h4">{dashboardData.mermaTotal}</Typography>
              <Warning fontSize="large" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1565c0",
              userSelect: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: montserratFont, }}>
                Combustible Transportado
              </Typography>
              <Typography variant="h4">{dashboardData.combustibleTransportado}</Typography>
              <EvStation fontSize="large" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              bgcolor: "#e8f5e9",
              color: "#2e7d32",
              userSelect: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: montserratFont, }}>
                Eventos de Transporte
              </Typography>
              <Typography variant="h4">{dashboardData.eventosTransporte}</Typography>
              <Assessment fontSize="large" />
            </CardContent>
          </Card>
        </Grid>

        {/* NUEVAS TARJETAS */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              bgcolor: "#f3e5f5",
              color: "#6a1b9a",
              userSelect: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: montserratFont, }}>
                Estaciones Activas
              </Typography>
              <Typography variant="h4">{dashboardData.estacionesActivas}</Typography>
              <Storage fontSize="large" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              bgcolor: "#ffccbc",
              color: "#d84315",
              userSelect: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: montserratFont, }}>
                Reportes Generados
              </Typography>
              <Typography variant="h4">{dashboardData.reportesGenerados}</Typography>
              <Assessment fontSize="large" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              bgcolor: "#c8e6c9",
              color: "#2e7d32",
              userSelect: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: montserratFont, }}>
                Operarios Registrados
              </Typography>
              <Typography variant="h4">{dashboardData.operariosRegistrados}</Typography>
              <WorkOutline fontSize="large" />
            </CardContent>
          </Card>
        </Grid>

           {/* Gráfica de Tendencia de Merma */}
           <Grid item xs={12}>
          <Card sx={{ p: 1, display: "flex", justifyContent: "center", alignItems: "center",transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.01)", boxShadow: "0px 4px 20px rgba(0,0,0,0.2)" }, }}>
            <CardContent sx={{ width: "100%", maxWidth: "900px" ,height:"100%",maxHeight: "320px" }}>
              <Typography variant="h6" sx={{fontFamily: montserratFont}}>Tendencia de Merma (Últimos 12 meses)</Typography>
              <Box sx={{ width: "100%", height: "250px" }}>
                <Line data={trendData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
