import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Page from "../../shared/Page";
import NewInstaceDialog from "./NewInstaceDialog";
import { useDispatch, useSelector } from "react-redux";
import { getInstanceTypesAction, onDeleteInstanceType } from "../../store/actions/vmActions";
import { ActionItem, ActionsOverlay } from "../../shared/ActionsOverlay";

const ActionsTemplate = ({ item, onDelete, onEdit }) => {
  return (
    <ActionsOverlay>
      <ActionItem onClick={() => onDelete(item)}>Delete</ActionItem>
      <ActionItem onClick={() => onEdit(item)}>Edit</ActionItem>
    </ActionsOverlay>
  )
}

export default function InstanceTypes() {
  const [isOpen, setVisible] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState({});
  const [mode, setMode] = useState('NEW');
  const instanceTypes = useSelector(state => state.project.instanceTypes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInstanceTypesAction());
  }, []);

  const onDelete = (item) => {
    dispatch(onDeleteInstanceType({ name: item.name }, () => { }))
  }

  const onEdit = (item) => {
    setVisible(true)
    const memory = parseInt(item.memory.match(/\d+/)[0], 10);
    setSelectedInstance({ ...item, memory });
    setMode('EDIT')
  };

  return (
    <Page title="Instance Types" addText="New Instance" onAdd={() => { setVisible(true) }}>
      <DataTable value={instanceTypes}>
        <Column field="name" header="Name"></Column>
        <Column field="cpu" header="CPU"></Column>
        <Column field="memory" header="Memory"></Column>
        <Column field="actions" body={(item) => <ActionsTemplate item={item} onDelete={onDelete} onEdit={onEdit} />}></Column>
      </DataTable>
      <NewInstaceDialog isOpen={isOpen} setVisible={setVisible} defaultValues={selectedInstance} mode={mode} />
    </Page>
  );
}
