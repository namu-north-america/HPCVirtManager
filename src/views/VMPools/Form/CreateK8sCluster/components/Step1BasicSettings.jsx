import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Grid, { Col } from '../../../../../shared/Grid';
import { Tooltip } from 'primereact/tooltip';

export default function Step1BasicSettings({ data, onChange }) {
  const k8sVersions = [
    { label: 'v1.28', value: '1.28' },
    { label: 'v1.27', value: '1.27' },
    { label: 'v1.26', value: '1.26' },
  ];

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="p-4">
      <Grid>
        <Col size={12}>
          <div className="field">
            <label htmlFor="clusterName" className="block mb-2">
              Cluster Name *
            </label>
            <InputText
              id="clusterName"
              value={data.clusterName}
              onChange={(e) => handleChange('clusterName', e.target.value)}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field">
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <InputTextarea
              id="description"
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field">
            <label htmlFor="k8sVersion" className="block mb-2">
              Kubernetes Version *
              <i 
                className="pi pi-info-circle ml-2 cursor-pointer"
                data-pr-tooltip="Select the Kubernetes version for your cluster"
                data-pr-position="right"
              />
            </label>
            <Tooltip target=".pi-info-circle" />
            <Dropdown
              id="k8sVersion"
              value={data.k8sVersion}
              options={k8sVersions}
              onChange={(e) => handleChange('k8sVersion', e.value)}
              className="w-full"
              required
            />
          </div>
        </Col>
      </Grid>
    </div>
  );
}
