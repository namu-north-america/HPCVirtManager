import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddVirtualMachineForm from "./Form/AddVirtualMachineForm";
import Page from "../../shared/Page";
import { BreadCrumb } from "primereact/breadcrumb";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import { CustomButtonOutlined } from "../../shared/CustomButton";
import TemplateSelectionModal from "./Form/TemplateSelectionModal";
import { setSelectedTemplate } from "../../store/slices/vmSlice";
import { useDispatch } from "react-redux";
import UploadTemplatesModal from "./Form/UploadTemplatesModal";

export default function AddVirtualMachine() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setBreadcrumbItems } = useBreadcrumb();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isUploadTemplatesOpen, setIsUploadTemplatesOpen] = useState(false);
  // const [selectedTemplate, setSelectedTemplate] = useState();

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
      <UploadTemplatesModal isOpen={isUploadTemplatesOpen} onClose={() => setIsUploadTemplatesOpen(false)} />
      <Page
        title="Add Virtual Machine"
        breadcrumb={<BreadCrumb model={breadcrumbItems} />}
        titleAction={
          <div className="flex gap-2 ml-auto">
            <CustomButtonOutlined
              label="Use VM Template"
              icon="pi pi-file-import"
              onClick={() => setIsTemplateModalOpen(true)}
              className="template-cta"
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
        <AddVirtualMachineForm onClose={handleClose} />
      </Page>
    </>
  );
}
