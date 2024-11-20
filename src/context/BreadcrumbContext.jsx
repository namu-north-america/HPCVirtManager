import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BreadcrumbContext = createContext();

export function BreadcrumbProvider({ children }) {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const location = useLocation();

  const updateBreadcrumb = (items) => {
    setBreadcrumbItems(items);
  };

  const value = {
    breadcrumbItems,
    setBreadcrumbItems,
    updateBreadcrumb
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}
