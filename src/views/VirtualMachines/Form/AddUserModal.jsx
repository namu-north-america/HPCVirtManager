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

export default function AddUserModal({ visible, setVisible }) {
  const stepperRef = useRef(null);
  const dispatch = useDispatch();
  const { priorityClassesDropdown } = useSelector((state) => state.project);
  useEffect(() => {
    dispatch(getNamespacesAction());
    dispatch(getNodesAction());
    dispatch(getStorageClassesAction());
    dispatch(getPriorityClassAction());
    dispatch(getDisksAction());
  }, [dispatch]);

  const [data, setData] = useState({
    node: "",
    name: "",
    namespace: "",
    sockets: "",
    cores: "",
    threads: "",
    memory: "",
    memoryType: "Gi",
    priorityClass: "",
    storage1: "",
    networkType: "podNetwork",
    bindingMode: "bridge",
    advanced: "",
    userName: "",
    password: "",
  });

  const [role, setRole] = useState({
    role: "Admin",
    clusterPermission: true,
    namespacePermission: true,
    permissionGranted: true,
  });

  useEffect(() => {
    if (priorityClassesDropdown.length) {
      setData((prev) => ({
        ...prev,
        priorityClass: priorityClassesDropdown[0],
      }));
    }
  }, [priorityClassesDropdown]);

  const handleChange = ({ name, value }) => {
    console.log(name,value);
    
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const [loading, setLoading] = useState(false);

  const onAddVM = () => {
    if (showFormErrors(data, setData)) {
      if (validateDisk()) {
        dispatch(
          onAddVMAction2(data, disks, setLoading, () => {
            setVisible(false);
            setData({
              node: "",
              name: "",
              namespace: "",
              sockets: "",
              cores: "",
              threads: "",
              memory: "",
              priorityClass: "",
              storage1: "",
              networkType: "podNetwork",
              bindingMode: "bridge",
              advanced: "",
              userName: "",
              password: "",
            });
            setDiskes([
              {
                createType: "new",
                diskType: "disk",
                busType: "",
                size: "",
                storageClass: "",
                accessMode: "",

                disk: "",
                type: "blank",
                url: "",
              },
            ]);
          })
        );
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

  const onBasicDetailsNext = () => {
    if (showFormErrors(data, setData, ["userName", "password"])) {
    }
    stepperRef.current.nextCallback();
  };

  const onStorageNext = () => {
    if (validateDisk()) {
      stepperRef.current.nextCallback();
    }
  };

  const onUserDetailsNext = () => {
    if (showFormErrors(data, setData)) {
      stepperRef.current.nextCallback();
    }
  };
  const validateDisk = () => {
    return disks.every((disk, i) => {
      let ignore = ["disk"];
      if (disk?.createType === "existing") {
        ignore = ["name", "size", "storageClass", "accessMode", "osImageUrl"];
      }
      if (disk?.type === "blank") {
        ignore.push("url");
      }
      const setError = ({ formErrors }) => {
        setDiskes((prev) => {
          let arr = [...prev];
          arr[i]["formErrors"] = formErrors;
          return arr;
        });
      };
      return showFormErrors(disk, setError, ignore);
    });
  };

  const [disks, setDiskes] = useState([
    {
      createType: "new",
      diskType: "disk",
      busType: "",
      memoryType: "Gi",
      size: "",
      storageClass: "",
      accessMode: "",

      disk: "",
      type: "blank",
      url: "",
      cache: "",
    },
  ]);

  const onAddMoreDisk = () => {
    setDiskes((prev) => [
      ...prev,
      {
        createType: "new",
        diskType: "disk",
        busType: "",
        memoryType: "Gi",
        size: "",
        storageClass: "",
        accessMode: "",

        disk: "",
        type: "blank",
        url: "",
        cache: "",
      },
    ]);
  };

  const onRemoveDisk = (index) => {
    setDiskes((prev) => {
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
                  name="name"
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
                  name="Password"
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
                <CustomDropDown
                  data={data}
                  onChange={handleChange}
                  name="Role"
                  options={["Admin", "User"]}
                  required
                  col={12}
                />
                <CustomInput
                  data={data}
                  onChange={handleChange}
                  name="cluster permission"
                  required
                  col={12}
                />
                {/* admin role and permission */}
                {role.role === "Admin" && (
                  <>
                    <CustomInput
                      data={data}
                      onChange={handleChange}
                      name="namespace permission"
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
                            Access to the <strong>User Management</strong> page
                            to manage users.
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
                {role.role === "User" && (
                  <Grid>
                    <Col>
                      {disks.map((item, i) => (
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
                              setDisk={setDiskes}
                              index={i}
                              onRemoveDisk={onRemoveDisk}
                            />
                          </CustomCard>
                        </div>
                      ))}

                      <span
                        onClick={onAddMoreDisk}
                        className="ml-2 cursor-pointer"
                      >
                        <i className="pi pi-plus-circle"></i> Add another
                        Namespace
                      </span>
                    </Col>
                  </Grid>
                )}
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
              onClick={onStorageNext}
            />
          </Buttonlayout>
        </StepperPanel>
        <StepperPanel header="Network">
          <Grid>
            <Col>
              <CustomCard>
                <Network data={data} handleChange={handleChange} />
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
              onClick={() => stepperRef.current.nextCallback()}
            />
          </Buttonlayout>
        </StepperPanel>
        {/* <StepperPanel header="Advanced">
          <Grid>
            <Col>
              <CustomCard>
                <Advanced data={data} handleChange={handleChange} />
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
              onClick={() => stepperRef.current.nextCallback()}
            />
          </Buttonlayout>
        </StepperPanel> */}
        <StepperPanel header="User Data">
          <Grid>
            <Col>
              <CustomCard>
                <UserData data={data} handleChange={handleChange} />
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
              onClick={onUserDetailsNext}
            />
          </Buttonlayout>
        </StepperPanel>
        <StepperPanel header="Review">
          <Grid>
            <Col>
              <CustomCard>
                <Review data={data} disks={disks} />
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
