import React, { useEffect, useState } from "react";
import Page from "../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CapacityCard from "../shared/CapacityCard";
import Grid, { Col } from "../shared/Grid";
import { nameTemplate, timeTemplate } from "../shared/TableHelpers";
import {
  onGetStorageAction,
  getCPUTotalCores,
  getMemoryUsage,
} from "../store/actions/reportingActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Ensure API service is imported
import endPoints from "../services/endPoints"; // Ensure endpoints are defined

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

const iconTemplate = () => {
  return <i className="pi pi-sitemap text-xl"></i>;
};

export default function Clusters() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memory, setMemory] = useState(0);
  const [storage, setStorage] = useState(0);

  useEffect(() => {
    onInitialLoad();
    fetchClusters(); // Fetch clusters on page load
  }, [dispatch]);

  const onInitialLoad = () => {
    dispatch(onGetStorageAction());
    dispatch(getCPUTotalCores());
    dispatch(getMemoryUsage());
  };

  const fetchClusters = async () => {
    setLoading(true); // Show loading state
    try {
      const res = await api("get", endPoints.LIST_CLUSTERS);
      const fetchedClusters = res.items.map((item) => ({
        name: item?.metadata?.name || "Unknown",
        status: item?.status?.phase || "Unknown",
        nodeCount: `${item?.status?.readyReplicas || 0}/${item?.spec?.replicas || 0}`,
        cpu: `${item?.status?.capacity?.cpu || 0} Core`,
        memory: `${item?.status?.capacity?.memory || 0} GB`,
        storage: `${item?.status?.capacity?.storage || 0} GB`,
        k8sVersion: item?.spec?.version || "Unknown",
        time: item?.metadata?.creationTimestamp,
      }));
      setClusters(fetchedClusters);
    } catch (error) {
      console.error("Error fetching clusters:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  let { clusterCpuInfo, memoryInfo, storageInfo } = useSelector(
    (state) => state.reporting
  );

  useEffect(() => {
    const usage = clusterCpuInfo.cpuUsage
      ? parseFloat(clusterCpuInfo.cpuUsage)
      : 0;
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
      onRefresh={fetchClusters}
      onAdd={() => navigate("/clusters/create")}
      addText="Create K8s Cluster"
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
      <DataTable
        value={clusters}
        tableStyle={{ minWidth: "50rem" }}
        loading={loading}
      >
        <Column body={iconTemplate} header="" style={{ width: "3rem" }}></Column>
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
