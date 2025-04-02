import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil"; // Si ya agregaste la página Perfil
import Layout from "../components/Layout";
import Tanques from "../pages/gestion/Tanques"; // Importamos la nueva página
import Cisternas from "../pages/gestion/Cisternas";
import Estaciones from "../pages/gestion/Estaciones";
import Dashboard from "../pages/reportes/Dashboard";
import Productos from "../pages/gestion/Productos";
import OperacionesMenu from "../pages/operaciones/Operaciones";
import Ventas from "../pages/operaciones/Ventas";
import OtrasOperaciones from "../pages/operaciones/OtrasOperaciones";
import ConsumoTanque from "../pages/operaciones/ConsumoTanque";
import Descarga from "../pages/operaciones/Descarga";
import Transportes from "../pages/transportes/Transportes";


const AppRouter: React.FC = () => {
  const isAuthenticated = true; // Temporalmente en "true", luego se conecta con autenticación

  return (
    <Router>
      <Routes>
        {/* Página de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas que usan Layout */}
        {isAuthenticated ? (
            <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="operaciones" element={<OperacionesMenu />} />
            <Route path="operaciones/ventas" element={<Ventas />} /> {/* Nueva Ruta */}
            <Route path="operaciones/consumos-propios" element={<ConsumoTanque />} /> {/* Nueva Ruta */}
            <Route path="operaciones/otras-operaciones" element={<OtrasOperaciones />} /> {/* Nueva Ruta */}
            <Route path="operaciones/descargas" element={<Descarga />} /> {/* Nueva Ruta */}
            <Route path="gestion/tanques" element={<Tanques />} /> {/* Nueva Ruta */}
            <Route path="gestion/cisternas" element={<Cisternas />} /> {/* Nueva Ruta */}
            <Route path="gestion/productos" element={<Productos />} /> {/* Nueva Ruta */}
            <Route path="gestion/estaciones" element={<Estaciones />} /> {/* Nueva Ruta */}
            <Route path="reportes/dashboard" element={<Dashboard />} />
            <Route path="transportes" element={<Transportes />} />
            </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
