import Dashboard from "../views/Dashboard";
import Clusters from "../views/Clusters";
import Users from "../views/Users";
import AllNodes from "../views/AllNodes";
import VMList from "../views/VirtualMachines/VMList";
import LiveMigrations from "../views/VirtualMachines/LiveMigrations";
import StorageDisks from "../views/Storage/StorageDisks";
import StorageClasses from "../views/Storage/StorageClasses";
import ViewVM from "../views/VirtualMachines/ViewVM";

export const PrivateRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
    role: "shared",
  },
  {
    path: "/virtual-machines/list",
    name: "Virtual Machines",
    element: <VMList />,
    role: "shared",
  },
  {
    path: "/virtual-machines/details/:namespace/:name",
    name: "Virtual Machines",
    element: <ViewVM />,
    role: "shared",
  },

  {
    path: "/virtual-machines/live-migrations",
    name: "Live Migrations",
    element: <LiveMigrations />,
    role: "shared",
  },
  {
    path: "/storage/disk",
    name: "Storage Disks",
    element: <StorageDisks />,
    role: "shared",
  },
  {
    path: "/storage/classes",
    name: "Storage Classes",
    element: <StorageClasses />,
    role: "shared",
  },

  {
    path: "/clusters",
    name: "Clusters",
    element: <Clusters />,
    role: "admin",
  },
  {
    path: "/nodes",
    name: "Nodes",
    element: <AllNodes />,
    role: "shared",
  },
  {
    path: "/users",
    name: "Users Management",
    element: <Users />,
    role: "admin",
  },
];
