import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Page from "../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomOverlay from "../shared/CustomOverlay";
import CustomBreadcrum from "../shared/CustomBreadcrum";
import { useDispatch, useSelector } from "react-redux";
import {
  getImagesAction,
  onAddImageAction,
  onDeleteImageAction,
  onEditImageAction,
} from "../store/actions/imageActions";
import CustomModal from "../shared/CustomModal";
import {
  CustomDropDown,
  CustomField,
  CustomForm,
  CustomInput,
} from "../shared/AllInputs";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../shared/CustomButton";
import formValidation from "../utils/validations";
import { showFormErrors } from "../utils/commonFunctions";
import { longOverlayText, timeTemplate } from "../shared/TableHelpers";
import { confirmDialog } from "primereact/confirmdialog";
import { Link } from "react-router-dom";

const breadcrumItems = [{ label: "Images", url: "/#/images" }];
export default function Images() {
  const dispatch = useDispatch();
  let { images, namespacesDropdown } = useSelector((state) => state.project);

  const onLoad = useCallback(() => {
    dispatch(getImagesAction());
  }, [dispatch]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState({
    name: "",
    namespace: "",
    readableName: "",
    readableDescription: "",
    type: "http",
    url: "",
    visible: false,
  });

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, image);
    setImage((prev) => ({ ...prev, [name]: value, formErrors }));
  };
  const onAddImage = () => {
    if (showFormErrors(image, setImage)) {
      dispatch(
        onAddImageAction(image, setLoading, () => {
          onHideAddDialog();
        })
      );
    }
  };
  const onOpenAddDialog = () => {
    setImage((prev) => ({ ...prev, visible: true }));
  };
  const onHideAddDialog = () => {
    setImage((prev) => ({
      name: "",
      namespace: "",
      readableName: "",
      readableDescription: "",
      type: "http",
      url: "",
      visible: false,
    }));
  };

  const onOpenViewDialog = (item) => {
    setImage({ ...item, viewVisible: true });
  };

  const onHideViewDialog = () => {
    setImage({
      name: "",
      namespace: "",
      readableName: "",
      readableDescription: "",
      type: "http",
      url: "",
      visible: false,
    });
  };

  const [data, setData] = useState({
    name: "",
    readableName: "",
    readableDescription: "",
    url: "",
    visible: false,
  });

  const handleUpdateChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const onImageUpdate = () => {
    if (showFormErrors(data, setData)) {
      dispatch(
        onEditImageAction(data, setLoading, () => {
          setData({
            name: "",
            readableName: "",
            readableDescription: "",
            url: "",
            visible: false,
          });
        })
      );
    }
  };
  const onHideUpdateDialog = () => {
    setData({
      name: "",
      readableName: "",
      readableDescription: "",
      url: "",
      visible: false,
    });
  };
  const onOpenUpdateDialog = (item) => {
    setData({
      name: item.name,
      namespace: item.namespace,
      readableName: item.readableName,
      readableDescription: item.readableDescription,
      url: item.url,
      visible: true,
    });
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
            Edit
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
    confirmDialog({
      target: ref.currentTarget,
      header: "Delete Confirmation",
      message: `Do you want to delete ${item.namespace} - ${item.name} ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: " primary-button",
      accept: () => {
        dispatch(onDeleteImageAction(item));
      },
    });
  };

  const [search, setSearch] = useState("");

  images = useMemo(
    () =>
      images.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, images]
  );

  const typesDropdown = [
    { name: "HTTP(s)", value: "http" },
    { name: "Registry", value: "registry" },
    { name: "GCS", value: "gcs" },
    { name: "S3", value: "s3" },
  ];

  const nameTemplate = (item) => {
    return (
      <Link className="link" onClick={() => onOpenViewDialog(item)}>
        {item.name}
      </Link>
    );
  };

  return (
    <>
      <div ref={ref}></div>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="Images"
        onSearch={setSearch}
        onRefresh={onLoad}
        onAdd={onOpenAddDialog}
        addText="Create New Image"
      >
        <DataTable value={images}>
          <Column field="namespace" header="Namespace" />
          <Column
            field="name"
            header="Name"
            body={nameTemplate}
            style={{ minWidth: "200px" }}
          />
          <Column field="type" header="Type" />
          <Column field="readableName" header="Readable Name" />
          <Column
            field="url"
            header="URL "
            body={(item) => longOverlayText(item, "url")}
          />
          <Column
            field="time"
            header="Created"
            body={timeTemplate}
            style={{ minWidth: "160px" }}
          />
          <Column body={actionTemplate} />
        </DataTable>
      </Page>
      {/* Update Modal */}
      <CustomModal
        title={`Edit: ${data?.name}`}
        visible={data.visible}
        onHide={onHideUpdateDialog}
      >
        <CustomForm>
          <CustomInput
            data={data}
            name="readableName"
            onChange={handleUpdateChange}
            required
            col={12}
          />
          <CustomInput
            data={data}
            name="readableDescription"
            onChange={handleUpdateChange}
            col={12}
          />
          <CustomInput
            data={data}
            name="url"
            label="URL"
            placeholder="HTTP/S3/Registry source"
            onChange={handleUpdateChange}
            col={12}
            required
          />
        </CustomForm>
        <Buttonlayout>
          <CustomButton
            icon="pi pi-save"
            label="Update"
            loading={loading}
            onClick={onImageUpdate}
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
        title="Add New Image"
        visible={image.visible}
        onHide={onHideAddDialog}
      >
        <CustomForm>
          <CustomInput
            data={image}
            name="name"
            onChange={handleChange}
            required
            col={12}
          />
          <CustomDropDown
            data={image}
            onChange={handleChange}
            name="namespace"
            options={namespacesDropdown}
            required
            col={12}
          />
          <CustomInput
            data={image}
            name="readableName"
            onChange={handleChange}
            required
            col={12}
          />
          <CustomInput
            data={image}
            name="readableDescription"
            onChange={handleChange}
            col={12}
          />
          <CustomDropDown
            data={image}
            onChange={handleChange}
            name="type"
            options={typesDropdown}
            required
            col={12}
          />
          <CustomInput
            data={image}
            name="url"
            label="URL"
            placeholder="HTTP/S3/Registry source"
            onChange={handleChange}
            col={12}
            required
          />
        </CustomForm>
        <Buttonlayout>
          <CustomButton
            label="Save"
            icon="pi pi-save"
            loading={loading}
            onClick={onAddImage}
          />
          <CustomButtonOutlined
            label="Cancel"
            icon="pi pi-times"
            onClick={onHideAddDialog}
            severity="secondary"
          />
        </Buttonlayout>
      </CustomModal>

      {/* View Modal  */}
      <CustomModal
        title={`Image: ${image.namespace}-${image.name}`}
        visible={image.viewVisible}
        onHide={onHideViewDialog}
      >
        <CustomForm>
          <CustomField data={image} name="name" />
          <CustomField data={image} name="namespace" />
          <CustomField data={image} name="readableName" />
          <CustomField data={image} name="readableDescription" />
          <CustomField data={image} name="type" />
          <CustomField data={image} name="url" />
          <CustomField name="createdAt" value={timeTemplate(image)} />
        </CustomForm>
      </CustomModal>
    </>
  );
}
