import React, { useEffect } from "react";
import Page from "../shared/Page";
import Grid, { Col } from "../shared/Grid";
import CustomCard, { CustomCardValue } from "../shared/CustomCard";
import CapacityCard from "../shared/CapacityCard";
import { Link } from "react-router-dom";
import PieChart from "../shared/PieChart";
import { useDispatch, useSelector } from "react-redux";
import { getNodesAction, getVMsAction } from "../store/actions/projectActions";
import {
  onGetStorageAction,
  getCPUTotalCores,
  getMemoryUsage,
} from "../store/actions/reportingActions";
import {
  getDisksAction,
  getStorageClassesAction,
} from "../store/actions/storageActions";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [cpuUsage, setCpuUsage] = React.useState(0);
  const [memory, setMemory] = React.useState(0);
  const [storage, setStorage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    onInitialLoad();
  }, [dispatch]);

  const onInitialLoad = () => {
    setIsLoading(true);
    dispatch(getNodesAction());
    dispatch(getVMsAction());
    dispatch(getDisksAction());
    dispatch(getStorageClassesAction());
    dispatch(onGetStorageAction());
    dispatch(getCPUTotalCores());
    dispatch(getMemoryUsage());
  };

  let { nodes, vms, storageClasses, disks } = useSelector(
    (state) => state.project
  );
  let { clusterCpuInfo, memoryInfo, storageInfo } = useSelector(
    (state) => state.reporting
  );

  useEffect(() => {
    const usage = clusterCpuInfo.cpuUsage
      ? parseFloat(clusterCpuInfo.cpuUsage)
      : null;
    setCpuUsage(usage);
  }, [clusterCpuInfo]);

  useEffect(() => {
    setMemory(memoryInfo);
  }, [memoryInfo]);

  useEffect(() => {
    setStorage(storageInfo);
  }, [storageInfo]);

  useEffect(() => {
    if (vms.length > 0) {
      setIsLoading(false);
    }
  }, [vms]);

  const getVMsByStatus = (status) => {
    if (status) {
      return vms.filter((item) => item.status === status).length;
    } else {
      return vms.filter((item) => !statusList.includes(item.status)).length;
    }
  };

  let statusList = ["Running", "Paused", "Stopped"];

  let total = vms.length;
  let running = getVMsByStatus("Running");
  let paused = getVMsByStatus("Paused");
  let stopped = getVMsByStatus("Stopped");
  let others = getVMsByStatus();

  return (
    <Page onRefresh={onInitialLoad}>
      <Grid>
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
      <Grid>
        <Col>
          <CustomCard
            title="Clusters"
            header={<Link to="/clusters">See All &gt;</Link>}
          >
            <Grid extraClassNames="mt-4">
              <CustomCardValue title="Healthy" value="1" />
              <CustomCardValue title="Unhealthy" value="0" />
            </Grid>
          </CustomCard>
          <CustomCard
            title="Nodes"
            header={<Link to="/nodes">See All &gt;</Link>}
          >
            <Grid extraClassNames="mt-4">
              <CustomCardValue title="Healthy" value={nodes.length} />
              <CustomCardValue title="Unhealthy" value="0" />
            </Grid>
          </CustomCard>
        </Col>
        <Col size={6}>
          <CustomCard
            title="Virtual Machines"
            header={<Link to="/virtual-machines/list">See All &gt;</Link>}
          >
            <Grid extraClassNames="mt-4">
              <CustomCardValue title="Total" value={total} />
              <CustomCardValue title="Running" value={running} />
              <CustomCardValue title="Paused" value={paused} />
              <CustomCardValue title="Stopped" value={stopped} />
              <CustomCardValue title="Others" value={others} />
            </Grid>
            <Grid extraClassNames="justify-content-center">
              {!isLoading && (
                <PieChart
                  labels={["Running", "Paused", "Stopped", "Others"]}
                  series={[running, paused, stopped, others]}
                />
              )}
            </Grid>
          </CustomCard>
        </Col>
        <Col>
          <CustomCard
            title="Storage"
            header={<Link to="/storage/disk">See All &gt;</Link>}
          >
            <Grid extraClassNames="mt-4">
              <CustomCardValue
                size={6}
                title="Classes"
                value={storageClasses.length}
              />
              <CustomCardValue size={6} title="PV" value="0" />
              <CustomCardValue size={6} title="PVC" value="0" />
              <CustomCardValue
                size={6}
                title="Data Volume"
                value={disks.length}
              />
            </Grid>
          </CustomCard>
        </Col>
      </Grid>
    </Page>
  );
}
