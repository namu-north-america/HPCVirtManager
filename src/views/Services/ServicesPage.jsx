import { DataTable } from "primereact/datatable";
import Page from "../../shared/Page";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { CreateServiceModal } from "./NewServiceModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteServiceAction, getServicesAction } from "../../store/actions/serviceActions";
import { ActionItem, ActionsOverlay } from "../../shared/ActionsOverlay";
import { confirmDialog } from "primereact/confirmdialog";

export const ServicesPage = () => {
  const [isNewServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const { services } = useSelector((state) => state.services);
  const dispatch = useDispatch();

  const addNew = () => {
    setNewServiceModalOpen(true);
  };

  const actionsTemplate = (item) => {
    return (
      <ActionsOverlay>
        <ActionItem
          onClick={() => {
            // setSelectedItem(item);
            // setEditModalOpen(true);
          }}
        >
          More Details
        </ActionItem>
        <ActionItem
          onClick={() => {
            // setSelectedItem(item);
            // setEditModalOpen(true);
          }}
        >
          Settings
        </ActionItem>
        <ActionItem
          onClick={() => {
            confirmDialog({
              message: "Do you want to delete this record?",
              header: "Delete Confirmation",
              icon: "pi pi-info-circle",
              position: "top",
              accept: () => {
                dispatch(deleteServiceAction({ name: item.name, namespace: item.namespace }, (res) => {}));
              },
            });
          }}
        >
          Delete
        </ActionItem>
      </ActionsOverlay>
    );
  };

  useEffect(() => {
    dispatch(getServicesAction());
  }, [dispatch]);

  return (
    <Page title="Services" addText="New Service" onAdd={addNew}>
      <DataTable value={services}>
        <Column field="name" header="Name" />
        <Column field="namespace" header="Namespace" />
        <Column field="serviceType" header="Type" />
        <Column field="clusterIP" header="Cluster IP" />
        <Column header="Load Balancer" />
        <Column field="ports.0.port" header="Port" />
        <Column field="ports.0.targetPort" header="Target Port" />
        <Column field="targetResource" header="Target Resource" />
        <Column body={actionsTemplate} />
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
