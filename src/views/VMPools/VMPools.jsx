import Page from "../../shared/Page";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getVMPoolsAction } from "../../store/actions/vmActions";
import { useDispatch } from "react-redux";
import { statusTemplate } from "../../shared/DataTableTemplates";
import CustomOverlay from '../../shared/CustomOverlay';
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

  const onStop = () => { }
  const onRestart = () => { }
  const onStart = () => { }
  const onEdit = () => { }
  const onDelete = () => { }
  const onMigrate = () => { }
  const onPauseUnpause = () => { }

  const actionTemplate = (item) => {
    return (
      <div className="flex align-items-center gap-2">
        <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
          <div>
            <div className="font-semibold mb-2">Actions</div>

            {item?.status === "Running" && (
              <>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onPauseUnpause(item, "pause")}
                >
                  Pause
                </div>
                <div className="cursor-pointer mb-2" onClick={() => onStop(item)}>
                  Stop
                </div>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onRestart(item)}
                >
                  Restart
                </div>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onMigrate(item)}
                >
                  Migrate
                </div>
              </>
            )}
            {item?.status === "Paused" && (
              <>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onPauseUnpause(item, "unpause")}
                >
                  Unpause
                </div>
                <div className="cursor-pointer mb-2" onClick={() => onStop(item)}>
                  Stop
                </div>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onRestart(item)}
                >
                  Restart
                </div>
              </>
            )}
            {(item?.status === "Stopped" || item?.status === "Stopping") && (
              <>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onStart(item)}
                >
                  Start
                </div>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onMigrate(item)}
                >
                  Migrate
                </div>
                <div
                  className="cursor-pointer mb-2"
                  onClick={() => onEdit(item)}
                >
                  Edit VM
                </div>
                <div className="cursor-pointer" onClick={() => onDelete(item)}>
                  Delete VM
                </div>
              </>
            )}

            {!["Running", "Paused", "Stopped", "Stopping"].includes(
              item?.status
            ) && (
                <>
                  <div className="cursor-pointer mb-2" onClick={() => onStop(item)}>
                    Stop
                  </div>
                </>
              )}
          </div>
        </CustomOverlay>
      </div>
    );
  }

  const vmPoolStatusTemplate = (item) => {
    return (
      <span>{statusTemplate(item.status)}{item.runningReplicas}</span>
    )
  }

  return (
    <Page title="VM Pools" onAdd={onAdd} addText="Add VM Pool">
      <DataTable value={vmPools}>
        <Column field="namespace" header="Namespace"></Column>
        <Column field="name" header="Name" body={nameTemplate}></Column>
        <Column field="status" header="Status" body={vmPoolStatusTemplate}></Column>
        <Column field="instancetype" header="Instance Type"></Column>
        <Column field="replicas" header="Replicas"></Column>
        <Column body={actionTemplate}></Column>
      </DataTable>
    </Page>
  )
}
