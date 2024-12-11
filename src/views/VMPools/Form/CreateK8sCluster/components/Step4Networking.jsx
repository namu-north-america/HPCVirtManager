import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Grid, { Col } from '../../../../../shared/Grid';

export default function Step4Networking({ data, onChange }) {
  const serviceTypes = [
    { label: 'LoadBalancer', value: 'LoadBalancer' },
    { label: 'NodePort', value: 'NodePort' },
    { label: 'ClusterIP', value: 'ClusterIP' },
  ];

  const networkPlugins = [
    { label: 'Flannel', value: 'Flannel' },
    // Add other plugins if needed
  ];

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="p-4">
      <Grid>
        <Col size={12}>
          <div className="field">
            <label htmlFor="serviceType" className="block mb-2">
              Service Type *
            </label>
            <Dropdown
              id="serviceType"
              value={data.serviceType}
              onChange={(e) => handleChange('serviceType', e.value)}
              options={serviceTypes}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={6}>
          <div className="field">
            <label htmlFor="podCIDR" className="block mb-2">
              Pod CIDR *
            </label>
            <InputText
              id="podCIDR"
              value={data.podCIDR}
              onChange={(e) => handleChange('podCIDR', e.target.value)}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={6}>
          <div className="field">
            <label htmlFor="serviceCIDR" className="block mb-2">
              Service CIDR *
            </label>
            <InputText
              id="serviceCIDR"
              value={data.serviceCIDR}
              onChange={(e) => handleChange('serviceCIDR', e.target.value)}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field">
            <label htmlFor="networkingPlugin" className="block mb-2">
              Networking Plugin *
            </label>
            <Dropdown
              id="networkingPlugin"
              value={data.networkingPlugin}
              onChange={(e) => handleChange('networkingPlugin', e.value)}
              options={networkPlugins}
              className="w-full"
              required
            />
          </div>
        </Col>
      </Grid>
    </div>
  );
}
