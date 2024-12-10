import React from 'react';
import { BreadcrumbProvider } from './contexts/BreadcrumbContext';
import { HashRouter } from 'react-router-dom';
import { ProtectedRoutes } from './routes/ProtectedRoutes';

function App() {
  return (
    <BreadcrumbProvider>
      <HashRouter>
        <ProtectedRoutes />
      </HashRouter>
    </BreadcrumbProvider>
  );
} 

export default App;