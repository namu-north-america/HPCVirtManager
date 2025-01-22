import Page from "../../shared/Page";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getVMPoolsAction } from "../../store/actions/vmActions";
import { useDispatch } from "react-redux";
import { statusTemplate } from "../../shared/DataTableTemplates";
import { Link } from "react-router-dom";

export default function VMPools() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onAdd = () => {
        navigate("/virtual-machines/add", { state: { isVmPool: true } });
    }
    const { vmPools } = useSelector(state => state.project);
    console.log(vmPools);

    useEffect(() => {
        dispatch(getVMPoolsAction());
    }, []);

    const nameTemplate = (item) => {
        return (
            <Link to={`/virtual-machines/list`} state={{ filteredVMPool: item.name }}>
                {item.name}
            </Link>
        )
    }

    return (
        <Page title="VM Pools" onAdd={onAdd} addText="Add VM Pool">
            <DataTable value={vmPools}>
                <Column field="namespace" header="Namespace"></Column>
                <Column field="name" header="Name" body={nameTemplate}></Column>
                <Column field="status" header="Status" body={(item) => <span>{statusTemplate('Running')}({item.status})</span>}></Column>
                <Column field="instancetype" header="Instance Type"></Column>
                <Column field="replicas" header="Replicas"></Column>
            </DataTable>
        </Page>
    )
}
