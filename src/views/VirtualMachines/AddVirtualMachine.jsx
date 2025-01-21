import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddVirtualMachineForm from "./Form/AddVirtualMachineForm";
import Page from "../../shared/Page";
import { BreadCrumb } from "primereact/breadcrumb";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import { CustomButtonOutlined } from "../../shared/CustomButton";
import TemplateSelectionModal from "./Form/TemplateSelectionModal";
import { setSelectedTemplate } from "../../store/slices/vmSlice";
import UploadTemplatesModal from "./Form/UploadTemplatesModal";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "primereact/csstransition";
import { useLocation } from "react-router-dom";

export default function AddVirtualMachine() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setBreadcrumbItems } = useBreadcrumb();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isUploadTemplatesOpen, setIsUploadTemplatesOpen] = useState(false);
  const { formsFocusEvent } = useSelector((state) => state.common);
  const { useVmTemplate } = useSelector((state) => state.vm);

  const isVmPool = state?.isVmPool || false;

  const handleClose = () => {
    navigate("/virtual-machines/list");
  };

  const handleTemplateSelect = (template) => {
    // TODO: Pre-fill form with template data
    setIsTemplateModalOpen(false);
    dispatch(setSelectedTemplate(template));
  };

  const handleImportYAML = () => {
    setIsUploadTemplatesOpen(true);
  };

  const breadcrumbItems = [
    { label: "Virtual Machines", url: "#/virtual-machines/list" },
    { label: "Add Virtual Machine" },
  ];

  useEffect(() => {
    setBreadcrumbItems(breadcrumbItems);
    return () => {
      setBreadcrumbItems([]);
    };
  }, [setBreadcrumbItems]);

  return (
    <>
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
      />
      <CSSTransition unmountOnExit in={isUploadTemplatesOpen} timeout={500}>
        <UploadTemplatesModal isOpen={isUploadTemplatesOpen} onClose={() => setIsUploadTemplatesOpen(false)} />
      </CSSTransition>
      <Page
        title={isVmPool ? "Add Virtual Machine Pool" : "Add Virtual Machine"}
        breadcrumb={<BreadCrumb model={breadcrumbItems} />}
        titleAction={
          <div className="flex gap-2 ml-auto">
            <CustomButtonOutlined
              label="Use VM Template"
              icon="pi pi-file-import"
              onClick={() => setIsTemplateModalOpen(true)}
              className="template-cta"
              disabled={formsFocusEvent.addVirtualMachine && !useVmTemplate}
            />
            <CustomButtonOutlined
              label="Import YAML"
              icon="pi pi-file-edit"
              onClick={handleImportYAML}
              className="yaml-cta"
            />
          </div>
        }
      >
        <AddVirtualMachineForm onClose={handleClose} isVmPool={isVmPool} />
      </Page>
    </>
  );
}
