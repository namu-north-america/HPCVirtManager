import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import Grid, { Col } from '../../../../../shared/Grid';
import { useSelector } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { CustomDropDown, CustomMemoryInput, CustomInput } from '../../../../../shared/AllInputs';

export default function Step2ControlPlane({ data, onChange }) {
  const { storageClassesDropdown, accessModeDropdown } = useSelector((state) => state.project);

  const storageDiskOption = [
    { label: "Data Volume", value: "dataVolume" },
  ];

  const typeDropdown = [
    { label: "HTTP", value: "https" },
    { label: "HTTPS", value: "https" },
  ];

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleDiskChange = (diskIndex, field, value) => {
    const newDisks = [...data.disks];
    newDisks[diskIndex] = { ...newDisks[diskIndex], [field]: value };
    onChange({ ...data, disks: newDisks });
  };

  return (
    <div className="p-4">
      <Grid>
        <Col size={6}>
          <div className="field">
            <label className="block mb-2">Name *</label>
            <InputText
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full"
            />
          </div>
        </Col>
        
        <Col size={6}>
          <div className="field">
            <label className="block mb-2">Number of Nodes *</label>
            <InputNumber
              value={data.workerNodes}
              onValueChange={(e) => handleChange('workerNodes', e.value)}
              min={1}
              className="w-full"
            />
          </div>
        </Col>

        <Col size={6}>
          <CustomInput
            label="Cores *"
            value={data.cores}
            onChange={({ value }) => handleChange('cores', value)}
            keyfilter="pint"
            required
          />
        </Col>

        <Col size={6}>
          <CustomMemoryInput
            label="Memory *"
            value={data.memory}
            typeValue={data.memoryType}
            onChange={(value) => handleChange('memory', value)}
            onTypeChange={(value) => handleChange('memoryType', value)}
            keyfilter="pint"
            required
          />
        </Col>

        {/* Storage Configuration Section */}
        <Col size={12}>
          <div className="field">
            <h3>Storage Configuration</h3>
            {data.disks?.map((disk, diskIndex) => (
              <div key={diskIndex} className="p-3 border-1 border-round mb-3">
                <Grid>
                  <Col size={12}>
                    <div className="field">
                      <label htmlFor="storageDiskOption" className="block mb-2">
                        Storage Disk Option *
                      </label>
                      <Dropdown
                        id="storageDiskOption"
                        value={data.storageDiskOption}
                        onChange={(e) => handleChange("storageDiskOption", e.value)}
                        options={storageDiskOption}
                        className="w-full"
                        required
                      />
                    </div>
                  </Col>

                  <Col size={6}>
                    <CustomMemoryInput
                      label="Size *"
                      value={disk.size}
                      typeValue={disk.memoryType}
                      onChange={(value) => handleDiskChange(diskIndex, 'size', value)}
                      onTypeChange={(value) => handleDiskChange(diskIndex, 'memoryType', value)}
                      required
                    />
                  </Col>

                  <Col size={6}>
                    <CustomDropDown
                      label="Storage Class *"
                      value={disk.storageClass}
                      onChange={({ value }) => handleDiskChange(diskIndex, 'storageClass', value)}
                      options={storageClassesDropdown}
                      required
                    />
                  </Col>

                  <Col size={12}>
                    <CustomDropDown
                      label="Access Mode *"
                      value={disk.accessMode}
                      onChange={({ value }) => handleDiskChange(diskIndex, 'accessMode', value)}
                      options={accessModeDropdown}
                      required
                    />
                  </Col>

                  <Col size={6}>
                    <div className="field">
                      <label htmlFor="type" className="block mb-2">
                        Type *
                      </label>
                      <Dropdown
                        id="type"
                        value={data.type}
                        onChange={(e) => handleChange("type", e.value)}
                        options={typeDropdown}
                        placeholder='Select'
                        className="w-full"
                        required
                      />
                    </div>
                  </Col>

                  <Col size={12}>
                    <CustomInput
                      label="URL *"
                      value={disk.url}
                      onChange={({ value }) => handleDiskChange(diskIndex, 'url', value)}
                      placeholder="HTTP/S3/Registry source"
                      required
                    />
                  </Col>
                </Grid>
              </div>
            ))}
          </div>
        </Col>
      </Grid>
    </div>
  );
}
