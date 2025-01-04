import React, { useEffect, useMemo } from "react";
import { CustomDropDown, CustomForm, CustomInput, CustomMemoryInput } from "../../../shared/AllInputs";
import { useSelector } from "react-redux";
import formValidation from "../../../utils/validations";
import { confirmPopup } from "primereact/confirmpopup";

export default function Storage({ disk, setDisk, index, onRemoveDisk, data }) {
  const { storageClassesDropdown, accessModeDropdown, disksDropdown, images } = useSelector((state) => state.project);
  const { useVmTemplate } = useSelector((state) => state.vm);

  const handleChangeDisk = ({ name, value }) => {
    let formErrors = formValidation(name, value, disk);

    if (name === "createType") {
      formErrors = {};
    }
    setDisk((prev) => {
      let arr = [...prev];
      arr[index][name] = value;
      arr[index]["formErrors"] = formErrors;
      return arr;
    });
  };

  const onDelete = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to remove this disk?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: " primary-button",
      accept: () => {
        onRemoveDisk(index);
      },
      reject: () => {},
    });
  };

  const typesDropdown = [
    { name: "Blank", value: "blank" },
    { name: "HTTP(s)", value: "http" },
    { name: "Registry", value: "registry" },
    { name: "GCS", value: "gcs" },
    { name: "S3", value: "s3" },
  ];

  const filteredDiskes = useMemo(
    () => disksDropdown.filter((item) => item.namespace === data?.namespace).map((item) => item?.name),
    [disksDropdown, data]
  );

  const imagesDropdown = useMemo(
    () => images.filter((item) => item.namespace === data?.namespace).map((item) => item?.name),
    [images]
  );

  return (
    <>
      <CustomForm>
        <CustomDropDown
          onChange={handleChangeDisk}
          data={disk}
          name="createType"
          label={`Select a storage disk(${index + 1}) option`}
          options={[
            { name: "Create a new storage disk", value: "new" },
            { name: "Attach an existing storage disk", value: "existing" },
            { name: "Attach an image", value: "image" },
          ]}
          required
          disabled={useVmTemplate}
          col={12}
        />
        <CustomDropDown
          onChange={handleChangeDisk}
          data={disk}
          name="diskType"
          options={[
            { name: "Disk", value: "disk" },
            { name: "CDROM", value: "cdrom" },
          ]}
          disabled={useVmTemplate}
          required
        />
        <CustomDropDown
          onChange={handleChangeDisk}
          data={disk}
          name="busType"
          value={useVmTemplate ? "virtio" : ""}
          disabled={useVmTemplate}
          options={[
            { name: "virtio", value: "virtio" },
            { name: "sata", value: "sata" },
            { name: "scsi", value: "scsi" },
          ]}
        />
      </CustomForm>
      {disk.createType === "new" && (
        <CustomForm>
          <CustomMemoryInput
            value={disk.size}
            onChange={handleChangeDisk}
            name="size"
            typeName="memoryType"
            onTypeChange={handleChangeDisk}
            required
            keyfilter="pint"
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChangeDisk}
            name="storageClass"
            options={storageClassesDropdown}
            required
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChangeDisk}
            name="accessMode"
            options={accessModeDropdown}
            required
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChangeDisk}
            name="type"
            options={typesDropdown}
            required
            disabled={useVmTemplate}
            col={12}
          />

          {disk?.type !== "blank" && (
            <CustomInput
              data={disk}
              name="url"
              label="URL"
              placeholder="HTTP/S3/Registry source"
              onChange={handleChangeDisk}
              col={12}
              required
            />
          )}
        </CustomForm>
      )}

      {disk.createType === "existing" && (
        <CustomForm>
          <CustomDropDown
            data={disk}
            onChange={handleChangeDisk}
            name="disk"
            options={disksDropdown.map((disk) => ({ name: disk, value: disk }))}
            required
            col={12}
          />
        </CustomForm>
      )}
      {disk.createType === "image" && (
        <CustomForm>
          <CustomMemoryInput
            data={disk}
            onChange={handleChangeDisk}
            name="size"
            typeName="memoryType"
            onTypeChange={handleChangeDisk}
            required
            keyfilter="pint"
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChangeDisk}
            name="storageClass"
            options={storageClassesDropdown}
            required
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChangeDisk}
            name="accessMode"
            options={accessModeDropdown}
            required
            col={12}
          />
          <CustomDropDown
            data={disk}
            onChange={handleChangeDisk}
            name="image"
            options={imagesDropdown}
            disabled={useVmTemplate}
            required
            col={12}
          />
        </CustomForm>
      )}
      {index ? (
        <div className="flex justify-content-end">
          <span className="mr-3 cursor-pointer" onClick={onDelete}>
            <i className="pi pi-trash"></i> Remove
          </span>
        </div>
      ) : null}
    </>
  );
}
