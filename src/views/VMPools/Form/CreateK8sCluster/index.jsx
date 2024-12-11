import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import CustomButton from '../../../../shared/CustomButton';
import Grid, { Col } from '../../../../shared/Grid';
import Page from '../../../../shared/Page';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useBreadcrumb } from '../../../../context/BreadcrumbContext';
import '../../../VirtualMachines/Form/AddVirtualMachineForm.scss';
import Step1ClusterDetails from './components/Step1ClusterDetails';
import Step2ControlPlane from './components/Step2ControlPlane';
import Step3WorkerNode from './components/Step3WorkerNode';
import Step4Networking from './components/Step4Networking';
import Step5Review from './components/Step5Review';
import api from '../../../../services/api';
import endPoints from "../../../../services/endPoints";

export default function CreateK8sCluster() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { breadcrumb } = useBreadcrumb();
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    clusterDetails: {
      clusterName: '',
      namespace: '',
      description: '',
      k8sVersion: '',
      installDashboard: true,
    },
    controlPlane: {
      name: '',
      workerNodes: 1,
      cores: 1,
      memory: 1,
      memoryType: 'GB',
      disks: [{
        createType: 'new',
        size: 100,
        memoryType: 'GB',
        storageClass: '',
        accessMode: '',
        type: 'http',
        url: '',
      }],
    },
    workerNode: {
      name: '',
      workerNodes: 1,
      cores: 1,
      memory: 1,
      memoryType: 'GB',
      disks: [{
        createType: 'new',
        size: 100,
        memoryType: 'GB',
        storageClass: '',
        accessMode: '',
        type: 'http',
        url: '',
      }],
    },
    networking: {
      serviceType: 'LoadBalancer',
      podCIDR: '',
      serviceCIDR: '',
      networkingPlugin: 'Flannel',
    },
  });

  const steps = [
    { number: 1, label: 'Cluster Details' },
    { number: 2, label: 'Control Plane' },
    { number: 3, label: 'Worker Node' },
    { number: 4, label: 'Networking' },
    { number: 5, label: 'Review' },
  ];

  const getCreateClusterPayload = (formData) => {
    const clusterName = formData.clusterDetails.clusterName
    const clusterNamespace = formData.clusterDetails.namespace
    return {
      "apiVersion": "cluster.x-k8s.io/v1beta1",
      "kind": "Cluster",
      "metadata": {
          "name": clusterName,
          "namespace": clusterNamespace,
      },
      "spec": {
          "clusterNetwork": {
              "pods": {
                  "cidrBlocks": [
                      formData.networking.podCIDR
                  ]
              },
              "services": {
                  "cidrBlocks": [
                      formData.networking.serviceCIDR
                  ]
              }
          },
          "controlPlaneRef": {
              "apiVersion": "controlplane.cluster.x-k8s.io/v1beta1",
              "kind": "KubeadmControlPlane",
              "name": clusterName+"-controlplane",
              "namespace": clusterNamespace
          },
          "infrastructureRef": {
              "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
              "kind": "KubevirtCluster",
              "name": clusterName,
              "namespace": clusterNamespace
          }
      }
    }
  }

  const createClusterAction = (formData) => async () => {
    console.log("creating cluster")
    console.log(formData)
    let res = await api(
      "post",
      endPoints.CREATE_CLUSTER({
        namespace: formData.clusterDetails.namespace,
        name: formData.clusterDetails.clusterName,
      }),
      getCreateClusterPayload(formData),
      {},
      {
        "Content-Type": "application/json",
      },
    );
    console.log(res)
  }

  const renderStep = () => {
    switch (activeIndex) {
      case 0:
        return (
          <Step1ClusterDetails
            data={formData.clusterDetails}
            onChange={(data) => setFormData({ ...formData, clusterDetails: data })}
          />
        );
      case 1:
        return (
          <Step2ControlPlane
            data={formData.controlPlane}
            onChange={(data) => setFormData({ ...formData, controlPlane: data })}
          />
        );
      case 2:
        return (
          <Step3WorkerNode
            data={formData.workerNode}
            onChange={(data) => setFormData({ ...formData, workerNode: data })}
          />
        );
      case 3:
        return (
          <Step4Networking
            data={formData.networking}
            onChange={(data) => setFormData({ ...formData, networking: data })}
          />
        );
      case 4:
        return <Step5Review data={formData} onEdit={setActiveIndex} />;
      default:
        return null;
    }
  };

  return (
    <Page title="Create Kubernetes Cluster">
      <div className="add-vm-form">
        <div className="flex">
          <div className="steps-sidebar">
            <ul className="step-list">
              {steps.map((step, index) => (
                <li
                  key={step.number}
                  className={`step-item ${index === activeIndex ? 'active' : ''} ${
                    completedSteps.includes(index) ? 'completed' : ''
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="step-number">{step.number}</div>
                  <div className="step-title">{step.label}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-content flex-grow-1">
            <Card>
              {renderStep()}
              <div className="flex justify-content-end gap-2 mt-4">
                {activeIndex > 0 && (
                  <CustomButton
                    label="Previous"
                    icon="pi pi-arrow-left"
                    onClick={() => setActiveIndex(activeIndex - 1)}
                  />
                )}
                {activeIndex < steps.length - 1 ? (
                  <CustomButton
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={() => {
                      setCompletedSteps([...completedSteps, activeIndex]);
                      setActiveIndex(activeIndex + 1);
                    }}
                  />
                ) : (
                  <CustomButton
                    label="Create Cluster"
                    icon="pi pi-check"
                    onClick={() => {
                      // Handle cluster creation
                      dispatch(createClusterAction(formData))
                      // navigate('/virtual-machines/pools');
                    }}
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
