import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNamespacesAction, getNodesAction, getPriorityClassAction } from "../../../store/actions/projectActions";
import { Card } from "primereact/card";
import { v4 } from "uuid";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ConfirmPopup } from "primereact/confirmpopup";
import CustomButton, { Buttonlayout, CustomButtonOutlined } from "../../../shared/CustomButton";
import Grid, { Col } from "../../../shared/Grid";
import BasicDetails from "./BasicDetails";
import Network from "./Network";
import Storage from "./Storage";
import Review from "./Review";
import UserData from "./UserData";
import { setSelectedTemplate } from "../../../store/slices/vmSlice";
import { onAddVMAction, getNetworksAction, getInstanceTypesAction } from "../../../store/actions/vmActions";
import { showFormErrors } from "../../../utils/commonFunctions";
import formValidation from "../../../utils/validations";
import { getDisksAction, getStorageClassesAction } from "../../../store/actions/storageActions";
import TemplateSelectionModal from "./TemplateSelectionModal";
import "./AddVirtualMachineForm.scss";
import Advanced from "./Advanced/Advanced";
import { getImagesAction } from "../../../store/actions/imageActions";
import { setFormFocusEvent } from "../../../store/slices/commonSlice";
import _throttle from "lodash/throttle";

export default function AddVirtualMachineForm({ onClose, isVmPool }) {
  const dispatch = useDispatch();
  const { priorityClassesDropdown, images } = useSelector((state) => state.project);
  const { selectedTemplate, useVmTemplate } = useSelector((state) => state.vm);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateErrors, setTemplateErrors] = useState([]);

  // const [selectedTemplate, setSelectedTemplate] = useState(template);

  const isTemplateMode = Object.keys(selectedTemplate).length;

  useEffect(() => {
    dispatch(getNamespacesAction());
    dispatch(getNodesAction());
    dispatch(getStorageClassesAction());
    dispatch(getPriorityClassAction());
    dispatch(getDisksAction());
    dispatch(getImagesAction());
    dispatch(getNetworksAction());
    dispatch(getInstanceTypesAction());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedTemplate({}));
    };
  }, [dispatch]);

  const [data, setData] = useState({
    name: "",
    namespace: "",
    sockets: "",
    cores: "",
    threads: "",
    memory: "",
    memoryType: "Gi",
    storage1: "",
    networkType: "podNetwork",
    bindingMode: "bridge",
    advanced: "",
    userName: "",
    password: "",
    virtualMachineType: "custom",
    // When isVmPool active, this field is required
    replicas: isVmPool ? 2 : "",
  });

  const [disks, setDisks] = useState([
    {
      uuid: v4(),
      createType: "new",
      diskType: "disk",
      busType: "",
      memoryType: "Gi",
      size: "",
      storageClass: "",
      accessMode: "",
      image: "",
      disk: "",
      type: "blank",
      url: "",
    },
  ]);

  const [networks, setNetworks] = useState([
    {
      networkType: "podNetwork",
      bindingMode: "bridge",
    },
  ]);

  useEffect(() => {
    if (priorityClassesDropdown.length) {
      setData((prev) => ({
        ...prev,
        priorityClass: priorityClassesDropdown[0],
      }));
    }
  }, [priorityClassesDropdown]);

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const onAddVM = () => {
    const skipFields = isVmPool && data.virtualMachineType !== "custom" ? ["cores", "threads", "sockets"] : [];

    if (showFormErrors(data, setData, skipFields) || isTemplateMode) {
      if (validateDisk() || isTemplateMode) {
        setLoading(true);
        dispatch(
          onAddVMAction(data, disks, images, networks, isVmPool, setLoading, () => {
            setLoading(false);
            if (onClose) {
              onClose();
            }
          })
        );
      } else {
        setActiveIndex(1);
      }
    } else {
      setActiveIndex(0);
    }
  };

  useEffect(() => {
    if (isTemplateMode) {
      setActiveIndex(4);
      setCompletedSteps((prev) => [...new Set([0, 1, 2, 3, 4])]);
    }
  }, [selectedTemplate]);

  const onFocus = useCallback(
    _throttle(() => {
      dispatch(setFormFocusEvent({ form: "addVirtualMachine", focus: true }));
    }, 20000),
    []
  );

  const validateStep = (index) => {
    switch (index) {
      case 0:
        return showFormErrors(data, setData, ["userName", "password"]);
      case 1:
        return validateDisk();
      case 2:
        return true;
      case 3:
        return showFormErrors(data, setData);
      case 4:
        return templateErrors.length === 0;
      default:
        return true;
    }
  };

  const onStepChange = (index) => {
    if (index > activeIndex) {
      // Moving forward
      if (true) {
        setCompletedSteps((prev) => [...new Set([...prev, activeIndex])]);
        setActiveIndex(index);
      }
    } else {
      // Moving backward
      setActiveIndex(index);
    }
    if (index > 0 && !useVmTemplate) {
      onFocus();
    }
  };

  const validateDisk = () => {
    return disks.every((disk, i) => {
      let ignore = ["disk", "url", "image"];

      if (disk?.createType === "existing") {
        ignore = ["name", "size", "storageClass", "accessMode", "url", "image"];
      } else if (disk?.createType === "new") {
        ignore = disk?.type === "blank" ? ["disk", "url", "image"] : ["disk", "image"];
      } else if (disk?.createType === "image") {
        ignore = ["disk", "url"];
      }

      // Always validate busType
      const requiredFields = ["diskType", "createType", "busType"];

      const missingRequired = requiredFields.filter((field) => !disk[field] && !ignore.includes(field));

      if (missingRequired.length > 0) {
        const setError = ({ formErrors }) => {
          setDisks((prev) => {
            let arr = [...prev];
            arr[i]["formErrors"] = {
              ...formErrors,
              ...missingRequired.reduce(
                (acc, field) => ({
                  ...acc,
                  [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`,
                }),
                {}
              ),
            };
            return arr;
          });
        };
        setError({ formErrors: {} });
        return false;
      }

      const setError = ({ formErrors }) => {
        setDisks((prev) => {
          let arr = [...prev];
          arr[i]["formErrors"] = formErrors;
          return arr;
        });
      };
      return showFormErrors(disk, setError, ignore);
    });
  };

  const onAddMoreDisk = () => {
    setDisks((prev) => [
      ...prev,
      {
        createType: "new",
        diskType: "disk",
        busType: "",
        memoryType: "Gi",
        size: "",
        storageClass: "",
        accessMode: "",
        image: "",
        disk: "",
        type: "blank",
        url: "",
      },
    ]);
  };

  const onAddMoreNetwork = () => {
    setNetworks((prev) => [
      ...prev,
      {
        networkType: "",
        bindingMode: "",
      },
    ]);
  };

  const onRemoveDisk = (index) => {
    setDisks((prev) => prev.filter((_, i) => i !== index));
  };

  const onRemoveNetwork = (index) => {
    setNetworks((prev) => prev.filter((_, i) => i !== index));
  };

  const onMoveDisk = (index, direction) => {
    setDisks((prev) => {
      const newDisks = [...prev];
      if (direction === "up" && index > 0) {
        [newDisks[index], newDisks[index - 1]] = [newDisks[index - 1], newDisks[index]];
      } else if (direction === "down" && index < newDisks.length - 1) {
        [newDisks[index], newDisks[index + 1]] = [newDisks[index + 1], newDisks[index]];
      }
      return newDisks;
    });
  };

  const handleTemplateSelect = (template) => {
    // setSelectedTemplate(template);
    dispatch(setSelectedTemplate(template));
    // TODO: Use the selected template to pre-fill form values
  };

  const steps = [
    { label: "Basic Settings" },
    { label: "Storage" },
    { label: "Network" },
    { label: "User Data" },
    { label: "Advance" },
    { label: "Review" },
  ];

  const renderStepContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <BasicDetails data={data} handleChange={handleChange} isVmPool={isVmPool} />
            <Buttonlayout>
              <CustomButton label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => onStepChange(1)} />
            </Buttonlayout>
          </>
        );
      case 1:
        return (
          <>
            {disks.map((disk, i) => (
              <>
                {disks.length > 1 && <Divider className="text-primary">Storage {i + 1}</Divider>}
                <Storage
                  key={i}
                  disk={disk}
                  setDisk={setDisks}
                  index={i}
                  disks={disks}
                  onRemoveDisk={onRemoveDisk}
                  onMoveDisk={onMoveDisk}
                  data={data}
                />
              </>
            ))}
            {!useVmTemplate && (
              <button className="add-disk-button" onClick={onAddMoreDisk}>
                <i className="pi pi-plus-circle"></i>
                Add More Disk
              </button>
            )}
            <Buttonlayout>
              <CustomButtonOutlined label="Previous" icon="pi pi-arrow-left" onClick={() => onStepChange(0)} />
              <CustomButton label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => onStepChange(2)} />
            </Buttonlayout>
          </>
        );
      case 2:
        return (
          <>
            {networks.map((network, index) => {
              return <Network data={network} setNetworks={setNetworks} index={index} onRemove={onRemoveNetwork} />;
            })}
            {networks.length < 2 && !useVmTemplate && (
              <button className="add-disk-button" onClick={onAddMoreNetwork}>
                <i className="pi pi-plus-circle"></i>
                Add More Network
              </button>
            )}
            <Buttonlayout>
              <CustomButtonOutlined label="Previous" icon="pi pi-arrow-left" onClick={() => onStepChange(1)} />
              <CustomButton label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => onStepChange(3)} />
            </Buttonlayout>
          </>
        );
      case 3:
        return (
          <>
            <UserData data={data} handleChange={handleChange} />
            <Buttonlayout>
              <CustomButtonOutlined label="Previous" icon="pi pi-arrow-left" onClick={() => onStepChange(2)} />
              <CustomButton label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => onStepChange(4)} />
            </Buttonlayout>
          </>
        );
      case 4:
        return (
          <>
            <Advanced
              isVmPool={isVmPool}
              data={data}
              disks={disks}
              networks={networks}
              setNetworks={setNetworks}
              handleChange={setData}
              template={selectedTemplate}
              onValidate={setTemplateErrors}
              setDisks={setDisks}
            />
            <Buttonlayout>
              <CustomButtonOutlined label="Previous" icon="pi pi-arrow-left" onClick={() => onStepChange(3)} />
              <CustomButton label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => onStepChange(5)} />
            </Buttonlayout>
          </>
        );
      case 5:
        return (
          <>
            <Review data={data} disks={disks} />
            <Buttonlayout>
              <CustomButtonOutlined label="Previous" icon="pi pi-arrow-left" onClick={() => onStepChange(4)} />
              <CustomButton loading={loading} label="Create" icon="pi pi-check" onClick={onAddVM} />
            </Buttonlayout>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
      />
      <div className="add-vm-form">
        <ConfirmPopup />
        <div className="flex">
          <div className="steps-sidebar">
            <ul className="step-list">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`step-item ${activeIndex === index ? "active" : ""} ${
                    completedSteps.includes(index) ? "completed" : ""
                  }`}
                  onClick={() => onStepChange(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                  aria-current={activeIndex === index ? "step" : undefined}
                >
                  <span className="step-number">{index + 1}</span>
                  <div className="step-content">
                    <h3 className="step-title">{step.label}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="step-content">
            <Card>{renderStepContent()}</Card>
          </div>
        </div>
      </div>
    </>
  );
}
