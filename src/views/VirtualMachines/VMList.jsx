import React, { useEffect, useMemo, useState } from "react";
import Page from "../../shared/Page";
import { timeAgo } from "../../utils/date";
import CustomOverlay from "../../shared/CustomOverlay";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import { useDispatch, useSelector } from "react-redux";
import { getVMsAction } from "../../store/actions/projectActions";
import { Link, useNavigate } from "react-router-dom";
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
import {
  filterNamespacesByCrudVMS,
  checkNamespaceValue,
} from "../../utils/commonFunctions";
import { getImagesAction } from "../../store/actions/imageActions";
import { Tooltip } from "primereact/tooltip";
import { VncScreen } from 'react-vnc';
import { Dialog } from 'primereact/dialog';
import { FaDesktop } from 'react-icons/fa';

const iconTemplate = () => {
  return (
    <div className="flex justify-center">
      <FaDesktop className="text-gray-600 text-xl" />
    </div>
  );
};

const timeTemplate = (item) => {
  return <>{timeAgo(item.time)}</>;
};

const statusTemplate = (item) => {
  const getStatusClass = (status) => {
    const baseClasses = "text-sm px-2 py-0.5 rounded-lg inline-block font-medium border";
    switch (status) {
      case "Starting":
        return `${baseClasses} text-pink-700 bg-pink-50 border-pink-200`;
      case "Ready":
        return `${baseClasses} text-green-700 bg-green-50 border-green-200`;
      case "Running":
        return `${baseClasses} text-cyan-700 bg-cyan-50 border-cyan-200`;
      case "Stopping":
        return `${baseClasses} text-red-700 bg-red-50 border-red-200`;
      case "Stopped":
        return `${baseClasses} text-red-700 bg-red-50 border-red-200`;
      case "Paused":
        return `${baseClasses} text-yellow-700 bg-yellow-50 border-yellow-200`;
      default:
        return `${baseClasses} text-gray-700 bg-gray-50 border-gray-200`;
    }
  };

  return (
    <span className={getStatusClass(item.status)}>
      <i style={{ 
        display: 'inline-block',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        marginRight: '6px',
        verticalAlign: 'middle'
      }}></i>
      {item.status}
    </span>
  );
};

const osTemplate = (item) => {
  const tooltipId = `os-tooltip-${item.id}`;
  return (
    <>
      <span
        data-pr-tooltip={item.guestOS ? undefined : "OS information is only available for running VMs with guest agent installed"}
        data-pr-position="top"
        data-pr-at="center+2 top-2"
        className="cursor-help"
      >
        {item.guestOS || '-'}
      </span>
      <Tooltip target={`[data-pr-tooltip]`} />
    </>
  );
};

const breadcrumItems = [
  { label: "Virtual Machines", url: "/#/virtual-machines/list" },
  { label: "All VMs", url: "/#/virtual-machines/list" },
];

export default function VMList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, userNamespace } = useSelector((state) => state.user);
  let { vms, namespacesDropdown } = useSelector((state) => state.project);

  const hasAccess = () => {
    if (profile?.role === "admin") return true;
    else {
      const filteredNamespaces = filterNamespacesByCrudVMS(
        namespacesDropdown,
        userNamespace
      );
      return filteredNamespaces.length > 0;
    }
  };

  const [search, setSearch] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [selectedVm, setSelectedVm] = useState(null);
  const [migrateVisible, setMigrateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVncDialog, setShowVncDialog] = useState(false);
  const [selectedVM, setSelectedVM] = useState(null);

  useEffect(() => {
    dispatch(getVMsAction());
    dispatch(getImagesAction());
  }, [dispatch]);

  useEffect(() => {
    if (namespacesDropdown.length) {
      const _namespaces = filterNamespacesByCrudVMS(
        namespacesDropdown,
        userNamespace
      );
      if (_namespaces.length) {
        setSelectedNamespace(_namespaces[0]);
      }
    }
  }, [namespacesDropdown, userNamespace]);

  useEffect(() => {
    if (selectedNamespace) {
      dispatch(getVMsAction(selectedNamespace));
      dispatch(getImagesAction(selectedNamespace));
    }
  }, [selectedNamespace, dispatch]);

  const actionTemplate = (item) => {
    return (
      <div className="flex align-items-center gap-2">
        {item?.status === "Running" && (
          <button 
            className="p-link inline-flex align-items-center justify-content-center"
            onClick={() => onOpenConsole(item)}
            style={{ 
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              padding: 0
            }}
          >
            <i 
              className="pi pi-code"
              style={{ 
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                margin: 0,
                lineHeight: 0
              }}
            />
          </button>
        )}
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
  };

  const vmname = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
      profile?.role === "admin"
    ) {
      return (
        <Link to={`/virtual-machines/details/${item.namespace}/${item.name}`}>
          {item.name}
        </Link>
      );
    } else {
      return <>{item.name}</>;
    }
  };

  vms = useMemo(
    () =>
      vms.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, vms]
  );

  const showError = () => {
    dispatch(
      showToastAction({
        type: "error",
        title: "Sorry You have no permission!",
      })
    );
  };

  const onStart = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
      profile?.role === "admin"
    ) {
      dispatch(
        onChangeVmStatusAction(item, {
          running: true,
        })
      );
    } else {
      showError();
    }
  };
  const onRestart = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
      profile?.role === "admin"
    ) {
      dispatch(onRestartVMAction(item));
    } else {
      showError();
    }
  };
  const onStop = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
      profile?.role === "admin"
    ) {
      dispatch(
        onChangeVmStatusAction(item, {
          running: false,
        })
      );
    } else {
      showError();
    }
  };
  const onPauseUnpause = (item, type) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
      profile?.role === "admin"
    ) {
      dispatch(
        onPauseVMAction({ ...item, type }, () => {
          dispatch(getVMsAction());
        })
      );
    } else {
      showError();
    }
  };
  const onMigrate = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
      profile?.role === "admin"
    ) {
      setSelectedVM(item);
      setMigrateVisible(true);
    } else {
      showError();
    }
  };
  const onOpenConsole = (vm) => {
    setSelectedVM(vm);
    setShowVncDialog(true);
  };

  const onCloseConsole = () => {
    setShowVncDialog(false);
    setSelectedVM(null);
  };

  const onEdit = (item) => {
    setEditVisible(item);
  };
  const onDelete = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
      profile?.role === "admin"
    ) {
      confirmDialog({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        position: "top",
        accept: () => {
          dispatch(onDeleteVMAction(item));
        },
      });
    } else {
      showError();
    }
  };

  const onAdd = () => {
    if (profile.role === "admin") {
      navigate("/virtual-machines/add");
    } else {
      if (hasAccess) {
        navigate("/virtual-machines/add");
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
      <Page
        title="Virtual Machines"
        onSearch={setSearch}
        onRefresh={() => {
          dispatch(getVMsAction());
        }}
        onAdd={onAdd}
        breadcrumb={<CustomBreadcrum items={breadcrumItems} />}
        addText="New VM"
      >
        <DataTable value={vms} tableStyle={{ minWidth: "50rem" }}>
          <Column body={iconTemplate} style={{ width: '2rem' }}></Column>
          <Column field="name" header="Name" body={vmname}></Column>
          <Column field="status" header="Status" body={statusTemplate}></Column>
          <Column field="guestOS" header="OS" body={osTemplate}></Column>
          <Column field="time" header="Created" body={timeTemplate}></Column>
          <Column field="node" header="Node"></Column>
          <Column field="namespace" header="Namespace"></Column>
          <Column field="cluster" header="Cluster"></Column>
          <Column body={actionTemplate}></Column>
        </DataTable>
        {migrateVisible && (
          <MigrateModal
            visible={migrateVisible}
            onHide={() => {
              setMigrateVisible(false);
              setSelectedVM(null);
            }}
            vm={selectedVM}
          />
        )}
        <EditVmModal visible={editVisible} setVisible={setEditVisible} />
      </Page>
      <Dialog
        header={`Console: ${selectedVM?.name}`}
        visible={showVncDialog}
        style={{ width: '80vw' }}
        modal
        onHide={onCloseConsole}
        maximizable
      >
        {selectedVM && (
          <div style={{ height: '70vh', width: '100%' }}>
            <div style={{ color: 'white', padding: '10px', backgroundColor: 'black' }}>
              <strong>VNC URL :</strong> {`/server/apis/subresources.kubevirt.io/v1alpha3/namespaces/${selectedVM.namespace}/virtualmachineinstances/${selectedVM.name}/vnc`}
            </div>
            <VncScreen
              url={`/server/apis/subresources.kubevirt.io/v1alpha3/namespaces/${selectedVM.namespace}/virtualmachineinstances/${selectedVM.name}/vnc`}
              scaleViewport
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000'
              }}
              onConnect={() => console.log('VNC Connected')}
              onDisconnect={() => console.log('VNC Disconnected')}
              onError={(error) => {
                console.error('VNC Error:', error);
                dispatch(showToastAction({
                  type: 'error',
                  title: 'Console Error',
                  message: 'Failed to connect to VM console'
                }));
              }}
              wsProtocols={['binary']}
            />
          </div>
        )}
      </Dialog>
    </>
  );
}
