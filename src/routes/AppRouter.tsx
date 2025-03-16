import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Perfil from "../pages/Perfil"; // Si ya agregaste la página Perfil
import Layout from "../components/Layout";
import Tanques from "../pages/Tanques"; // Importamos la nueva página


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
            <Route path="gestion/tanques" element={<Tanques />} /> {/* Nueva Ruta */}
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
