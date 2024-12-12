import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BreadcrumbContext = createContext();

const getPathItems = (pathname) => {
  const paths = pathname.split('/').filter(Boolean);
  const items = [
    {
      template: (item) => {
        return (
          <a href="/#/dashboard" className="p-menuitem-link">
            <i className="pi pi-th-large text-color-secondary"></i>
          </a>
        );
      },
      url: '/#/dashboard'
    }
  ];
  
  let currentPath = '';
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const formattedLabel = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    items.push({
      label: formattedLabel,
      url: `/#${currentPath}`
    });
  });
  
  return items;
};

export function BreadcrumbProvider({ children }) {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setBreadcrumbItems([{
        template: (item) => {
          return (
            <a href="/#/dashboard" className="p-menuitem-link">
              <i className="pi pi-th-large text-color-secondary"></i>
            </a>
          );
        },
        url: '/#/dashboard'
      }]);
    } else {
      const items = getPathItems(location.pathname);
      setBreadcrumbItems(items);
    }
  }, [location.pathname]);

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
