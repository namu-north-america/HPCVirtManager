import React from 'react';
import { Card } from 'primereact/card';
import CustomButton from '../../../../../shared/CustomButton';

export default function Step5Review({ data, onEdit }) {
  const renderSection = (title, content, step) => (
    <div className="mb-4">
      <div className="flex justify-content-between align-items-center">
        <h3>{title}</h3>
        <CustomButton
          icon="pi pi-pencil"
          onClick={() => onEdit(step)}
          className="p-button-text"
        />
      </div>
      <div className="p-3 border-1 border-round">
        {content}
      </div>
    </div>
  );

  const renderDiskInfo = (disk) => (
    <div className="ml-4 mb-2">
      <p><strong>Storage Type:</strong> {disk.createType}</p>
      <p><strong>Disk Type:</strong> {disk.diskType}</p>
      <p><strong>Bus Type:</strong> {disk.busType}</p>
      {disk.createType === 'new' && (
        <>
          <p><strong>Size:</strong> {disk.size} {disk.memoryType}</p>
          <p><strong>Storage Class:</strong> {disk.storageClass}</p>
          <p><strong>Access Mode:</strong> {disk.accessMode}</p>
          <p><strong>Type:</strong> {disk.type}</p>
          {disk.type !== 'blank' && <p><strong>URL:</strong> {disk.url}</p>}
        </>
      )}
      {disk.createType === 'existing' && (
        <p><strong>Selected Disk:</strong> {disk.disk}</p>
      )}
      {disk.createType === 'image' && (
        <p><strong>Selected Image:</strong> {disk.image}</p>
      )}
    </div>
  );

  return (
    <div className="p-4">
      {renderSection('Cluster Details', (
        <div>
          <p><strong>Cluster Name:</strong> {data.clusterDetails.clusterName}</p>
          <p><strong>Namespace:</strong> {data.clusterDetails.namespace}</p>
          <p><strong>Kubernetes Version:</strong> {data.clusterDetails.k8sVersion}</p>
          <p><strong>Description:</strong> {data.clusterDetails.description}</p>
          <p><strong>Install Dashboard:</strong> {data.clusterDetails.installDashboard ? 'Yes' : 'No'}</p>
        </div>
      ), 0)}

      {renderSection('Control Plane', (
        <div>
          <p><strong>Name:</strong> {data.controlPlane.name}</p>
          <p><strong>Number of Nodes:</strong> {data.controlPlane.workerNodes}</p>
          <p><strong>Storage Configuration:</strong></p>
          {data.controlPlane.disks.map((disk, index) => (
            <div key={index}>
              <p><strong>Disk {index + 1}:</strong></p>
              {renderDiskInfo(disk)}
            </div>
          ))}
        </div>
      ), 1)}

      {renderSection('Worker Node', (
        <div>
          <p><strong>Name:</strong> {data.workerNode.name}</p>
          <p><strong>Number of Nodes:</strong> {data.workerNode.workerNodes}</p>
          <p><strong>Storage Configuration:</strong></p>
          {data.workerNode.disks.map((disk, index) => (
            <div key={index}>
              <p><strong>Disk {index + 1}:</strong></p>
              {renderDiskInfo(disk)}
            </div>
          ))}
        </div>
      ), 2)}

      {renderSection('Networking', (
        <div>
          <p><strong>Service Type:</strong> {data.networking.serviceType}</p>
          <p><strong>Pod CIDR:</strong> {data.networking.podCIDR}</p>
          <p><strong>Service CIDR:</strong> {data.networking.serviceCIDR}</p>
          <p><strong>Networking Plugin:</strong> {data.networking.networkingPlugin}</p>
        </div>
      ), 3)}
    </div>
  );
}
