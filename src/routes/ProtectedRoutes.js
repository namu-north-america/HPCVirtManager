import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
// import { isAuthenticated } from "../services/auth";
import { PrivateRoutes } from "./allRoutes";
import Layout from "../layout/Layout";
import { isAuthenticated } from "../services/auth";

const Auth = () => {
  return isAuthenticated() ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/403" />
  );
};

export const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<Auth />}>
        {PrivateRoutes.map((route, key) => (
          <Route key={key} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};
