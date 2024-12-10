import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Accordion, AccordionTab } from 'primereact/accordion';
import Grid, { Col } from '../../../../../shared/Grid';
import CustomButton from '../../../../../shared/CustomButton';

export default function Step2MachinePool({ data, onChange }) {
  const storageTypes = [
    { label: 'SSD', value: 'SSD' },
    { label: 'HDD', value: 'HDD' },
  ];

  const handlePoolChange = (index, field, value) => {
    const newPools = [...data];
    newPools[index] = { ...newPools[index], [field]: value };
    onChange(newPools);
  };

  const addPool = () => {
    onChange([...data, {
      name: '',
      workerNodes: 1,
      storage: { type: 'SSD', size: 100 },
      network: { subnet: '', ipRange: '' },
    }]);
  };

  return (
    <div className="p-4">
      <Accordion multiple>
        {data.map((pool, index) => (
          <AccordionTab 
            key={index}
            header={`Machine Pool ${index + 1}${pool.name ? ': ' + pool.name : ''}`}
          >
            <Grid>
              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">Pool Name *</label>
                  <InputText
                    value={pool.name}
                    onChange={(e) => handlePoolChange(index, 'name', e.target.value)}
                    className="w-full"
                  />
                </div>
              </Col>
              
              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">Worker Nodes *</label>
                  <InputNumber
                    value={pool.workerNodes}
                    onChange={(e) => handlePoolChange(index, 'workerNodes', e.value)}
                    min={1}
                    className="w-full"
                  />
                </div>
              </Col>

              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">Storage Type</label>
                  <Dropdown
                    value={pool.storage.type}
                    options={storageTypes}
                    onChange={(e) => handlePoolChange(index, 'storage', { ...pool.storage, type: e.value })}
                    className="w-full"
                  />
                </div>
              </Col>

              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">Storage Size (GB)</label>
                  <InputNumber
                    value={pool.storage.size}
                    onChange={(e) => handlePoolChange(index, 'storage', { ...pool.storage, size: e.value })}
                    min={1}
                    suffix=" GB"
                    className="w-full"
                  />
                </div>
              </Col>

              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">Subnet</label>
                  <InputText
                    value={pool.network.subnet}
                    onChange={(e) => handlePoolChange(index, 'network', { ...pool.network, subnet: e.target.value })}
                    className="w-full"
                  />
                </div>
              </Col>

              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">IP Range</label>
                  <InputText
                    value={pool.network.ipRange}
                    onChange={(e) => handlePoolChange(index, 'network', { ...pool.network, ipRange: e.target.value })}
                    className="w-full"
                  />
                </div>
              </Col>
            </Grid>
          </AccordionTab>
        ))}
      </Accordion>

      <div className="mt-4">
        <CustomButton
          label="Add Machine Pool"
          icon="pi pi-plus"
          onClick={addPool}
        />
      </div>
    </div>
  );
}
