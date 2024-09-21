import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDisksAction,
  getNamespacesAction,
  getNodesAction,
  getPriorityClassAction,
  getStorageClassesAction,
} from "../../../store/actions/projectActions";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../../shared/CustomButton";
import Grid, { Col } from "../../../shared/Grid";
import BasicDetails from "./BasicDetails";
import Network from "./Network";
// import Advanced from "./Advanced";
import formValidation from "../../../utils/validations";
import Namespace from "./Namespace";
import Review from "./Review";
import { onAddVMAction2 } from "../../../store/actions/vmActions";
import CustomCard from "../../../shared/CustomCard";
import CustomModal from "../../../shared/CustomModal";
import { showFormErrors } from "../../../utils/commonFunctions";
import { ConfirmPopup } from "primereact/confirmpopup";
import UserData from "./UserData";
import {
  CustomDropDown,
  CustomForm,
  CustomInput,
  CustomPasswordInput,
  CustomMemoryInput,
} from "../../../shared/AllInputs";
import { setNamespaces } from "../../../store/slices/projectSlice";

export default function AddUserModal({ visible, setVisible }) {
  const stepperRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNamespacesAction());
    dispatch(getNodesAction());
    dispatch(getStorageClassesAction());
    dispatch(getPriorityClassAction());
    dispatch(getDisksAction());
  }, [dispatch]);

  const [data, setData] = useState({
    email: "",
    userName: "",
    password: "",

    role: "",
    clusterPermission: "",
    namespacePermission: "",
    permissionGranted: "",
  });

  // const [role, setRole] = useState({
  //   role: "Admin",
  //   clusterPermission: "",
  //   namespacePermission: "",
  //   permissionGranted: "",
  // });
  const onBasicDetailsNext = () => {
    if (
      showFormErrors(data, setData, [
        "role",
        "clusterPermission",
        "namespacePermission",
        "permissionGranted",
      ])
    ) {
      stepperRef.current.nextCallback();
    }
  };

  const onRolePermissionNext = () => {
    if (showFormErrors(data, setData, ["userName", "email", "password"])) {
      stepperRef.current.nextCallback();
    }
  };

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
    console.log(data);
  };

  const [loading, setLoading] = useState(false);

  const onAddVM = () => {
    if (showFormErrors(data, setData)) {
      if (validateDisk()) {
        
      
      } else {
        stepperRef.current.setActiveStep(1);
      }
    } else {
      stepperRef.current.setActiveStep(0);
    }
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
      nameSpace: "",
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
        nameSpace: "",
        viewVMs: "",
        crudVMS: "",
        viewDataVolume: "",
        crudDataVolume: "",
      },
    ]);
  };

  const onRemoveNameSpace = (index) => {
    setNameSpace((prev) => {
      let _arr = [...prev];
      _arr.splice(index, 1);
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
                {/* <BasicDetails data={data} handleChange={handleChange} /> */}
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

                <CustomPasswordInput
                  data={data}
                  onChange={handleChange}
                  name="password"
                  required
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
                    data={data}
                    onChange={handleChange}
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
                    data={data}
                    onChange={handleChange}
                    name="clusterPermission"
                    required
                    col={12}
                  />
                  {/* admin role and permission */}
                  {data.role === "admin" && (
                    <>
                      <CustomInput
                        data={data}
                        onChange={handleChange}
                        name="namespacePermission"
                        required
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
                  {data.role === "user" && (
                    <Grid>
                      <Col>
                        {nameSpace.map((item, i) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "start",
                              marginBottom: "16px",
                            }}
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
                            >
                              -
                            </button>
                            <CustomCard col={10} key={i}>
                              <Namespace
                                disk={item}
                                setDisk={setNameSpace}
                                index={i}
                                onRemoveDisk={onRemoveNameSpace}
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
                <Review data={data} disks={nameSpace} />
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
            <CustomButton loading={loading} label="Create" onClick={onAddVM} />
          </Buttonlayout>
        </StepperPanel>
      </Stepper>
    </CustomModal>
  );
}
