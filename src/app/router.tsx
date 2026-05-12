import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

import LoginPage from "../modules/auth/pages/LoginPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";

import UserListPage from "../modules/users/pages/UserListPage";
import UserCreatePage from "../modules/users/pages/UserCreatePage";
import ClientListPage from "../modules/clients/pages/ClientListPage";
import ClientCreatePage from "../modules/clients/pages/ClientCreatePage";
import ClientEditPage from "../modules/clients/pages/ClientEditPage";

import PortfolioListPage from "../modules/portfolio/pages/PortfolioListPage";
import PortfolioCreatePage from "../modules/portfolio/pages/PortfolioCreatePage";
import PortfolioEditPage from "../modules/portfolio/pages/PortfolioEditPage";
import PortfolioDetailPage from "../modules/portfolio/pages/PortfolioDetailPage";

import ProjectListPage from "../modules/projects/pages/ProjectListPage";
import ProjectCreatePage from "../modules/projects/pages/ProjectCreatePage";
import ProjectDetailPage from "../modules/projects/pages/ProjectDetailPage";
import ProjectEditPage from "../modules/projects/pages/ProjectEditPage";

import DataSheetListPage from "../modules/datasheets/pages/DataSheetListPage";
import ProductSheetPage from "../modules/datasheets/pages/ProductSheetPage";
import DataSheetEditPage from "../modules/datasheets/pages/DataSheetEditPage";

import UserEditPage from "../modules/users/pages/UserEditPage";
import UserDetailPage from "../modules/users/pages/UserDetailPage";
import ClientDetailPage from "../modules/clients/pages/ClientDetailPage";

import ValidationListPage from "../modules/validaciones/pages/ValidationListPage";
import ValidationDetailPage from "../modules/validaciones/pages/ValidationDetailPage";

import { getCurrentUser, logoutUser } from "../shared/data/userStorage";

export default function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsAuthenticated(!!user);
  }, []);

  const handleLogin = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsAuthenticated(!!user);
  };

  // Si está autenticado, redirigir a dashboard
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="portfolio" element={<PortfolioListPage />} />
          <Route path="portfolio/new" element={<PortfolioCreatePage />} />
          <Route path="portfolio/:portfolioCode" element={<PortfolioDetailPage />} />
          <Route path="portfolio/:portfolioCode/edit" element={<PortfolioEditPage />} />
          <Route path="projects" element={<ProjectListPage />} />
          <Route path="projects/new" element={<ProjectCreatePage />} />
          <Route path="projects/:projectCode" element={<ProjectDetailPage />} />
          <Route path="projects/:projectCode/edit" element={<ProjectEditPage />} />
          <Route path="clients" element={<ClientListPage />} />
          <Route path="clients/new" element={<ClientCreatePage />} />
          <Route path="clients/:clientCode" element={<ClientDetailPage />} />
          <Route path="clients/:clientCode/edit" element={<ClientEditPage />} />
          <Route path="datasheets" element={<DataSheetListPage />} />
          <Route path="datasheets/new" element={<ProductSheetPage />} />
          <Route path="datasheets/:datasheetId" element={<div className="p-4">Detalle de Ficha (Ver)</div>} />
          <Route path="datasheets/:datasheetId/edit" element={<DataSheetEditPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/new" element={<UserCreatePage />} />
          <Route path="users/:userId" element={<UserDetailPage />} />
          <Route path="users/:userId/edit" element={<UserEditPage />} />
          <Route path="validaciones" element={<ValidationListPage />} />
          <Route path="validaciones/:projectCode" element={<ValidationDetailPage />} />
          <Route path="soporte" element={<div className="p-4">Soporte TI</div>} />
          <Route path="configuracion" element={<div className="p-4">Configuración</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Layout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Portafolio */}
        <Route path="portfolio" element={<PortfolioListPage />} />
        <Route path="portfolio/new" element={<PortfolioCreatePage />} />
        <Route path="portfolio/:portfolioCode" element={<PortfolioDetailPage />} />
        <Route path="portfolio/:portfolioCode/edit" element={<PortfolioEditPage />} />

        {/* Proyectos */}
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/new" element={<ProjectCreatePage />} />
        <Route path="projects/:projectCode" element={<ProjectDetailPage />} />
        <Route path="projects/:projectCode/edit" element={<ProjectEditPage />} />

        {/* Clientes */}
        <Route path="clients" element={<ClientListPage />} />
        <Route path="clients/new" element={<ClientCreatePage />} />
        <Route path="clients/:clientCode" element={<ClientDetailPage />} />
        <Route path="clients/:clientCode/edit" element={<ClientEditPage />} />

        {/* Fichas de Producto */}
        <Route path="datasheets" element={<DataSheetListPage />} />
        <Route path="datasheets/new" element={<ProductSheetPage />} />
        <Route path="datasheets/:datasheetId" element={<div className="p-4">Detalle de Ficha (Ver)</div>} />
        <Route path="datasheets/:datasheetId/edit" element={<DataSheetEditPage />} />

        {/* Usuarios */}
        <Route path="users" element={<UserListPage />} />
        <Route path="users/new" element={<UserCreatePage />} />
        <Route path="users/:userId" element={<UserDetailPage />} />
        <Route path="users/:userId/edit" element={<UserEditPage />} />

        {/* Validaciones */}
        <Route path="validaciones" element={<ValidationListPage />} />
        <Route path="validaciones/:projectCode" element={<ValidationDetailPage />} />

        {/* Rutas temporales del sidebar */}
        <Route
          path="soporte"
          element={<div className="p-4">Soporte TI</div>}
        />
        <Route
          path="configuracion"
          element={<div className="p-4">Configuración</div>}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}
