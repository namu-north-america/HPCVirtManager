import { DataTable } from "primereact/datatable";
import Page from "../../shared/Page";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { CreateScalingGroupModal } from "./CreateScalingGroupModal";
import { useDispatch, useSelector } from "react-redux";
import { getAutoScalingGroups } from "../../store/actions/scalingActions";
import { ActionItem, ActionsOverlay } from "../../shared/ActionsOverlay";

export function AutoScaling() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { autoScalings } = useSelector((state) => state.project);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAutoScalingGroups());
  }, []);

  const actionsTemplate = (item) => {
    return (
      <ActionsOverlay>
        <ActionItem
          onClick={() => {
            setEditModalOpen(true);
          }}
        >
          Settings
        </ActionItem>
        <ActionItem onClick={() => {}}>Delete</ActionItem>
      </ActionsOverlay>
    );
  };

  return (
    <Page
      title="Auto Scaling"
      addText="New Scaling Group"
      onAdd={() => {
        setIsCreateModalOpen(true);
      }}
    >
      <DataTable value={autoScalings}>
        <Column field="name" header="Name" body="" />
        <Column field="namespace" header="Namespace" body="" />
        <Column field="vmpool" header="VM Pool" body="" />
        <Column field="min" header="Min" body="" />
        <Column field="max" header="Max" body="" />
        <Column field="metric" header="Metric" body="" />
        <Column field="threshold" header="Threshold" body="" />
        <Column field="current" header="Current" body="" />
        <Column field="desired" header="Desired" body="" />
        <Column field="utilization" header="Utilization" body="" />
        <Column body={actionsTemplate} />
      </DataTable>
      <CreateScalingGroupModal isOpen={isCreateModalOpen} onHide={() => setIsCreateModalOpen(false)} />
    </Page>
  );
}
