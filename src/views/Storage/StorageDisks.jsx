import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Page from "../../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomOverlay from "../../shared/CustomOverlay";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import { useDispatch, useSelector } from "react-redux";

import {
  getDisksAction,
  onAddDiskAction,
  onDeleteDiskAction,
  onDiskResizeAction,
} from "../../store/actions/storageActions";
import CustomModal from "../../shared/CustomModal";
import {
  CustomDropDown,
  CustomForm,
  CustomInput,
  CustomMemoryInput,
} from "../../shared/AllInputs";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../shared/CustomButton";
import formValidation from "../../utils/validations";
import { showToastAction } from "../../store/slices/commonSlice";
import {
  showFormErrors,
  filterNamespacesBycrudDataVolume,
  checkNamespaceValue,
} from "../../utils/commonFunctions";
import {
  longOverlayText,
  nameTemplate,
  timeTemplate,
} from "../../shared/TableHelpers";
import { confirmDialog } from "primereact/confirmdialog";
import { getStorageClassesAction } from "../../store/actions/storageActions";

const breadcrumItems = [
  { label: "Storage", url: "/#/storage/disk" },
  { label: "Disk", url: "/#/storage/disk" },
];
export default function StorageDisks() {
  const dispatch = useDispatch();
  const [namespace, setNamespace] = useState([]);
  const { profile, userNamespace } = useSelector((state) => state.user);
  let {
    disks,
    namespacesDropdown,
    storageClassesDropdown,
    accessModeDropdown,
  } = useSelector((state) => state.project);
  useEffect(() => {
    dispatch(getDisksAction());
    dispatch(getStorageClassesAction());
  }, [dispatch]);

  const hasAccess = useCallback(() => {
    if (profile?.role === "admin") {
      setNamespace(namespacesDropdown);
    } else {
      const filteredNamespaces = filterNamespacesBycrudDataVolume(
        namespacesDropdown,
        userNamespace
      );
      const namespaceArray = filteredNamespaces.map((item) => item.namespace);
      setNamespace(namespaceArray);
    }
  }, [profile, namespacesDropdown, userNamespace]);
  // create hasAccess dispatch
  useEffect(() => {
    hasAccess();
  }, [hasAccess]);

  const showError = () => {
    dispatch(
      showToastAction({
        type: "error",
        title: "Sorry You have no permission!",
      })
    );
  };

  const [loading, setLoading] = useState(false);

  const [disk, setDisk] = useState({
    name: "",
    size: "",
    memoryType: "Gi",
    namespace: "",
    storageClass: "",
    accessMode: "",

    visible: false,
    type: "blank",
    url: "",
  });

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, disk);
    if (name === "type" && value === "blank") {
      setDisk((prev) => ({ ...prev, [name]: value, url: "", formErrors }));
    } else {
      setDisk((prev) => ({ ...prev, [name]: value, formErrors }));
    }
  };
  const onAddDisk = () => {
    let ignore = [];
    if (disk?.type === "blank") {
      ignore.push("url");
    }
    if (showFormErrors(disk, setDisk, ignore)) {
      dispatch(
        onAddDiskAction(disk, setLoading, () => {
          onHideAddDialog();
        })
      );
    }
  };
  const onOpenAddDialog = () => {
    setDisk((prev) => ({ ...prev, visible: true }));
  };
  const onHideAddDialog = () => {
    setDisk((prev) => ({ ...prev, visible: false }));
  };

  const [data, setData] = useState({
    name: "",
    namespace: "",
    currentSize: "",
    size: "",
    memoryType: "Gi",
    visible: false,
  });

  const handleUpdateChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, disk);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };
  const onDiskUpdate = () => {
    if (showFormErrors(data, setData)) {
      let { name, namespace, size, memoryType } = data;
      if (namespace && name && size) {
        dispatch(
          onDiskResizeAction({ namespace, name, size, memoryType }, () => {
            setData({
              name: "",
              namespace: "",
              currentSize: "",
              size: "",
              memoryType: "Gi",
              visible: false,
            });
          })
        );
      }
    }
  };
  const onHideUpdateDialog = () => {
    setData({
      name: "",
      namespace: "",
      currentSize: "",
      size: "",
      visible: false,
    });
  };
  const onOpenUpdateDialog = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudDataVolume") ||
      profile?.role === "admin"
    ) {
      setData({
        name: item.name,
        namespace: item.namespace,
        currentSize: item.size,
        size: "",
        memoryType: "Gi",
        visible: true,
      });
    } else {
      showError();
    }
  };

  const actionTemplate = (item) => {
    return (
      <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
        <div className="px-2">
          <div className="font-semibold my-2">Actions</div>
          <div
            className="cursor-pointer mb-2"
            onClick={() => onOpenUpdateDialog(item)}
          >
            Resize
          </div>
          <div
            key={item.name}
            className="cursor-pointer mb-2"
            onClick={(e) => onDelete(item)}
          >
            Delete
          </div>
        </div>
      </CustomOverlay>
    );
  };

  const ref = useRef();

  const onDelete = (item) => {
    if (
      checkNamespaceValue(userNamespace, item.namespace, "crudDataVolume") ||
      profile?.role === "admin"
    ) {
      confirmDialog({
        target: ref.currentTarget,
        header: "Delete Confirmation",
        message: `Do you want to delete ${item.namespace} - ${item.name} ?`,
        icon: "pi pi-info-circle",
        rejectClassName: "p-button-outlined p-button-secondary",
        acceptClassName: " primary-button",
        accept: () => {
          dispatch(onDeleteDiskAction(item));
        },
      });
    } else {
      showError();
    }
  };

  const [search, setSearch] = useState("");

  disks = useMemo(
    () =>
      disks.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, disks]
  );

  const typesDropdown = [
    { name: "Blank", value: "blank" },
    { name: "HTTP(s)", value: "http" },
    { name: "Registry", value: "registry" },
    { name: "GCS", value: "gcs" },
    { name: "S3", value: "s3" },
  ];

  return (
    <>
      <div ref={ref}></div>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="Storage Disks"
        onSearch={setSearch}
        onRefresh={() => {
          dispatch(getDisksAction());
        }}
        onAdd={onOpenAddDialog}
        addText="Create New Storage Disk"
      >
        <DataTable value={disks}>
          <Column
            field="name"
            header="Name"
            body={nameTemplate}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column field="size" header="Size"></Column>
          <Column field="namespace" header="Namespace"></Column>
          <Column field="status" header="Status"></Column>
          <Column
            field="conditions"
            header="Conditions"
            style={{ minWidth: "160px" }}
          ></Column>
          <Column field="storageClass" header="Storage Class"></Column>
          <Column
            field="OSImageURL"
            header="OS image URL "
            body={(item) => longOverlayText(item, "OSImageURL")}
          ></Column>
          <Column field="accessMode" header="Access Mode"></Column>
          <Column
            field="time"
            header="Created"
            body={timeTemplate}
            style={{ minWidth: "160px" }}
          ></Column>
          <Column body={actionTemplate}></Column>
        </DataTable>
      </Page>
      {/* Update Modal */}
      <CustomModal
        title="Resizing a Storage Disk"
        visible={data.visible}
        onHide={onHideUpdateDialog}
      >
        <CustomForm>
          <CustomInput data={data} name="name" disabled col={12} />
          <CustomInput
            data={data}
            name="currentSize"
            label="Current Size"
            disabled
            col={12}
          />
          <CustomMemoryInput
            data={data}
            onChange={handleUpdateChange}
            name="size"
            label="New Size"
            typeName="memoryType"
            onTypeChange={handleUpdateChange}
            required
            keyfilter="pint"
            col={12}
          />
        </CustomForm>
        <Buttonlayout>
          <CustomButton
            icon="pi pi-save"
            label="Update"
            onClick={onDiskUpdate}
          />
          <CustomButtonOutlined
            label="Cancel"
            icon="pi pi-times"
            onClick={onHideUpdateDialog}
            severity="secondary"
          />
        </Buttonlayout>
      </CustomModal>

      {/* Add Modal  */}
      <CustomModal
        title="Add a New Storage Disk"
        visible={disk.visible}
        onHide={onHideAddDialog}
      >
        <CustomForm>
          <CustomInput
            data={disk}
            name="name"
            onChange={handleChange}
            required
            col={12}
          />
          <CustomMemoryInput
            data={disk}
            onChange={handleChange}
            name="size"
            label="Size"
            typeName="memoryType"
            onTypeChange={handleChange}
            required
            keyfilter="pint"
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChange}
            name="namespace"
            options={namespace}
            required
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChange}
            name="storageClass"
            options={storageClassesDropdown}
            required
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChange}
            name="accessMode"
            options={accessModeDropdown}
            required
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChange}
            name="type"
            options={typesDropdown}
            required
            col={12}
          />
          {disk?.type !== "blank" && (
            <CustomInput
              data={disk}
              name="url"
              label="URL"
              placeholder="HTTP/S3/Registry source"
              onChange={handleChange}
              col={12}
              required
            />
          )}
        </CustomForm>
        <Buttonlayout>
          <CustomButton
            label="Save"
            icon="pi pi-save"
            loading={loading}
            onClick={onAddDisk}
          />
          <CustomButtonOutlined
            label="Cancel"
            icon="pi pi-times"
            onClick={onHideAddDialog}
            severity="secondary"
          />
        </Buttonlayout>
      </CustomModal>
    </>
  );
}
