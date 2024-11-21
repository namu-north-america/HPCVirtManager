import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../../shared/Modal/Modal";
import { TabView, TabPanel } from "primereact/tabview";
import "./TemplateSelectionModal.scss";
import { setSelectedTemplate, setTemplates } from "../../../store/slices/projectSlice";
import FedoraLogo from "../../../assets/images/svg/fedora-logo.svg";
import UbuntuLogo from "../../../assets/images/svg/ubuntu-logo.svg";
import WindowsLogo from "../../../assets/images/svg/windows-logo.svg";
import RedHatLogo from "../../../assets/images/svg/redhat-logo.svg";

export const yamlTemplate = `
apiVersion: kubevirt.io/v1alpha3
kind: VirtualMachine
metadata:
  name: vm-fedora
  namespace: default
spec:
  dataVolumeTemplates:
  - metadata:
     name: datavolume-iso
    spec:
      storage:
        accessModes:
        - ReadWriteOnce
        resources:
          requests:
            storage: 10Gi
        storageClassName: nfs-client
      source:
        http:
          url: https://download.fedoraproject.org/pub/fedora/linux/releases/41/Cloud/x86_64/images/Fedora-Cloud-Base-AmazonEC2-41-1.4.x86_64.raw.xz
  running: false
  template:
    metadata:
      labels:
        kubevirt.io/vm: vm-fedora
    spec:
      domain:
        cpu:
          cores: 2
        devices:
          disks:
          - disk:
              bus: virtio
            name: datavolume-iso
        machine:
          type: ""
        resources:
          requests:
            memory: 4G
      volumes:
      - dataVolume:
          name: datavolume-iso
        name: datavolume-iso
`.replace(/:$/m, ": ");

const prebuiltTemplates = [
  { id: 1, name: "Fedora", logo: FedoraLogo, subtitle: "Linux Distribution", template: yamlTemplate },
  { id: 2, name: "Ubuntu", logo: UbuntuLogo, subtitle: "Linux Distribution", template: yamlTemplate },
  { id: 3, name: "Windows", logo: WindowsLogo, subtitle: "Windows Server", template: yamlTemplate },
  { id: 4, name: "RHEL", logo: RedHatLogo, subtitle: "Enterprise Linux", template: yamlTemplate },
];

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
  const dispatch = useDispatch();

  const handleTemplateSelect = (template) => {
    dispatch(setSelectedTemplate(template));
    onClose();
  };

  useEffect(() => {
    dispatch(setTemplates(prebuiltTemplates));
  }, [dispatch]);

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
