import React, { useState, useEffect } from "react";
import classNames from "classnames";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const isDesktop = () => {
  return window.innerWidth > 991;
};

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);

  const wrapperClass = classNames("layout-wrapper", {
    "layout-collapsed": !isSidebarOpen,
    "layout-static": isSidebarOpen,
    "layout-mobile-sidebar-active": mobileMenuActive,
  });

  const mainContainerClass = classNames("layout-main-container", {
    "collapsed": !isSidebarOpen
  });

  const toggleSidebar = () => {
    if (isDesktop()) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setMobileMenuActive(prev => !prev);
    }
  };

  return (
    <div className={wrapperClass}>
      <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={mainContainerClass}>
        <Topbar isCollapsed={!isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="layout-main">{children}</div>
      </div>
    </div>
  );
}
