import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Page from "../../shared/Page";
import NewInstaceDialog from "./NewInstaceDialog";
import { useDispatch, useSelector } from "react-redux";
import { getInstanceTypesAction } from "../../store/actions/vmActions";

export default function InstanceTypes() {
  const [isOpen, setVisible] = useState(false);
  const instanceTypes = useSelector(state => state.project.instanceTypes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInstanceTypesAction());
  }, []);

  return (
    <Page title="Instance Types" addText="New Instance" onAdd={() => { setVisible(true) }}>
      <DataTable value={instanceTypes}>
        <Column field="name" header="Name"></Column>
        <Column field="cpu" header="CPU"></Column>
        <Column field="memory" header="Memory"></Column>
        <Column field="actions" header="Actions"></Column>
      </DataTable>
      <NewInstaceDialog isOpen={isOpen} setVisible={setVisible} />
    </Page>
  );
}
