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
import CreateK8sCluster from "../VMPools/Form/CreateK8sCluster";
import Modal from "../../shared/Modal/Modal";

export default function VMPools() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [pools, setPools] = useState([]); // This will be populated from your API
  const { breadcrumb } = useBreadcrumb();
  const [isPoolTypeModalOpen, setIsPoolTypeModalOpen] = useState(false);
  const [isK8sFormOpen, setIsK8sFormOpen] = useState(false);

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
    if (poolType.id === 'kubernetes') {
      navigate('/virtual-machines/pools/add-k8s');
    } else {
      navigate('/virtual-machines/pools/add');
    }
  };

  const handleK8sFormClose = () => {
    setIsK8sFormOpen(false);
    navigate('/virtual-machines/pools');
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
      <DataTable
        value={filteredPools}
        paginator
        rows={10}
        totalRecords={filteredPools.length}
        className="p-datatable-striped"
      >
        <Column
          field="name"
          header="Name"
          body={nameTemplate}
          sortable
          filter
          filterPlaceholder="Search by name"
        />
        <Column field="type" header="Type" sortable filter />
        <Column field="size" header="Size" sortable />
        <Column
          field="resources"
          header="Resources"
          body={resourcesTemplate}
          sortable
        />
        <Column
          field="status"
          header="Status"
          body={statusTemplate}
          sortable
          filter
        />
        <Column
          field="created"
          header="Created"
          body={timeTemplate}
          sortable
        />
        <Column
          body={actionTemplate}
          style={{ width: "4rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
      </DataTable>

      <PoolTypeSelectionModal
        isOpen={isPoolTypeModalOpen}
        onClose={() => setIsPoolTypeModalOpen(false)}
        onSelect={handlePoolTypeSelect}
      />

      {isK8sFormOpen && (
        <Modal
          isOpen={isK8sFormOpen}
          onClose={handleK8sFormClose}
          title="Create Kubernetes Cluster"
          size="large"
        >
          <CreateK8sCluster onClose={handleK8sFormClose} />
        </Modal>
      )}
    </Page>
  );
}
