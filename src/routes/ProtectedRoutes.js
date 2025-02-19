import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "./allRoutes";
import Layout from "../layout/Layout";
import { isAuthenticated, getUserRole } from "../services/auth";

const Auth = ({ allowedRoles }) => {
  const isLoggedIn = isAuthenticated(); // Check if the user is authenticated
  const userRole = getUserRole().role; // Get the current user's role
 
  if (!isLoggedIn) {
    console.log("user is not logged in")
    return <Navigate to="/403" />; // Redirect if not logged in
  }
  if (!allowedRoles.includes(userRole)) {
    console.log("user role not allowed")
    return <Navigate to="/403" />; // Redirect if role is not allowed
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};


export const ProtectedRoutes = () => {
  return (
    <Routes>
      {/* Admin-only routes */}
      <Route element={<Auth allowedRoles={['admin']} />}>
        {PrivateRoutes.filter((route) => route.role === 'admin').map((route, key) => (
          <Route key={key} path={route.path} element={route.element} />
        ))}
      </Route>
      {/* Shared routes that both admin and users can access */}
      <Route element={<Auth allowedRoles={["admin", "user"]} />}>
        {PrivateRoutes.filter((route) => route.role === "shared").map(
          (route, key) => (
            <Route key={key} path={route.path} element={route.element} />
          )
        )}
      </Route>
    </Routes>
  );
};
