import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../shared/Modal/Modal";
import { TabView, TabPanel } from "primereact/tabview";
import "./TemplateSelectionModal.scss";
import { setSelectedTemplate } from "../../../store/slices/vmSlice";

const TemplateCard = ({ template, onSelect }) => (
  <div className="template-card" onClick={() => onSelect(template)}>
    <div className="template-icon">
      <img src={template.logo} alt={`${template.name} logo`} />
    </div>
    <div className="template-info">
      <h3 className="template-name">{template.name}</h3>
      <p className="template-subtitle">{template.subtitle}</p>
    </div>
  </div>
);

export default function TemplateSelectionModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const { templates: prebuiltTemplates } = useSelector((state) => state.vm);
  const dispatch = useDispatch();

  const handleTemplateSelect = (template) => {
    dispatch(setSelectedTemplate(template));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select a VM Template"
      subtitle="With supporting text below as a natural lead-in to additional content"
      className="template-selection-modal"
    >
      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} className="template-tabs">
        <TabPanel header="Pre-built Templates">
          <div className="template-grid">
            {prebuiltTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onSelect={handleTemplateSelect} />
            ))}
          </div>
        </TabPanel>
        <TabPanel header="Your Own Templates">
          <div className="template-grid">
            <div className="no-templates">
              <i className="pi pi-file text-4xl mb-3" />
              <p>No custom templates available yet</p>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </Modal>
  );
}
