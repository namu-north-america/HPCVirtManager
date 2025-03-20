import { DataTable } from "primereact/datatable";
import Page from "../../shared/Page";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { CreateServiceModal } from "./NewServiceModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteNetworkAccessAction, getNetworkAccessAction } from "../../store/actions/networkAccessActions";
import { ActionItem, ActionsOverlay } from "../../shared/ActionsOverlay";
import { confirmDialog } from "primereact/confirmdialog";
import { ServiceSettingsModal } from "./ServiceSettingsModal";
import { ServiceDetailsModal } from "./ServiceDetailsModal";

export const NetworkAccessPage = () => {
  const [isNewServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const { networks } = useSelector((state) => state.networks);
  const dispatch = useDispatch();

  const addNew = () => {
    setNewServiceModalOpen(true);
  };

  const actionsTemplate = (item) => {
    return (
      <ActionsOverlay>
        <ActionItem
          onClick={() => {
            setSelectedItem(item);
            setDetailsModalOpen(true);
          }}
        >
          More Details
        </ActionItem>
        <ActionItem
          onClick={() => {
            setSelectedItem(item);
            setSettingsModalOpen(true);
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
                dispatch(deleteNetworkAccessAction({ name: item.name, namespace: item.namespace }, (res) => {}));
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
    dispatch(getNetworkAccessAction());
  }, [dispatch]);

  return (
    <Page title="Services" addText="New Service" onAdd={addNew}>
      <DataTable value={networks}>
        <Column field="name" header="Name" />
        <Column field="namespace" header="Namespace" />
        <Column field="serviceType" header="Type" />
        <Column field="clusterIP" header="Cluster IP" />
        <Column field="externalIP" header="External IP" />
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
      <ServiceSettingsModal
        isOpen={isSettingsModalOpen}
        serviceItem={selectedItem}
        onHide={() => setSettingsModalOpen(false)}
      />
      <ServiceDetailsModal
        isOpen={isDetailsModalOpen}
        serviceItem={selectedItem}
        onHide={() => setDetailsModalOpen(false)}
      />
    </Page>
  );
};
