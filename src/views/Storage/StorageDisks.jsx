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
import { getImagesAction } from "../../store/actions/imageActions";
import { FaDatabase } from "react-icons/fa";
import { Tooltip } from "primereact/tooltip";

const iconTemplate = () => {
  return (
    <div className="flex justify-center">
      <FaDatabase className="text-gray-600 text-xl" />
    </div>
  );
};

const statusTemplate = (rowData) => {
  const getStatusClass = (status) => {
    const baseClasses = "text-sm px-2 py-0.5 rounded-lg inline-block font-medium border";
    switch (status) {
      case "Succeeded":
        return `${baseClasses} text-green-700 bg-green-50 border-green-200`;
      case "Pending":
        return `${baseClasses} text-yellow-700 bg-yellow-50 border-yellow-200`;
      case "Running":
        return `${baseClasses} text-cyan-700 bg-cyan-50 border-cyan-200`;
      case "Failed":
        return `${baseClasses} text-red-700 bg-red-50 border-red-200`;
      default:
        return `${baseClasses} text-gray-700 bg-gray-50 border-gray-200`;
    }
  };

  return (
    <div className="tooltip-target" data-pr-tooltip={`Status: ${rowData.status}`}>
      <span className={getStatusClass(rowData.status)}>
        <i style={{ 
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          marginRight: '6px',
          verticalAlign: 'middle'
        }}></i>
        {rowData.status || "Unknown"}
      </span>
      <Tooltip target=".tooltip-target" />
    </div>
  );
};

const conditionsTemplate = (rowData) => {
  const message = rowData.conditions || "No conditions reported";
  return (
    <div 
      className="tooltip-conditions cursor-help truncate max-w-xs" 
      data-pr-tooltip={message}
    >
      <span className="text-sm">{message}</span>
      <Tooltip target=".tooltip-conditions" />
    </div>
  );
};

export default function StorageDisks() {
  const dispatch = useDispatch();
  const [namespace, setNamespace] = useState([]);
  const { profile, userNamespace } = useSelector((state) => state.user);
  const { images } = useSelector((state) => state.project);

  let {
    disks,
    namespacesDropdown,
    storageClassesDropdown,
    accessModeDropdown,
  } = useSelector((state) => state.project);
  useEffect(() => {
    dispatch(getDisksAction());
    dispatch(getStorageClassesAction());
    dispatch(getImagesAction());
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
    image: "",
    visible: false,
    type: "blank",
    url: "",
  });

  const handleChange = ({ name, value }) => {
    let ignore = [];
    if (disk.type === "blank") {
      ignore = ["url", "image"];
    } else if (disk.type === "image") {
      ignore = ["url"];
    } else if (["http", "registry", "gcs", "s3"].includes(disk.type)) {
      ignore = ["image"];
    }
    const formErrors = formValidation(name, value, disk, ignore);
    if (name === "type") {
      if (value === "blank") {
        setDisk((prev) => ({ ...prev, [name]: value, url: "", image: "", formErrors }));
      } else if (value === "image") {
        setDisk((prev) => ({ ...prev, [name]: value, url: "", formErrors }));
      } else if (["http", "registry", "gcs", "s3"].includes(value)) {
        setDisk((prev) => ({ ...prev, [name]: value, image: "", formErrors }));
      }
    } else {
      setDisk((prev) => ({ ...prev, [name]: value, formErrors }));
    }
  };

  const onAddDisk = () => {
    let ignore = [];
    if (disk.type === "blank") {
      ignore = ["url", "image"];
    } else if (disk.type === "image") {
      ignore = ["url"];
    } else if (["http", "registry", "gcs", "s3"].includes(disk.type)) {
      ignore = ["image"];
    }

    if (showFormErrors(disk, setDisk, ignore)) {
      dispatch(
        onAddDiskAction(disk, images, setLoading, () => {
          onHideAddDialog();
        })
      );
    }
  };

  const onOpenAddDialog = () => {
    setDisk((prev) => ({ ...prev, visible: true }));
  };
  const onHideAddDialog = () => {
    setDisk((prev) => ({
      name: "",
      size: "",
      memoryType: "Gi",
      namespace: "",
      storageClass: "",
      accessMode: "",
      image: "",
      visible: false,
      type: "blank",
      url: "",
    }));
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

  const imagesDropdown = useMemo(
    () =>
      images
        .filter((item) => item.namespace === disk.namespace)
        .map((item) => item?.name),
    [images, disk.namespace]
  );

  useEffect(() => {
    setDisk((prev) => ({ ...prev, image: "" }));
  }, [disk.namespace]);

  const typesDropdown = [
    { name: "Image", value: "image" },
    { name: "Blank", value: "blank" },
    { name: "HTTP(s)", value: "http" },
    { name: "Registry", value: "registry" },
    { name: "GCS", value: "gcs" },
    { name: "S3", value: "s3" },
  ];

  return (
    <>
      <div ref={ref}></div>
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
            body={iconTemplate}
            style={{ width: "2rem" }}
            className="text-center"
          />
          <Column
            field="name"
            header="Name"
            body={nameTemplate}
            style={{ minWidth: "200px" }}
          />
          <Column field="size" header="Size" />
          <Column field="namespace" header="Namespace" />
          <Column 
            field="status" 
            header="Status"
            body={statusTemplate}
            style={{ minWidth: "120px" }}
          />
          <Column
            field="conditions"
            header="Conditions"
            body={conditionsTemplate}
            style={{ minWidth: "160px" }}
          />
          <Column field="storageClass" header="Storage Class"></Column>
          <Column
            field="OSImageURL"
            header="OS image URL "
            body={(item) => longOverlayText(item, "OSImageURL")}
          />
          <Column field="time" header="Created" body={timeTemplate} style={{ minWidth: "160px" }}></Column>
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
          {disk?.type !== "blank" && disk?.type !== "image" && (
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

          {disk?.type === "image" && (
            <CustomDropDown
              data={disk}
              onChange={handleChange}
              name="image"
              options={imagesDropdown}
              required
              col={12}
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
