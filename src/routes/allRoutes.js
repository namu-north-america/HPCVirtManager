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
  },
  {
    path: "/virtual-machines/list",
    name: "Virtual Machines",
    element: <VMList />,
  },
  {
    path: "/virtual-machines/details/:namespace/:name",
    name: "Virtual Machines",
    element: <ViewVM />,
  },

  {
    path: "/virtual-machines/live-migrations",
    name: "Live Migrations",
    element: <LiveMigrations />,
  },
  {
    path: "/storage/disk",
    name: "Storage Disks",
    element: <StorageDisks />,
  },
  {
    path: "/storage/classes",
    name: "Storage Classes",
    element: <StorageClasses />,
  },

  {
    path: "/clusters",
    name: "Clusters",
    element: <Clusters />,
  },
  {
    path: "/nodes",
    name: "Nodes",
    element: <AllNodes />,
  },
  {
    path: "/users",
    name: "Users Management",
    element: <Users />,
  },
];
