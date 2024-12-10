import React from 'react';
import { Card } from 'primereact/card';
import CustomButton from '../../../../../shared/CustomButton';

export default function Step5Review({ data, onEdit }) {
  const renderSection = (title, content, step) => (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="m-0">{title}</h3>
        <CustomButton
          label="Edit"
          icon="pi pi-pencil"
          onClick={() => onEdit(step)}
          severity="secondary"
        />
      </div>
      {content}
    </Card>
  );

  return (
    <div className="p-4">
      {renderSection('Basic Settings', (
        <div>
          <p><strong>Cluster Name:</strong> {data.basicSettings.clusterName}</p>
          <p><strong>K8s Version:</strong> {data.basicSettings.k8sVersion}</p>
          {data.basicSettings.description && (
            <p><strong>Description:</strong> {data.basicSettings.description}</p>
          )}
        </div>
      ), 0)}

      {renderSection('Machine Pools', (
        <div>
          {data.machinePools.map((pool, index) => (
            <div key={index} className="mb-3">
              <h4 className="mt-0">Pool {index + 1}: {pool.name}</h4>
              <p><strong>Worker Nodes:</strong> {pool.workerNodes}</p>
              <p><strong>Storage:</strong> {pool.storage.size}GB {pool.storage.type}</p>
              <p><strong>Network:</strong> {pool.network.subnet} ({pool.network.ipRange})</p>
            </div>
          ))}
        </div>
      ), 1)}
    </div>
  );
}
