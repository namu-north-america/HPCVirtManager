import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Page from "../../shared/Page";

export default function InstanceTypes() {
  return (
    <Page title="Instance Types" addText="New Instance" onAdd={() => {}}>
        <DataTable>
            <Column field="name" header="Name"></Column>
            <Column field="cpu" header="CPU"></Column>
            <Column field="memory" header="Memory"></Column>
            <Column field="disk" header="Disk"></Column>
            <Column field="actions" header="Actions"></Column>
        </DataTable>
    </Page>
  );
}
