import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Dummy data for trend charts (12 months)
const salesData = [
    { month: "Ene", ventas: 5000 },
    { month: "Feb", ventas: 7000 },
    { month: "Mar", ventas: 6000 },
    { month: "Abr", ventas: 4000 },
    { month: "May", ventas: 8000 },
    { month: "Jun", ventas: 6500 },
    { month: "Jul", ventas: 9000 },
    { month: "Ago", ventas: 7500 },
    { month: "Sep", ventas: 6000 },
    { month: "Oct", ventas: 7200 },
    { month: "Nov", ventas: 8500 },
    { month: "Dic", ventas: 9500 },
];

const consumptionData = [
    { month: "Ene", consumo: 3000 },
    { month: "Feb", consumo: 2800 },
    { month: "Mar", consumo: 3300 },
    { month: "Abr", consumo: 3100 },
    { month: "May", consumo: 4000 },
    { month: "Jun", consumo: 3800 },
    { month: "Jul", consumo: 4200 },
    { month: "Ago", consumo: 4500 },
    { month: "Sep", consumo: 3500 },
    { month: "Oct", consumo: 3900 },
    { month: "Nov", consumo: 4600 },
    { month: "Dic", consumo: 5000 },
];

const otherOperationsData = [
    { month: "Ene", operaciones: 2000 },
    { month: "Feb", operaciones: 1500 },
    { month: "Mar", operaciones: 1800 },
    { month: "Abr", operaciones: 2100 },
    { month: "May", operaciones: 2200 },
    { month: "Jun", operaciones: 2500 },
    { month: "Jul", operaciones: 2300 },
    { month: "Ago", operaciones: 2600 },
    { month: "Sep", operaciones: 2400 },
    { month: "Oct", operaciones: 2700 },
    { month: "Nov", operaciones: 2900 },
    { month: "Dic", operaciones: 3200 },
];

const descargaData = [
    { month: "Ene", descarga: 12000 },
    { month: "Feb", descarga: 11000 },
    { month: "Mar", descarga: 13000 },
    { month: "Abr", descarga: 14000 },
    { month: "May", descarga: 13500 },
    { month: "Jun", descarga: 14500 },
    { month: "Jul", descarga: 15000 },
    { month: "Ago", descarga: 16000 },
    { month: "Sep", descarga: 15500 },
    { month: "Oct", descarga: 16500 },
    { month: "Nov", descarga: 17000 },
    { month: "Dic", descarga: 18000 },
];

// OperacionesMenu component
const OperacionesMenu: React.FC = () => {
        const navigate = useNavigate();

        const handleNavigateTo = (path: string) => {
                navigate(path);
        };

        return (
                <Box sx={{ p: 2, overflow: "hidden", width: "100%", height: "100%" }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>Operaciones Disponibles</Typography>
                        
                        {/* Operation Cards */}
                        <Grid container spacing={1.5}>
                                {/* Operación 1 - Venta */}
                                <Grid item xs={12} md={6}>
                                        <Card sx={{ height: "100%", backgroundColor: "#c8e6c9" }}>
                                                <CardContent>
                                                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>Venta</Typography>
                                                        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                                                                Registra las ventas de combustible desde los tanques a los clientes o trabajadores de la operación minera Yanacocha. Esta operación reduce la cantidad de combustible disponible en el tanque asociado.
                                                        </Typography>
                                                        <Button
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleNavigateTo("ventas")}
                                                                endIcon={<ArrowForward />}
                                                                sx={{ mb: 1 }}
                                                        >
                                                                Ver Detalles
                                                        </Button>
                                                        <ResponsiveContainer width="100%" height={175}>
                                                                <LineChart data={salesData}>
                                                                        <CartesianGrid strokeDasharray="3 3" />
                                                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                                                        <YAxis tick={{ fontSize: 12 }} />
                                                                        <Tooltip />
                                                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                                                        <Line type="monotone" dataKey="ventas" stroke="#388e3c" />
                                                                </LineChart>
                                                        </ResponsiveContainer>
                                                </CardContent>
                                        </Card>
                                </Grid>

                                {/* Operación 2 - Consumo de Tanque */}
                                <Grid item xs={12} md={6}>
                                        <Card sx={{ height: "100%", backgroundColor: "#ffe0b2" }}>
                                                <CardContent>
                                                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>Consumo de Tanque</Typography>
                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                                Registra el consumo interno de combustible en los tanques, como el mantenimiento y otras actividades operativas. Esta operación reduce la cantidad de combustible disponible en el tanque asociado.
                                                        </Typography>
                                                        <Button
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleNavigateTo("consumos-propios")}
                                                                endIcon={<ArrowForward />}
                                                                sx={{ mb: 1 }}
                                                        >
                                                                Ver Detalles
                                                        </Button>
                                                        <ResponsiveContainer width="100%" height={175}>
                                                                <LineChart data={consumptionData}>
                                                                        <CartesianGrid strokeDasharray="3 3" />
                                                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                                                        <YAxis tick={{ fontSize: 12 }} />
                                                                        <Tooltip />
                                                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                                                        <Line type="monotone" dataKey="consumo" stroke="#ff9800" />
                                                                </LineChart>
                                                        </ResponsiveContainer>
                                                </CardContent>
                                        </Card>
                                </Grid>

                                {/* Operación 3 - Otras Operaciones */}
                                <Grid item xs={12} md={6}>
                                        <Card sx={{ height: "100%", backgroundColor: "#e1bee7" }}>
                                                <CardContent>
                                                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>Otras Operaciones</Typography>
                                                        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                                                                Registra las operaciones que suman o restan combustible a los tanques, como ajustes o recargas. Esta operación modifica la cantidad de combustible disponible en el tanque asociado.
                                                        </Typography>
                                                        <Button
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleNavigateTo("otras-operaciones")}
                                                                endIcon={<ArrowForward />}
                                                                sx={{ mb: 1 }}
                                                        >
                                                                Ver Detalles
                                                        </Button>
                                                        <ResponsiveContainer width="100%" height={175}>
                                                                <LineChart data={otherOperationsData}>
                                                                        <CartesianGrid strokeDasharray="3 3" />
                                                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                                                        <YAxis tick={{ fontSize: 12 }} />
                                                                        <Tooltip />
                                                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                                                        <Line type="monotone" dataKey="operaciones" stroke="#9c27b0" />
                                                                </LineChart>
                                                        </ResponsiveContainer>
                                                </CardContent>
                                        </Card>
                                </Grid>

                                {/* Operación 4 - Descarga */}
                                <Grid item xs={12} md={6}>
                                        <Card sx={{ height: "100%", backgroundColor: "#b3e5fc" }}>
                                                <CardContent>
                                                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>Descarga</Typography>
                                                        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                                                                Registra la descarga de combustible desde las cisternas hacia los tanques. Esta operación aumenta la cantidad de combustible disponible en el tanque asociado.
                                                        </Typography>
                                                        <Button
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleNavigateTo("descargas")}
                                                                endIcon={<ArrowForward />}
                                                                sx={{ mb: 1 }}
                                                        >
                                                                Ver Detalles
                                                        </Button>
                                                        <ResponsiveContainer width="100%" height={175}>
                                                                <LineChart data={descargaData}>
                                                                        <CartesianGrid strokeDasharray="3 3" />
                                                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                                                        <YAxis tick={{ fontSize: 12 }} />
                                                                        <Tooltip />
                                                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                                                        <Line type="monotone" dataKey="descarga" stroke="#1e88e5" />
                                                                </LineChart>
                                                        </ResponsiveContainer>
                                                </CardContent>
                                        </Card>
                                </Grid>
                        </Grid>
                </Box>
        );
};

export default OperacionesMenu;
