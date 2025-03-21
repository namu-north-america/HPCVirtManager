import Dashboard from "../views/Dashboard";
import Clusters from "../views/Clusters";
import Users from "../views/Users";
import EditUser from "../views/User/EditUser";
import UpdateUser from "../views/User/UpdateUser";
import AllNodes from "../views/AllNodes";
import NodeDetail from "../views/NodeDetail/NodeDetail";
import VMList from "../views/VirtualMachines/VMList";
import LiveMigrations from "../views/VirtualMachines/LiveMigrations";
import StorageDisks from "../views/Storage/StorageDisks";
import StorageClasses from "../views/Storage/StorageClasses";
import ViewVM from "../views/VirtualMachines/ViewVM";
import Images from "../views/Images";
import SSHKeys from "../views/SSHKeys";
import AddVirtualMachine from "../views/VirtualMachines/AddVirtualMachine";
import VMTemplate from "../views/VirtualMachines/VMTemplate";
import AddVMTemplate from "../views/VirtualMachines/AddVMTemplate";
import VMPools from "../views/VirtualMachines/VMPools";
import CreateK8sCluster from "../views/VMPools/Form/CreateK8sCluster";
import InstanceTypes from "../views/InstanceTypes/InstanceTypes";
import VMPoolsPage from "../views/VMPools/VMPools";
import { ViewVMPool } from "../views/VMPools/ViewVMPool";
import { AutoScaling } from "../views/AutoScaling/AutoScaling";
import { NetworkAccessPage } from "../views/NetworkAccess/NetworkAccessPage";

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
    path: "/virtual-machines/add",
    name: "Add Virtual Machine",
    element: <AddVirtualMachine />,
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
    path: "/virtual-machines/templates",
    name: "VM Templates",
    element: <VMTemplate />,
    role: "shared",
  },
  {
    path: "/virtual-machines/pools",
    name: "VM Pools",
    element: <VMPools />,
    role: "shared",
  },
  {
    path: "/virtual-machines/pools/add-k8s",
    name: "Create Kubernetes Cluster",
    element: <CreateK8sCluster />,
    role: "shared",
  },
  {
    path: "/virtual-machines/templates/add",
    name: "New VM Template",
    element: <AddVMTemplate />,
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
    path: "/images",
    name: "Images",
    element: <Images />,
    role: "shared",
  },
  {
    path: "/clusters",
    name: "Clusters",
    element: <Clusters />,
    role: "shared",
  },
  {
    path: "/clusters/create",
    name: "Create Cluster",
    element: <CreateK8sCluster />,
    role: "shared",
  },
  {
    path: "/nodes",
    name: "Nodes",
    element: <AllNodes />,
    role: "shared",
  },
  {
    path: "/nodes/:name",
    name: "Nodes Details",
    element: <NodeDetail />,
    role: "shared",
  },
  {
    path: "/users",
    name: "Users Management",
    element: <Users />,
    role: "shared",
  },
  {
    path: "/users/:name",
    name: "User Details",
    element: <EditUser />,
    role: "shared",
  },
  {
    path: "/users/profile",
    name: "User Profile",
    element: <UpdateUser />,
    role: "shared",
  },
  {
    path: "/sshkeys",
    name: "SSH Keys",
    element: <SSHKeys />,
    role: "shared",
  },
  {
    path: "/instance-types",
    name: "Instance Types",
    element: <InstanceTypes />,
    role: "shared",
  },
  {
    path: "/vm-pools",
    name: "VM Pools",
    element: <VMPoolsPage />,
    role: "shared",
  },
  {
    path: "/virtual-machine-pools/:name",
    name: "Virtual Machine Pool",
    element: <ViewVMPool />,
    role: "shared",
  },
  {
    path: "/auto-scaling",
    name: "Auto Scaling",
    element: <AutoScaling />,
    role: "shared",
  },
  {
    path: "/network-access",
    name: "Network Access",
    element: <NetworkAccessPage />,
    role: "shared",
  },
];
