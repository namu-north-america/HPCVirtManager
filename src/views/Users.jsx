import React, { useEffect, useMemo, useRef, useState } from "react";
import Page from "../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomBreadcrum from "../shared/CustomBreadcrum";
import CustomOverlay from "../shared/CustomOverlay";
import { nameTemplate, timeTemplate } from "../shared/TableHelpers";
import AddVirtualMachineModal from "./VirtualMachines/Form/AddVirtualMachineModal";

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
const breadcrumItems = [{ label: "Users (RBAC)", url: "/#/users" }];
export default function Users() {
      const [visible, setVisible] = useState(false);
  const actionTemplate = (item) => {
    return (
      <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
        <div>
          <div className="font-semibold mb-2">Actions</div>

          {
            <>
              <div className="cursor-pointer mb-2" onClick={() => onEdit(item)}>
                Edit
              </div>
              <div className="cursor-pointer" onClick={() => onDelete(item)}>
                Delete
              </div>
            </>
          }
        </div>
      </CustomOverlay>
    );
  };
  const onEdit = (item) => {
    console.log("edit", item);
  };
  const onDelete = (item) => {
    console.log("delete", item);
  };
  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="User Management (RBAC)"
        onSearch={(e) => console.log(e)}
        onRefresh={(e) => console.log(e)}
        onAdd={(e) => console.log(e)}
        addText="Register New User"
      >
        <DataTable value={allNodes} tableStyle={{ minWidth: "50rem" }}>
          <Column field="name" header="Username" body={nameTemplate}></Column>

          <Column field="nodeCount" header="Role"></Column>
          <Column field="cpu" header="Id (Email)"></Column>
          <Column field="status" header="Status" body={statusTemplate}></Column>
          <Column field="memory" header="Department"></Column>
          <Column field="time" header="Last Login" body={timeTemplate}></Column>
          <Column body={actionTemplate}></Column>
        </DataTable>
        <AddVirtualMachineModal visible={visible} setVisible={setVisible} />
      </Page>
    </>
  );
}
