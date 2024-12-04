import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { timeTemplate, nameTemplate } from "../../shared/TableHelpers";
import CustomOverlay from "../../shared/CustomOverlay";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumb } from "primereact/breadcrumb";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import PoolTypeSelectionModal from "./Form/PoolTypeSelectionModal";

export default function VMPools() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [pools, setPools] = useState([]); // This will be populated from your API
  const { breadcrumb } = useBreadcrumb();
  const [isPoolTypeModalOpen, setIsPoolTypeModalOpen] = useState(false);

  // Filter pools based on search
  const filteredPools = pools.filter((item) =>
    item?.name?.toLowerCase()?.includes(search?.toLowerCase())
  );

  const resourcesTemplate = (item) => {
    return `${item.cpus} CPUs, ${item.memory} RAM`;
  };

  const statusTemplate = (item) => {
    const statusColors = {
      Healthy: "text-green-500",
      Degraded: "text-yellow-500",
      Error: "text-red-500",
    };
    
    return (
      <span className={statusColors[item.status] || "text-gray-500"}>
        {item.status}
      </span>
    );
  };

  const actionTemplate = (item) => {
    return (
      <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
        <div>
          <div className="font-semibold mb-2">Actions</div>
          <div className="cursor-pointer mb-2" onClick={() => onEdit(item)}>
            Edit Pool
          </div>
          <div className="cursor-pointer mb-2" onClick={() => onScale(item)}>
            Scale Pool
          </div>
          <div className="cursor-pointer" onClick={() => onDelete(item)}>
            Delete Pool
          </div>
        </div>
      </CustomOverlay>
    );
  };

  const onAdd = () => {
    setIsPoolTypeModalOpen(true);
  };

  const handlePoolTypeSelect = (poolType) => {
    setIsPoolTypeModalOpen(false);
    navigate("/virtual-machines/pools/add", { state: { poolType } });
  };

  const onEdit = (item) => {
    navigate(`/virtual-machines/pools/${item.name}/edit`);
  };

  const onScale = (item) => {
    navigate(`/virtual-machines/pools/${item.name}/scale`);
  };

  const onDelete = (item) => {
    // Implement delete functionality
  };

  return (
    <>
      <PoolTypeSelectionModal
        isOpen={isPoolTypeModalOpen}
        onClose={() => setIsPoolTypeModalOpen(false)}
        onSelect={handlePoolTypeSelect}
      />
      <Page
        title="VM Pools"
        onSearch={setSearch}
        onRefresh={() => {
          // Refresh pools data
        }}
        onAdd={onAdd}
        addText="New VM Pool"
        breadcrumb={<BreadCrumb model={breadcrumb} />}
      >
        <DataTable value={filteredPools} tableStyle={{ minWidth: "50rem" }}>
          <Column field="name" header="Name" body={nameTemplate}></Column>
          <Column field="vmCount" header="# of VMs"></Column>
          <Column field="status" header="Status" body={statusTemplate}></Column>
          <Column field="type" header="Type"></Column>
          <Column field="resources" header="Resources" body={resourcesTemplate}></Column>
          <Column field="created" header="Created" body={timeTemplate}></Column>
          <Column body={actionTemplate}></Column>
        </DataTable>
      </Page>
    </>
  );
}
