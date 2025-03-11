import { DataTable } from "primereact/datatable";
import Page from "../../shared/Page";
import { Column } from "primereact/column";
import { useState } from "react";
import { CreateServiceModal } from "./NewServiceModal";

export const ServicesPage = () => {
  const [isNewServiceModalOpen, setNewServiceModalOpen] = useState(false);

  const addNew = () => {
    setNewServiceModalOpen(true);
  };

  return (
    <Page title="Services" addText="New Service" onAdd={addNew}>
      <DataTable>
        <Column header="Name" />
        <Column header="Namespace" />
        <Column header="Type" />
        <Column header="Cluster IP" />
        <Column header="Load Balancer" />
        <Column header="Target Resource" />
      </DataTable>
      <CreateServiceModal
        isOpen={isNewServiceModalOpen}
        onHide={() => {
          setNewServiceModalOpen(false);
        }}
      />
    </Page>
  );
};
