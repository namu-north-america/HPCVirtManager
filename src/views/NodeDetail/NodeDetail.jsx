import React, { useEffect, useState } from "react";
import Page from "../../shared/Page";
import Grid, { Col } from "../../shared/Grid";
import CustomCard from "../../shared/CustomCard";
import CustomBreadcrum from "../../shared/CustomBreadcrum";

import { useDispatch, useSelector } from "react-redux";
import {
  getNodeInstanceAction,
  getNodeTotalMemoryAction,
  getNodeTotalStorageAction,
  getNodeTotalCPUCoresAction,
} from "../../store/actions/projectActions";

import NodeOverView from "./NodeOverview";
import ResourceUsage from "./ResourceUsage";
import { useParams } from "react-router-dom";

export default function NodeDetail() {
  const dispatch = useDispatch();
  const { name } = useParams();
  const [cpu, setCpu] = useState({
    title: "CPU",
    used: 0,
    available: 0,
    ratio: 0,
  });
  const [memory, setMemory] = useState({
    title: "Memory",
    used: 0,
    available: 0,
    ratio: 0,
  });
  const [storage, setStorage] = useState({
    title: "Storage",
    used: 0,
    available: 0,
    ratio: 0,
  });
  const breadcrumItems = [
    { label: "Nodes", url: "/#/nodes" },
    { label: "Detail", url: "/#/nodes/" + name },
  ];
  useEffect(() => {
    onInitialLoad();
  }, [dispatch]);

  const onInitialLoad = () => {
    dispatch(getNodeInstanceAction(name));
    dispatch(getNodeTotalMemoryAction(name));
    dispatch(getNodeTotalStorageAction(name));
    dispatch(getNodeTotalCPUCoresAction(name));
  };

  let { nodeMemory, nodeStorage, nodeCpu } = useSelector(
    (state) => state.reporting
  );

  useEffect(() => {
    console.log("nodeMemory", nodeMemory);
    const { total, used } = nodeMemory;
    const usedPercentage = ((used / total) * 100).toFixed(2); // Calculate used percentage
    const available = (total - used).toFixed(2);
    setMemory({
      title: "Memory",
      used: used,
      available: available,
      ratio: usedPercentage,
    });
  }, [nodeMemory]);
  useEffect(() => {
    console.log("nodeStorage", nodeStorage);
    const { total, used } = nodeStorage;
    const usedPercentage = ((used / total) * 100).toFixed(2); // Calculate used percentage
    const available = (total - used).toFixed(2);
    setStorage({
      title: "Storage",
      used: used,
      available: available,
      ratio: usedPercentage,
    });
  }, [nodeStorage]);

  useEffect(() => {
    console.log("nodeCpu", nodeCpu);
    let { total, used } = nodeCpu;
    // used mean cpu usage %
    // total mean cpu cores
    const numericValue = parseFloat(used); // Convert to number
    let data = !isNaN(numericValue) ? numericValue.toFixed(2) : numericValue;

    setCpu({ title: "CPU", used: data, available: total, ratio: data });
  }, [nodeCpu]);

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page title={name} onRefresh={onInitialLoad}>
        <Grid>
          <Col>
            <CustomCard title="Overview">
              <NodeOverView />
            </CustomCard>
          </Col>
          <Col size={8}>
            <CustomCard title="Resources Utilization">
              <div className="flex">
                <ResourceUsage data={cpu} />
                <ResourceUsage data={memory} />
                <ResourceUsage data={storage} />
              </div>
            </CustomCard>
          </Col>
        </Grid>
      </Page>
    </>
  );
}
