import React, { useEffect, useMemo, useState } from "react";
import Page from "../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { timeAgo } from "../utils/date";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNodesAction } from "../store/actions/projectActions";

const nameTemplate = (item) => {
  return <Link className="link">{item.name}</Link>;
};
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

const timeTemplate = (item) => {
  return <>{timeAgo(item.time)}</>;
};

export default function AllNodes() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNodesAction());
  }, [dispatch]);

  let { nodes } = useSelector((state) => state.project);

  const [search, setSearch] = useState("");

  nodes = useMemo(
    () =>
      nodes.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, nodes]
  );
  return (
    <Page
      title="Nodes"
      onSearch={setSearch}
      onRefresh={(e) => dispatch(getNodesAction())}
    >
      <DataTable value={nodes} tableStyle={{ minWidth: "50rem" }}>
        <Column field="name" header="Name" body={nameTemplate}></Column>
        <Column field="status" header="Status" body={statusTemplate}></Column>
        <Column field="operatingSystem" header="Operating System"></Column>
        <Column field="cpu" header="CPU"></Column>
        <Column field="memory" header="Memory"></Column>
        <Column field="storage" header="Storage"></Column>
        <Column field="k8sVersion" header="K8s Version"></Column>
        <Column field="time" header="Created" body={timeTemplate}></Column>
      </DataTable>
    </Page>
  );
}
