import React from "react";
import Modal from "../../../shared/Modal/Modal";
import "./PoolTypeSelectionModal.scss";

export default function PoolTypeSelectionModal({ isOpen, onClose, onSelect }) {
  const poolTypes = [
    {
      id: "kubernetes",
      name: "Kubernetes Cluster",
      description: "Automatically create and configure a pool of VMs to run a Kubernetes cluster.",
      icon: "pi pi-server",
      gridSpan: "large"
    },
    {
      id: "compute",
      name: "General Compute",
      description: "Create a pool of VMs for general-purpose workloads like hosting applications or running scripts.",
      icon: "pi pi-desktop",
      gridSpan: "small"
    },
    {
      id: "batch",
      name: "Batch Processing",
      description: "Spin up a pool of VMs optimized for data processing, simulations, or analytics.",
      icon: "pi pi-list",
      gridSpan: "small"
    },
    {
      id: "vdi",
      name: "Virtual Desktop Infrastructure",
      description: "Deploy a pool of virtual desktops for end-users with customizable specifications.",
      icon: "pi pi-window-maximize",
      gridSpan: "small"
    },
    {
      id: "aiml",
      name: "AI/ML Workloads",
      description: "Create GPU-enabled VMs for training or deploying AI models.",
      icon: "pi pi-chart-line",
      gridSpan: "small"
    }
  ];

  const PoolTypeCard = ({ poolType }) => (
    <div 
      className={`pool-type-card ${poolType.gridSpan === 'large' ? 'large' : 'small'}`}
      onClick={() => onSelect(poolType)}
    >
      <div className="pool-type-icon">
        <i className={poolType.icon}></i>
      </div>
      <div className="pool-type-info">
        <h3 className="pool-type-name">{poolType.name}</h3>
        <p className="pool-type-description">{poolType.description}</p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select a Pool Type"
      subtitle="With supporting text below as a natural lead-in to additional content"
      className="pool-type-selection-modal"
    >
      <div className="pool-type-grid">
        {poolTypes.map((poolType) => (
          <PoolTypeCard key={poolType.id} poolType={poolType} />
        ))}
      </div>
    </Modal>
  );
}
