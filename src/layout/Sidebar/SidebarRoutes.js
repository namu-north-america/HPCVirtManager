import { FaDesktop, FaCompactDisc, FaServer } from 'react-icons/fa';

export const sidebarItems = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "pi pi-th-large",
  },
  {
    title: "Virtual Machines",
    link: "/virtual-machines",
    icon: <FaDesktop size={14} />,
    items: [
      {
        title: "All VMs",
        link: "/list",
      },
      {
        title: "VM Pools",
        link: "/pools",
      },
      {
        title: "Templates",
        link: "/templates",
      },
      {
        title: "Live Migrations",
        link: "/live-migrations",
      },
    ],
  },
  {
    title: "Storage",
    link: "/storage",
    icon: "pi pi-database",
    items: [
      {
        title: "Storage Disks",
        link: "/disk",
      },
      {
        title: "Storage Classes",
        link: "/classes",
      },
    ],
  },
  {
    title: "Images",
    link: "/images",
    icon: <FaCompactDisc size={14} />,
  },
  // {
  //   title: "Clusters",
  //   link: "/clusters",
  //   icon: "pi pi-sitemap",
  // },
  {
    title: "Nodes",
    link: "/nodes",
    icon: <FaServer size={14} />,
  },
  {
    title: "Users (RBAC)",
    link: "/users",
    icon: "pi pi-users",
  },
  {
    title: "SSH Keys",
    link: "/sshkeys",
    icon: "pi pi-key",
  },
];
