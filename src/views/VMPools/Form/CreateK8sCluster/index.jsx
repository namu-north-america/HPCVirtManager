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
              "name": clusterName+"-control-plane",
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

  const getCreateKubeVirtClusterPayload = (formData) => {
    return {
      "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
      "kind": "KubevirtCluster",
      "metadata": {
          "name": formData.clusterDetails.clusterName,
          "namespace": formData.clusterDetails.namespace
      },
      "spec": {
          "controlPlaneServiceTemplate": {
              "spec": {
                  "type": "LoadBalancer"
              }
          }
      }
    }
  }

  const getCreateKVControlPlaneMachineTempPayload = (formData) => {
    const namespace = formData.clusterDetails.namespace
    return {
      "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
      "kind": "KubevirtMachineTemplate",
      "metadata": {
          "name": formData.clusterDetails.clusterName+"-control-plane",
          "namespace": namespace
      },
      "spec": {
          "template": {
              "spec": {
                  "virtualMachineBootstrapCheck": {
                      "checkStrategy": "ssh"
                  },
                  "virtualMachineTemplate": {
                      "metadata": {
                          "namespace": namespace
                      },
                      "spec": {
                          "runStrategy": "Always",
                          "template": {
                              "spec": {
                                  "domain": {
                                      "cpu": {
                                          "cores": +formData.controlPlane.cores
                                      },
                                      "devices": {
                                          "disks": [
                                              {
                                                  "disk": {
                                                      "bus": "virtio"
                                                  },
                                                  "name": "containervolume"
                                              }
                                          ],
                                          "networkInterfaceMultiqueue": true
                                      },
                                      "memory": {
                                          "guest": "4Gi"
                                      }
                                  },
                                  "evictionStrategy": "External",
                                  "volumes": [
                                      {
                                          "containerDisk": {
                                              "image": formData.clusterDetails.nodeVMImage
                                          },
                                          "name": "containervolume"
                                      }
                                  ]
                              }
                          }
                      }
                  }
              }
          }
      }
    }
  }

  const getCreateKubeadmControlPlanePayload = (formData) => {
    const name = formData.clusterDetails.clusterName
    const namespace = formData.clusterDetails.namespace
    return {
      "apiVersion": "controlplane.cluster.x-k8s.io/v1beta1",
      "kind": "KubeadmControlPlane",
      "metadata": {
          "name": name+"-control-plane",
          "namespace": namespace
      },
      "spec": {
          "kubeadmConfigSpec": {
              "clusterConfiguration": {
                  "networking": {
                      "dnsDomain": name+".default.local",
                      "podSubnet": formData.networking.podCIDR,
                      "serviceSubnet": formData.networking.serviceCIDR
                  }
              },
              "initConfiguration": {
                  "nodeRegistration": {
                      "criSocket": "/var/run/containerd/containerd.sock"
                  }
              },
              "joinConfiguration": {
                  "nodeRegistration": {
                      "criSocket": "/var/run/containerd/containerd.sock"
                  }
              }
          },
          "machineTemplate": {
              "infrastructureRef": {
                  "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
                  "kind": "KubevirtMachineTemplate",
                  "name": name+"-control-plane",
                  "namespace": namespace
              }
          },
          "replicas": formData.controlPlane.workerNodes,
          "version": formData.clusterDetails.k8sVersion
      }
    }
  }

  const getCreateKVWorkerNodeMachineTempPayload = (formData) => {
    const name = formData.clusterDetails.clusterName
    const namespace = formData.clusterDetails.namespace
    return {
      "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
      "kind": "KubevirtMachineTemplate",
      "metadata": {
          "name": name+"-md-0",
          "namespace": namespace
      },
      "spec": {
          "template": {
              "spec": {
                  "virtualMachineBootstrapCheck": {
                      "checkStrategy": "ssh"
                  },
                  "virtualMachineTemplate": {
                      "metadata": {
                          "namespace": namespace
                      },
                      "spec": {
                          "runStrategy": "Always",
                          "template": {
                              "spec": {
                                  "domain": {
                                      "cpu": {
                                          "cores": +formData.workerNode.cores
                                      },
                                      "devices": {
                                          "disks": [
                                              {
                                                  "disk": {
                                                      "bus": "virtio"
                                                  },
                                                  "name": "containervolume"
                                              }
                                          ],
                                          "networkInterfaceMultiqueue": true
                                      },
                                      "memory": {
                                          "guest": "4Gi"
                                      }
                                  },
                                  "evictionStrategy": "External",
                                  "volumes": [
                                      {
                                          "containerDisk": {
                                              "image": formData.clusterDetails.nodeVMImage
                                          },
                                          "name": "containervolume"
                                      }
                                  ]
                              }
                          }
                      }
                  }
              }
          }
      }
    }
  }

  const getCreateKubeadmConfigTempPayload = (formData) => {
    return {
      "apiVersion": "bootstrap.cluster.x-k8s.io/v1beta1",
      "kind": "KubeadmConfigTemplate",
      "metadata": {
          "name": formData.clusterDetails.clusterName+"-md-0",
          "namespace": formData.clusterDetails.namespace
      },
      "spec": {
          "template": {
              "spec": {
                  "joinConfiguration": {
                      "nodeRegistration": {
                          "kubeletExtraArgs": {}
                      }
                  }
              }
          }
      }
    }
  }

  const getCreateMachinePayload = (formData) => {
    const name = formData.clusterDetails.clusterName
    const namespace = formData.clusterDetails.namespace
    return {
      "apiVersion": "cluster.x-k8s.io/v1beta1",
      "kind": "MachineDeployment",
      "metadata": {
          "name": name+"-md-0",
          "namespace": namespace
      },
      "spec": {
          "clusterName": name,
          "replicas": formData.workerNode.workerNodes,
          "selector": {
              "matchLabels": null
          },
          "template": {
              "spec": {
                  "bootstrap": {
                      "configRef": {
                          "apiVersion": "bootstrap.cluster.x-k8s.io/v1beta1",
                          "kind": "KubeadmConfigTemplate",
                          "name": name+"-md-0",
                          "namespace": namespace
                      }
                  },
                  "clusterName": "capi-cluster",
                  "infrastructureRef": {
                      "apiVersion": "infrastructure.cluster.x-k8s.io/v1alpha1",
                      "kind": "KubevirtMachineTemplate",
                      "name": name+"-md-0",
                      "namespace": namespace
                  },
                  "version": formData.clusterDetails.k8sVersion
              }
          }
      }
    }
  }

  const createMachineAction = (formData) => async () => {
    console.log("creating machine")
    let res = await api(
      "post",
      endPoints.CREATE_MACHINE_DEPLOYMENT({
        namespace: formData.clusterDetails.namespace,
        name: formData.clusterDetails.clusterName+"-md-0",
      }),
      getCreateMachinePayload(formData),
      {},
      {
        "Content-Type": "application/json",
      },
    );
    console.log(res)
  }

  const createKubeadmConfigTempAction = (formData) => async () => {
    console.log("creating kubeadm config template")
    let res = await api(
      "post",
      endPoints.CREATE_KUBEADM_CONFIG_TEMPLATE({
        namespace: formData.clusterDetails.namespace,
        name: formData.clusterDetails.clusterName+"-md-0",
      }),
      getCreateKubeadmConfigTempPayload(formData),
      {},
      {
        "Content-Type": "application/json",
      },
    );
    console.log(res)
  }

  const createKVWorkerNodeMachineTempAction = (formData) => async () => {
    console.log("creating kv worker node machine template")
    let res = await api(
      "post",
      endPoints.CREATE_KUBEVIRT_MACHINE_TEMPLATE({
        namespace: formData.clusterDetails.namespace,
        name: formData.clusterDetails.clusterName+"-md-0",
      }),
      getCreateKVWorkerNodeMachineTempPayload(formData),
      {},
      {
        "Content-Type": "application/json",
      },
    );
    console.log(res)
  }

  const createKubeadmControlPlaneAction = (formData) => async () => {
    console.log("creating kv cp machine template")
    let res = await api(
      "post",
      endPoints.CREATE_KUBEADM_CONTROL_PLANE({
        namespace: formData.clusterDetails.namespace,
        name: formData.clusterDetails.clusterName+"-control-plane",
      }),
      getCreateKubeadmControlPlanePayload(formData),
      {},
      {
        "Content-Type": "application/json",
      },
    );
    console.log(res)
  }

  const createKVControlPlaneMachineTempAction = (formData) => async () => {
    console.log("creating kv cp machine template")
    let res = await api(
      "post",
      endPoints.CREATE_KUBEVIRT_MACHINE_TEMPLATE({
        namespace: formData.clusterDetails.namespace,
        name: formData.clusterDetails.clusterName+"-control-plane",
      }),
      getCreateKVControlPlaneMachineTempPayload(formData),
      {},
      {
        "Content-Type": "application/json",
      },
    );
    console.log(res)
  }

  const createKubeVirtClusterAction = (formData) => async () => {
    console.log("creating kubevirt cluster")
    let res = await api(
      "post",
      endPoints.CREATE_KUBEVIRT_CLUSTER({
        namespace: formData.clusterDetails.namespace,
        name: formData.clusterDetails.clusterName,
      }),
      getCreateKubeVirtClusterPayload(formData),
      {},
      {
        "Content-Type": "application/json",
      },
    );
    console.log(res)
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
                      dispatch(createClusterAction(formData))
                      dispatch(createKubeVirtClusterAction(formData))
                      dispatch(createKVControlPlaneMachineTempAction(formData))
                      dispatch(createKubeadmControlPlaneAction(formData))
                      dispatch(createKVWorkerNodeMachineTempAction(formData))
                      dispatch(createKubeadmConfigTempAction(formData))
                      dispatch(createMachineAction(formData))
                      navigate("/clusters")
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
