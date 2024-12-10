import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import CustomButton from '../../../../shared/CustomButton';
import Grid, { Col } from '../../../../shared/Grid';
import Page from '../../../../shared/Page';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useBreadcrumb } from '../../../../context/BreadcrumbContext';
import '../../../VirtualMachines/Form/AddVirtualMachineForm.scss';
import Step1BasicSettings from './components/Step1BasicSettings';
import Step2MachinePool from './components/Step2MachinePool';
import Step3AdvancedOptions from './components/Step3AdvancedOptions';
import Step4Addons from './components/Step4Addons';
import Step5Review from './components/Step5Review';

export default function CreateK8sCluster() {
  const navigate = useNavigate();
  const { breadcrumb } = useBreadcrumb();
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    basicSettings: {
      clusterName: '',
      description: '',
      k8sVersion: '',
    },
    machinePools: [{
      name: '',
      workerNodes: 1,
      storage: {
        type: 'SSD',
        size: 100,
      },
      network: {
        subnet: '',
        ipRange: '',
      }
    }],
    advancedOptions: {},
    addons: {},
  });

  const steps = [
    { number: 1, label: 'Basic Settings' },
    { number: 2, label: 'Machine Pools' },
    { number: 3, label: 'Advanced Options' },
    { number: 4, label: 'Add-ons' },
    { number: 5, label: 'Review' },
  ];

  const renderStep = () => {
    switch (activeIndex) {
      case 0:
        return (
          <Step1BasicSettings
            data={formData.basicSettings}
            onChange={(data) => setFormData({ ...formData, basicSettings: data })}
          />
        );
      case 1:
        return (
          <Step2MachinePool
            data={formData.machinePools}
            onChange={(data) => setFormData({ ...formData, machinePools: data })}
          />
        );
      case 2:
        return <Step3AdvancedOptions />;
      case 3:
        return <Step4Addons />;
      case 4:
        return <Step5Review data={formData} onEdit={setActiveIndex} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex(activeIndex + 1);
      setCompletedSteps([...completedSteps, activeIndex]);
    }
  };

  const handleCancel = () => {
    navigate('/virtual-machines/pools');
  };

  return (
    <Page
      title="Create Kubernetes Cluster"
      breadcrumb={<BreadCrumb model={breadcrumb} />}
    >
      <div className="add-vm-form">
        <Card>
          <div className="flex">
            <div className="steps-sidebar">
              <ul className="step-list">
                {steps.map((step, index) => (
                  <li
                    key={step.number}
                    className={`step-item ${index === activeIndex ? 'active' : ''} 
                      ${completedSteps.includes(index) ? 'completed' : ''}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="step-number">{step.number}</span>
                    <div className="step-content">
                      <span className="step-title">{step.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="step-content">
              {renderStep()}
              
              <div className="button-container">
                <div className="flex justify-between mt-4">
                  <CustomButton
                    label="Back"
                    onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                  />
                  <div className="flex gap-2">
                    <CustomButton
                      label="Cancel"
                      severity="secondary"
                      onClick={handleCancel}
                    />
                    {activeIndex === steps.length - 1 ? (
                      <CustomButton
                        label="Create Cluster"
                        severity="success"
                        onClick={() => {/* Handle submission */}}
                      />
                    ) : (
                      <CustomButton
                        label="Next"
                        onClick={handleNext}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}
