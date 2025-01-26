import { ActionTemplate, IconTemplate, VmName } from "./VmTemplates";
import { StatusTemplate, statusTemplate } from "./DataTableTemplates";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { timeAgo } from "../utils/date";
import { confirmDialog } from "primereact/confirmdialog";

import {
  onChangeVmStatusAction,
  onDeleteVMAction,
  onPauseVMAction,
  onRestartVMAction,
} from "../store/actions/vmActions";
import {
  filterNamespacesByCrudVMS,
  checkNamespaceValue,
} from "../utils/commonFunctions";
import { getVMsAction } from "../store/actions/projectActions";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

const timeTemplate = (item) => {
  return <>{timeAgo(item.time)}</>;
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


export const VMListTable = ({
  vms,
  user,
  onError: showError,
  onOpenConsole: openConsole,
  onSelectVm: setSelectedVM,
  onMigrate: onMigratePropAction,
  onEdit: onEditPropAction
}) => {
  const dispatch = useDispatch();
  const { userNamespace, profile } = user;
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
      onMigratePropAction(item);
    } else {
      showError();
    }
  };

  const onOpenConsole = (vm) => {
    openConsole(vm)
  };

  const onEdit = (item) => {
    onEditPropAction(item);
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

  const actionTemplate = useCallback((item) => {
    return (
      <ActionTemplate item={item} onActions={{ onStop, onOpenConsole, onPauseUnpause, onRestart, onDelete, onMigrate, onStart, onEdit }} />
    )
  }, [vms])
  console.log('vms_____', vms, userNamespace)
  return (
    <DataTable value={vms} tableStyle={{ minWidth: "50rem" }}>
      <Column body={<IconTemplate />} style={{ width: '2rem' }}></Column>
      <Column field="name" header="Name" body={(item) => <VmName item={item} user={{ userNamespace, profile }} />}></Column>
      <Column field="status" header="Status" body={(item) => <StatusTemplate status={item.status} />}></Column>
      <Column field="guestOS" header="OS" body={osTemplate}></Column>
      <Column field="time" header="Created" body={timeTemplate}></Column>
      <Column field="node" header="Node"></Column>
      <Column field="namespace" header="Namespace"></Column>
      <Column field="cluster" header="Cluster"></Column>
      <Column body={actionTemplate}></Column>
    </DataTable>
  )
}