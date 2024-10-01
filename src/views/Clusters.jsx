import React ,{useEffect} from "react";
import Page from "../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CapacityCard from "../shared/CapacityCard";
import Grid, { Col } from "../shared/Grid";
import { nameTemplate, timeTemplate } from "../shared/TableHelpers";
import { onGetStorageAction,getCPUTotalCores ,getMemoryUsage} from "../store/actions/reportingActions";
import { useDispatch,useSelector } from "react-redux";

const allNodes = [
  {
    name: "cluster-1",
    status: "READY",
    nodeCount: "1/3",
    cpu: "64  Core",
    memory: "128 GB",
    storage: "256 GB",
    k8sVersion: "1.29.9",
    time: "2024-07-28T10:14:57.665Z",
  },
  {
    name: "cluster-2",
    status: "RUNNING",
    nodeCount: "2/3",
    cpu: "72  Core",
    memory: "240 GB",
    storage: "500 GB",
    k8sVersion: "1.27.9",
    time: "2024-07-23T10:14:57.665Z",
  },
  {
    name: "cluster-3",
    status: "STOPPED",
    nodeCount: "3/3",
    cpu: "48  Core",
    memory: "128 GB",
    storage: "512 GB",
    k8sVersion: "1.22.9",
    time: "2024-07-22T10:14:57.665Z",
  },
];

const statusTemplate = (item) => {
  switch (item.status) {
    case "READY":
      return <span className="text-green-500">Ready</span>;
    case "RUNNING":
      return <span className="text-cyan-500">Running</span>;
    case "STOPPED":
      return <span className="text-red-500">Stopped</span>;
    default:
      return <span className="text-red-500">Stopped</span>;
  }
};

export default function Clusters() {
  const dispatch = useDispatch();
  const [cpuUsage, setCpuUsage] = React.useState(0);
  const [memory, setMemory] = React.useState(0);
  const [storage, setStorage] = React.useState(0);
  useEffect(() => {
    onInitialLoad();
  }, [dispatch]);

  const onInitialLoad = () => {
    dispatch(onGetStorageAction());
    dispatch(getCPUTotalCores());
    dispatch(getMemoryUsage());
  };
  let { clusterCpuInfo,memoryInfo,storageInfo } = useSelector(
    (state) => state.reporting
  );

  useEffect(() => {
    
    const usage = clusterCpuInfo.cpuUsage ? parseFloat(clusterCpuInfo.cpuUsage) : null;
    setCpuUsage(usage);
  }, [clusterCpuInfo]);
  useEffect(() => {
    setMemory(memoryInfo);
  }, [memoryInfo]);
  useEffect(() => {
    setStorage(storageInfo);
  }, [storageInfo]);
  return (
    <Page
      title="Clusters"
      onSearch={(e) => console.log(e)}
      onRefresh={(e) => console.log(e)}
      onAdd={(e) => console.log(e)}
      addText="Register New Cluster"
    >
      <Grid className="mb-2">
        <Col size={12}>
          <div className="flex space-x-4 gap-3 justify-center p-2">
            <CapacityCard
              title="CPU"
              description="Total CPU Capacity"
              usage={cpuUsage}
            />
            <CapacityCard
              title="Memory"
              description="Total Memory Capacity"
              usage={memory}
            />
            <CapacityCard
              title="Storage"
              description="Total Storage Capacity"
              usage={storage}
            />
          </div>
        </Col>
      </Grid>
      <DataTable value={allNodes} tableStyle={{ minWidth: "50rem" }}>
        <Column field="name" header="Name" body={nameTemplate}></Column>
        <Column field="status" header="Status" body={statusTemplate}></Column>
        <Column field="nodeCount" header="Node Count"></Column>
        <Column field="cpu" header="CPU"></Column>
        <Column field="memory" header="Memory"></Column>
        <Column field="storage" header="Storage"></Column>
        <Column field="k8sVersion" header="K8s Version"></Column>
        <Column field="time" header="Created" body={timeTemplate}></Column>
      </DataTable>
    </Page>
  );
}
