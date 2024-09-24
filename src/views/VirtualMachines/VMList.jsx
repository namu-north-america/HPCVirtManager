import React, { useEffect, useMemo, useRef, useState } from "react";
import Page from "../../shared/Page";
import { timeAgo } from "../../utils/date";
import CustomOverlay from "../../shared/CustomOverlay";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import { useDispatch, useSelector } from "react-redux";
import { getVMsAction } from "../../store/actions/projectActions";
import { Link } from "react-router-dom";
import AddVirtualMachineModal from "./Form/AddVirtualMachineModal";
import {
  onChangeVmStatusAction,
  onDeleteVMAction,
  onPauseVMAction,
  onRestartVMAction,
} from "../../store/actions/vmActions";
import { confirmDialog } from "primereact/confirmdialog";
import constants from "../../constants";
import MigrateModal from "./Form/MigrateModal";
import EditVmModal from "./Form/EditVmModal";
import { showToastAction } from "../../store/slices/commonSlice";
import { hasPermission } from "../../utils/commonFunctions";
const timeTemplate = (item) => {
  return <>{timeAgo(item.time)}</>;
};

const statusTemplate = (item) => {
  switch (item.status) {
    case "Starting":
      return <span className="text-pink-400">Starting</span>;
    case "Ready":
      return <span className="text-green-500">Ready</span>;
    case "Running":
      return <span className="text-cyan-500">Running</span>;
    case "Stopping":
      return <span className="text-red-400">Stopping</span>;
    case "Stopped":
      return <span className="text-red-500">Stopped</span>;
    case "Paused":
      return <span className="text-yellow-500">Paused</span>;
    default:
      return <span>{item.status}</span>;
  }
};

const breadcrumItems = [
  { label: "Virtual Machines", url: "/#/virtual-machines/list" },
  { label: "All VMs", url: "/#/virtual-machines/list" },
];
export default function VMList() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  console.log("profile", profile);

  let { vms } = useSelector((state) => state.project);
  console.log("vms",vms);
  

  const actionTemplate = (item) => {
    return (
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
              <div
                className="cursor-pointer mb-2"
                onClick={() => onOpenConsole(item)}
              >
                Open Console
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
              <div className="cursor-pointer mb-2" onClick={() => onEdit(item)}>
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
    );
  };

  useEffect(() => {
    dispatch(getVMsAction());
  }, [dispatch]);

  const vmname = (item) => {
    return (
      <Link to={`/virtual-machines/details/${item.namespace}/${item.name}`}>
        {item.name}
      </Link>
    );
  };
  const [visible, setVisible] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const [onOpenMigrate, setOpenMigrate] = useState(false);

  const ref = useRef();

  const onStart = (item) => {
    dispatch(
      onChangeVmStatusAction(item, {
        running: true,
      })
    );
  };
  const onRestart = (item) => {
    dispatch(onRestartVMAction(item));
  };
  const onStop = (item) => {
    dispatch(
      onChangeVmStatusAction(item, {
        running: false,
      })
    );
  };
  const onPauseUnpause = (item, type) => {
    dispatch(
      onPauseVMAction({ ...item, type }, () => {
        dispatch(getVMsAction());
      })
    );
  };
  const onMigrate = (item) => {
    setOpenMigrate(item);
  };
  const onOpenConsole = ({ name, namespace }) => {
    window.open(
      `${constants.baseUrl}/assets/noVNC/vnc.html?resize=scale&autoconnect=1&path=k8s/apis/subresources.kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachineinstances/${name}/vnc`,
      "mywindow",
      "menubar=1,resizable=1,width=500,height=350"
    );
  };
  const onEdit = (item) => {
    setEditInfo(item);
  };
  const onDelete = (item) => {
    confirmDialog({
      target: ref.currentTarget,
      header: "Delete Confirmation",
      message: `Do you want to delete ${item.namespace} - ${item.name} ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: " primary-button",
      accept: () => {
        dispatch(onDeleteVMAction(item));
      },
    });
  };

  const [search, setSearch] = useState("");

  vms = useMemo(
    () =>
      vms.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, vms]
  );

  const addVm = () => {
    if (profile.role === "admin") {
      setVisible(true);
    } else {
      if (hasPermission(profile, "vm-create")) {

      } else {
        dispatch(
          showToastAction({
            type: "error",
            title: "Sorry You have no permission!",
          })
        );
      }
    }
  };

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="Virtual Machines"
        onSearch={setSearch}
        onRefresh={() => {
          dispatch(getVMsAction());
        }}
        onAdd={addVm}
        addText="Add Virtual Machine"
      >
        <DataTable value={vms} tableStyle={{ minWidth: "50rem" }}>
          <Column field="name" header="Name" body={vmname}></Column>
          <Column field="status" header="Status" body={statusTemplate}></Column>
          <Column field="conditions" header="Conditions"></Column>
          <Column field="time" header="Created" body={timeTemplate}></Column>
          <Column field="ipAddress" header="IP Address"></Column>
          <Column field="guestOS" header="Guest OS"></Column>
          <Column field="node" header="Node"></Column>
          <Column field="namespace" header="Namespace"></Column>
          <Column field="cluster" header="Cluster"></Column>
          <Column body={actionTemplate}></Column>
        </DataTable>
        <AddVirtualMachineModal visible={visible} setVisible={setVisible} />
        <MigrateModal visible={onOpenMigrate} setVisible={setOpenMigrate} />
        <EditVmModal visible={editInfo} setVisible={setEditInfo} />
      </Page>
    </>
  );
}
