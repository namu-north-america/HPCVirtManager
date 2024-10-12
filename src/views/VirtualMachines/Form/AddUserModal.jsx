import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getNamespacesAction } from "../../../store/actions/projectActions";
import { onAddUserAction } from "../../../store/actions/userActions";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../../shared/CustomButton";
import Grid, { Col } from "../../../shared/Grid";

// import Advanced from "./Advanced";
import formValidation from "../../../utils/validations";
import Namespace from "./Namespace";
import UserReview from "./UserReview";
import CustomCard from "../../../shared/CustomCard";
import CustomModal from "../../../shared/CustomModal";
import { showFormErrors } from "../../../utils/commonFunctions";
import { ConfirmPopup } from "primereact/confirmpopup";

import {
  CustomDropDown,
  CustomForm,
  CustomInput,
  CustomPasswordInput,
  CustomPassword
} from "../../../shared/AllInputs";

export default function AddUserModal({ visible, setVisible }) {
  const stepperRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNamespacesAction());
  }, [dispatch]);

  const [data, setData] = useState({
    email: "",
    userName: "",
    password: "",
    department: "",
  });

  const [role, setRole] = useState({
    role: "",
    clusterPermission: "cluster-01",
    namespacePermission: "All Namespaces",
  });
  const onBasicDetailsNext = () => {
    if (showFormErrors(data, setData, [])) {
      stepperRef.current.nextCallback();
    }
  };

  const onRolePermissionNext = () => {
    let ignore = [];

    if (role.role === "admin") {
      ignore.push("permissionGranted");
    }
    console.log(nameSpace);
    if (showFormErrors(role, setRole, ignore)) {
      if (role.role === "user") {
        if (validateDisk()) {
          stepperRef.current.nextCallback();
        }
      } else {
        stepperRef.current.nextCallback();
      }
    }
  };

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
    
    
  };
  const handleRoleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, role);
    setRole((prev) => ({ ...prev, [name]: value, formErrors }));
    console.log(role);
  };

  const [loading, setLoading] = useState(false);
  const transformData = (dataArray) => {
    const result = {};

    dataArray.forEach((item) => {
      const namespace = item.namespace;

      // Create the namespace key
      result[`namespace-${namespace}`] = namespace;

      // Iterate over the keys of the item
      for (const key in item) {
        if (key !== "userManagement" && key !== "namespace") {
          // Store 'yes' or 'no' based on the value
          result[`${namespace}-${key}`] = item[key] === true ? "yes" : "no";
        }
      }
    });

    return result;
  };

  const onAddUser = () => {
    setLoading(true);
    let parsed = {};
    if (role.role === "user") {
      const newDataArray = nameSpace.map((item) => {
        // Create a new object based on the original item
        const { userCustom, manageCluster, formErrors, ...newItem } = item;

        if (item.userManagement) {
          // Set the specified properties to true if userManagement is true
          newItem.viewVMs = true;
          newItem.crudVMS = true;
          newItem.viewDataVolume = true;
          newItem.crudDataVolume = true;
        }

        return newItem; // Return the modified item
      });

       parsed = transformData(newDataArray);
      parsed.username = data.userName;
      parsed.email = data.email;
      parsed.department = data.department;
      parsed.password = data.password;
      parsed.role = role.role;
      parsed.status = 'in-active'
    } else {
      parsed = {
        username: data.userName,
        email: data.email,
        department: data.department,
        password: data.password,
        role: "admin",
        status : 'in-active'
      };
    }

    console.log('parsed data',parsed);
    
    dispatch(onAddUserAction(parsed));
    setLoading(false);
    //close modal
    onHide();


  };

  const onHide = () => {
    setVisible(false);
  };

  const validateDisk = () => {
    return nameSpace.every((disk, i) => {
      let ignore = ["disk"];
      if (disk?.createType === "existing") {
        ignore = ["name", "size", "storageClass", "accessMode", "osImageUrl"];
      }
      if (disk?.type === "blank") {
        ignore.push("url");
      }
      const setError = ({ formErrors }) => {
        setNameSpace((prev) => {
          let arr = [...prev];
          arr[i]["formErrors"] = formErrors;
          return arr;
        });
      };
      return showFormErrors(disk, setError, ignore);
    });
  };

  const [nameSpace, setNameSpace] = useState([
    {
      userManagement: true,
      userCustom: false,
      namespace: "",
      manageCluster: "",
      viewVMs: "",
      crudVMS: "",
      viewDataVolume: "",
      crudDataVolume: "",
    },
  ]);

  const onAddMoreNameSpace = () => {
    setNameSpace((prev) => [
      ...prev,
      {
        userManagement: true,
        userCustom: false,
        namespace: "",
        viewVMs: "",
        crudVMS: "",
        viewDataVolume: "",
        crudDataVolume: "",
      },
    ]);
  };

  const onRemoveNameSpace = (index, event) => {
    setNameSpace((prev) => {
      event.preventDefault();
      let _arr = [...prev];
      if (index > 0) _arr.splice(index, 1);
      return _arr;
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
    <CustomModal title="Adding a New User" visible={visible} onHide={onHide}>
      <ConfirmPopup />
      <Stepper ref={stepperRef} orientation="vertical">
        <StepperPanel header="User Profile">
          <Grid>
            <Col>
              <CustomCard>
                <CustomInput
                  data={data}
                  onChange={handleChange}
                  name="userName"
                  required
                  col={12}
                />
                <CustomInput
                  data={data}
                  onChange={handleChange}
                  name="email"
                  required
                  col={12}
                />

       <CustomPassword
          data={data}
          onChange={handleChange}
          name="password"
          required
          col="12"
        />
                <CustomInput
                  data={data}
                  onChange={handleChange}
                  name="department"
                  col={12}
                />
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButton
              label="Next"
              icon="pi pi-arrow-right"
              onClick={onBasicDetailsNext}
            />
          </Buttonlayout>
        </StepperPanel>
        <StepperPanel header="Role & Permissions">
          <Grid>
            <Col>
              <CustomCard>
                <CustomForm>
                  <CustomDropDown
                    data={role}
                    onChange={handleRoleChange}
                    name="role"
                    options={[
                      {
                        name: "Admin",
                        value: "admin",
                      },
                      {
                        name: "User",
                        value: "user",
                      },
                    ]}
                    required
                    col={12}
                  />
                  <CustomInput
                    data={role}
                    onChange={handleChange}
                    name="clusterPermission"
                    disabled
                    col={12}
                  />
                  {/* admin role and permission */}
                  {role.role === "admin" && (
                    <>
                      <CustomInput
                        data={role}
                        onChange={handleChange}
                        name="namespacePermission"
                        required
                        disabled
                        col={12}
                      />
                      <div>
                        <label>
                          Permissions Granted{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                          <li>
                            <label
                              style={{
                                color: permissions.userManagement
                                  ? "black"
                                  : "#999",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="userManagement"
                                disabled
                                checked={permissions.userManagement}
                                onChange={handleCheckboxChange}
                              />
                              Access to the <strong>User Management</strong>{" "}
                              page to manage users.
                            </label>
                          </li>
                          <li>
                            <label
                              style={{
                                color: permissions.userManagement
                                  ? "black"
                                  : "#999",
                              }}
                            >
                              <input
                                type="checkbox"
                                disabled
                                name="manageCluster"
                                checked={permissions.manageCluster}
                                onChange={handleCheckboxChange}
                              />
                              Manage cluster resources (e.g., adding/removing
                              nodes).
                            </label>
                          </li>
                          <li>
                            <label
                              style={{
                                color: permissions.userManagement
                                  ? "black"
                                  : "#999",
                              }}
                            >
                              <input
                                disabled
                                type="checkbox"
                                name="systemConfig"
                                checked={permissions.systemConfig}
                                onChange={handleCheckboxChange}
                              />
                              System configuration settings.
                            </label>
                          </li>
                          <li>
                            <label
                              style={{
                                color: permissions.userManagement
                                  ? "black"
                                  : "#999",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="vmOperations"
                                disabled
                                checked={permissions.vmOperations}
                                onChange={handleCheckboxChange}
                              />
                              Create/Edit/Migrate/Delete VMs.
                            </label>
                          </li>
                          <li>
                            <label
                              style={{
                                color: permissions.userManagement
                                  ? "black"
                                  : "#999",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="dataVolumes"
                                disabled
                                checked={permissions.dataVolumes}
                                onChange={handleCheckboxChange}
                              />
                              Create/Resize/Delete Data Volumes.
                            </label>
                          </li>
                          <li>
                            <label
                              style={{
                                color: permissions.userManagement
                                  ? "black"
                                  : "#999",
                              }}
                            >
                              <input
                                type="checkbox"
                                name="assignRoles"
                                disabled
                                checked={permissions.assignRoles}
                                onChange={handleCheckboxChange}
                              />
                              Assign roles and permissions to other users.
                            </label>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* user role and permissions */}
                  {role.role === "user" && (
                    <Grid>
                      <Col>
                        {nameSpace.map((item, i) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "start",
                              marginBottom: "16px",
                            }}
                            key={i}
                          >
                            <button
                              style={{
                                background: "rgba(255, 0, 0, 0.1)",
                                border: "none",
                                borderRadius: "50%",
                                color: "red",
                                fontSize: "24px",
                                padding: "4px 8px",
                                marginRight: "16px",
                                cursor: "pointer",
                              }}
                              onClick={(event) => onRemoveNameSpace(i, event)}
                            >
                              -
                            </button>
                            <CustomCard col={11}>
                              <Namespace
                                nameSpace={item}
                                setNameSpace={setNameSpace}
                                index={i}
                              />
                            </CustomCard>
                          </div>
                        ))}

                        <span
                          onClick={onAddMoreNameSpace}
                          className="ml-2 cursor-pointer"
                        >
                          <i className="pi pi-plus-circle"></i> Add another
                          Namespace
                        </span>
                      </Col>
                    </Grid>
                  )}
                </CustomForm>
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButtonOutlined
              label="Go Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <CustomButton
              label="Next"
              icon="pi pi-arrow-right"
              onClick={onRolePermissionNext}
            />
          </Buttonlayout>
        </StepperPanel>

        <StepperPanel header="Review">
          <Grid>
            <Col>
              <CustomCard>
                <UserReview data={data} role={role} namespace={nameSpace} />
              </CustomCard>
            </Col>
          </Grid>
          <Buttonlayout>
            <CustomButtonOutlined
              label="Go Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current.prevCallback()}
            />
            <CustomButton
              loading={loading}
              label="Create"
              onClick={onAddUser}
            />
          </Buttonlayout>
        </StepperPanel>
      </Stepper>
    </CustomModal>
  );
}
