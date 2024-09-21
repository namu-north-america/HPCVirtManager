import React, { useEffect, useRef, useState } from "react";
import {
  CustomDropDown,
  CustomForm,
  CustomInput,
  CustomMemoryInput,
} from "../../../shared/AllInputs";
import { useSelector } from "react-redux";
import formValidation from "../../../utils/validations";
import { confirmPopup } from "primereact/confirmpopup";

export default function Namespace({ disk, setDisk, index, onRemoveDisk }) {
  const {
    storageClassesDropdown,
    accessModeDropdown,
    disksDropdown,
  } = useSelector((state) => state.project);

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

  const [permissions, setPermissions] = useState({
    userManagement: true,
    manageCluster: true,
    systemConfig: true,
    vmOperations: true,
    dataVolumes: true,
    assignRoles: true,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPermissions({ ...permissions, [name]: checked });
  };

  return (
    <>
      <CustomForm>
        <CustomDropDown
          onChange={handleChangeDisk}
          data={disk}
          name="namespace"
          options={[
            { name: "Disk", value: "disk" },
            { name: "CDROM", value: "cdrom" },
          ]}
          required
          col={12}
        />
        <div>
          <div>
            <ul style={{ listStyle: "none", padding: 0, col: 9 }}>
              <li>
                <label
                  style={{
                    color: permissions.userManagement ? "black" : "#999",
                  }}
                >
                  <input
                    type="radio"
                    name="userManagement"
                    checked={permissions.userManagement}
                    onChange={handleCheckboxChange}
                  />
                  Grant <strong>All Permissions</strong>
                </label>
              </li>
              <li>
                <label
                  style={{
                    color: permissions.userManagement ? "black" : "#999",
                  }}
                >
                  <input
                    type="radio"
                    name="manageCluster"
                    checked={permissions.manageCluster}
                    onChange={handleCheckboxChange}
                  />
                  Customize Permission
                </label>
              </li>
            </ul>
          </div>
          <div className="ml-2">
            <ul style={{ listStyle: "none", padding: 0, col: 9 }}>
              <li>
                <label
                  style={{
                    color: permissions.userManagement ? "black" : "#999",
                  }}
                >
                  <input
                    type="checkbox"
                    name="userManagement"
                    checked={permissions.userManagement}
                    onChange={handleCheckboxChange}
                  />
                  View VMs
                </label>
              </li>
              <li>
                <label
                  style={{
                    color: permissions.userManagement ? "black" : "#999",
                  }}
                >
                  <input
                    type="checkbox"
                    name="manageCluster"
                    checked={permissions.manageCluster}
                    onChange={handleCheckboxChange}
                  />
                  Create/Edit/Migrate/Delete VMs
                </label>
              </li>
              <li>
                <label
                  style={{
                    color: permissions.userManagement ? "black" : "#999",
                  }}
                >
                  <input
                    type="checkbox"
                    name="userManagement"
                    checked={permissions.userManagement}
                    onChange={handleCheckboxChange}
                  />
                  View Data Volumes
                </label>
              </li>
              <li>
                <label
                  style={{
                    color: permissions.userManagement ? "black" : "#999",
                  }}
                >
                  <input
                    type="checkbox"
                    name="manageCluster"
                    checked={permissions.manageCluster}
                    onChange={handleCheckboxChange}
                  />
                  Create/Resize/Delete Data Volumes
                </label>
              </li>
            </ul>
          </div>
        </div>
      </CustomForm>

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
