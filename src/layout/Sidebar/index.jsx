import React from "react";
import { ReactComponent as Logo } from "../../assets/images/svg/Logo.svg";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { logout } from "../../services/auth";
import { sidebarItems } from "./SidebarRoutes";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
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
    <div className="layout-sidebar">
      <div className="logo">
        <Logo />
      </div>
      <div className="menu-bar">
        <div className="sidebar-header">
          {sidebarItems.map((item, i) => (
            <SidebarItem
              key={i}
              icon={item?.icon}
              title={item?.title}
              items={item?.items}
              link={item?.link}
            />
          ))}
        </div>
        <div className="sidebar-footer">
          <SidebarItem
            icon="pi pi-sign-out"
            title="Logout"
            onClick={onLogout}
          />
        </div>
      </div>
    </div>
  );
}
