import React from "react";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { logout } from "../../services/auth";
import { sidebarItems } from "./SidebarRoutes";
import SidebarItem from "./SidebarItem";
import classNames from "classnames";
import LogoMenuItem from "./LogoMenuItem";

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();

  const onLogout = () => {
    confirmDialog({
      message: "Are you sure you want to logout?",
      header: "Confirmation",
      icon: "pi pi-sign-out",
      defaultFocus: "accept",
      accept: () => {
        logout(() => navigate("/"));
      },
    });
  };

  return (
    <div className={classNames("layout-sidebar", { 'collapsed': isCollapsed })}>
      <div className="menu-bar">
        <div className="sidebar-header">
          <LogoMenuItem isCollapsed={isCollapsed} />
          {sidebarItems.map((item, i) => (
            <SidebarItem
              key={i}
              icon={item?.icon}
              title={item?.title}
              items={item?.items}
              link={item?.link}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
        <div className="sidebar-footer">
          <SidebarItem
            icon="pi pi-sign-out"
            title="Logout"
            onClick={onLogout}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
      <div 
        className={classNames("toggle-button", { 'collapsed': isCollapsed })}
        onClick={toggleSidebar}
      >
        <i className="pi pi-angle-left" />
      </div>
    </div>
  );
}
