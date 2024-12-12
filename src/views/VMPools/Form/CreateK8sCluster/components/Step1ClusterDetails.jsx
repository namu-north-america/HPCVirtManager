import React, { useState, useEffect, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import Grid, { Col } from '../../../../../shared/Grid';
import { useSelector } from 'react-redux';
import { filterNamespacesByCrudVMS } from '../../../../../utils/commonFunctions';

export default function Step1ClusterDetails({ data, onChange }) {
  const [namespace, setNamespace] = useState([]);
  const { namespacesDropdown } = useSelector((state) => state.project);
  const { profile, userNamespace } = useSelector((state) => state.user);

  const k8sVersions = [
    { label: 'v1.28', value: '1.28' },
    { label: 'v1.27', value: '1.27' },
    { label: 'v1.26', value: '1.26' },
    { label: 'v1.23.10', value: 'v1.23.10'},
  ];

  const hasAccess = useCallback(() => {
    if (profile?.role === "admin") {
      setNamespace(namespacesDropdown);
    } else {
      const filteredNamespaces = filterNamespacesByCrudVMS(namespacesDropdown, userNamespace);
      const namespaceArray = filteredNamespaces.map(item => item.namespace);
      setNamespace(namespaceArray);
    }
  }, [profile, namespacesDropdown, userNamespace]);

  useEffect(() => {
    hasAccess();
  }, [hasAccess]);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="p-4">
      <Grid>
        <Col size={6}>
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

        <Col size={6}>
          <div className="field">
            <label htmlFor="namespace" className="block mb-2">
              Namespace *
            </label>
            <Dropdown
              id="namespace"
              value={data.namespace}
              onChange={(e) => handleChange('namespace', e.value)}
              options={namespace}
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
            </label>
            <Dropdown
              id="k8sVersion"
              value={data.k8sVersion}
              onChange={(e) => handleChange('k8sVersion', e.value)}
              options={k8sVersions}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field">
            <label htmlFor="nodeVMImage" className="block mb-2">
              Node VM Image
            </label>
            <InputText
              id="nodeVMImage"
              value={data.nodeVMImage}
              onChange={(e) => handleChange('nodeVMImage', e.target.value)}
              className="w-full"
              defaultValue="quay.io/capk/ubuntu-2004-container-disk:v1.23.10"
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field-checkbox">
            <Checkbox
              inputId="installDashboard"
              checked={data.installDashboard}
              onChange={(e) => handleChange('installDashboard', e.checked)}
            />
            <label htmlFor="installDashboard" className="ml-2">
              Install Kubernetes Dashboard
            </label>
          </div>
        </Col>
      </Grid>
    </div>
  );
}
