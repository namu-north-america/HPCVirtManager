import React, { useEffect, useMemo, useState } from "react";
import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import { useDispatch, useSelector } from "react-redux";
import { getVMsAction } from "../../store/actions/projectActions";
import { useNavigate } from "react-router-dom";
import MigrateModal from "./Form/MigrateModal";
import EditVmModal from "./Form/EditVmModal";
import { showToastAction } from "../../store/slices/commonSlice";
import { filterNamespacesByCrudVMS } from "../../utils/commonFunctions";
import { getImagesAction } from "../../store/actions/imageActions";
import { VMListTable } from "../../shared/VMListTable";
import { VncDialog } from "../../shared/VncDialog";

const breadcrumItems = [
  { label: "Virtual Machines", url: "/#/virtual-machines/list" },
  { label: "All VMs", url: "/#/virtual-machines/list" },
];

export default function VMList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, userNamespace } = useSelector((state) => state.user);
  let { vms, namespacesDropdown } = useSelector((state) => state.project);
  const [search, setSearch] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [migrateVisible, setMigrateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [showVncDialog, setShowVncDialog] = useState(false);
  const [selectedVM, setSelectedVM] = useState(null);

  const hasAccess = () => {
    if (profile?.role === "admin") return true;
    else {
      const filteredNamespaces = filterNamespacesByCrudVMS(namespacesDropdown, userNamespace);
      return filteredNamespaces.length > 0;
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

  useEffect(() => {
    dispatch(getVMsAction());
    dispatch(getImagesAction());
  }, [dispatch]);

  useEffect(() => {
    if (namespacesDropdown.length) {
      const _namespaces = filterNamespacesByCrudVMS(namespacesDropdown, userNamespace);
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

  vms = useMemo(() => vms.filter((item) => item?.name?.toLowerCase()?.includes(search?.toLowerCase())), [search, vms]);

  const showError = () => {
    dispatch(
      showToastAction({
        type: "error",
        title: "Sorry You have no permission!",
      })
    );
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
        <VMListTable
          vms={vms}
          user={{ userNamespace, profile }}
          // actionTemplate={actionTemplate}
          onError={showError}
          onOpenConsole={onOpenConsole}
          onSelectVm={setSelectedVM}
          onMigrate={() => setMigrateVisible(true)}
          setEdit={() => setEditVisible(true)}
        />
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
      <VncDialog isOpen={showVncDialog} selectedVM={selectedVM} onCloseConsole={onCloseConsole} />
    </>
  );
}
