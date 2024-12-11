import React, { useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Accordion, AccordionTab } from 'primereact/accordion';
import Grid, { Col } from '../../../../../shared/Grid';
import CustomButton from '../../../../../shared/CustomButton';
import { useSelector } from "react-redux";
import { CustomDropDown, CustomMemoryInput, CustomInput } from '../../../../../shared/AllInputs';
import { confirmPopup } from 'primereact/confirmpopup';

export default function Step2MachinePool({ data, onChange }) {
  const { storageClassesDropdown, accessModeDropdown, disksDropdown, images } = useSelector((state) => state.project);

  const typesDropdown = [
    { name: "Blank", value: "blank" },
    { name: "HTTP(s)", value: "http" },
    { name: "Registry", value: "registry" },
    { name: "GCS", value: "gcs" },
    { name: "S3", value: "s3" },
  ];

  const handlePoolChange = (index, field, value) => {
    const newPools = [...data];
    newPools[index] = { ...newPools[index], [field]: value };
    onChange(newPools);
  };

  const handleDiskChange = (poolIndex, diskIndex, field, value) => {
    const newPools = [...data];
    const newDisks = [...newPools[poolIndex].disks];
    newDisks[diskIndex] = { ...newDisks[diskIndex], [field]: value };
    newPools[poolIndex].disks = newDisks;
    onChange(newPools);
  };

  const addDisk = (poolIndex) => {
    const newPools = [...data];
    if (!newPools[poolIndex].disks) {
      newPools[poolIndex].disks = [];
    }
    newPools[poolIndex].disks.push({
      createType: 'new',
      diskType: 'disk',
      busType: 'virtio',
      memoryType: 'Gi',
      size: '',
      storageClass: '',
      accessMode: '',
      type: 'blank',
      url: '',
      cache: '',
    });
    onChange(newPools);
  };

  const removeDisk = (poolIndex, diskIndex, event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to remove this disk?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: "primary-button",
      accept: () => {
        const newPools = [...data];
        newPools[poolIndex].disks = newPools[poolIndex].disks.filter((_, i) => i !== diskIndex);
        onChange(newPools);
      },
    });
  };

  const addPool = () => {
    onChange([...data, {
      name: '',
      workerNodes: 1,
      disks: [{
        createType: 'new',
        diskType: 'disk',
        busType: 'virtio',
        memoryType: 'Gi',
        size: '',
        storageClass: '',
        accessMode: '',
        type: 'blank',
        url: '',
        cache: '',
      }],
      network: { subnet: '', ipRange: '' },
    }]);
  };

  return (
    <div className="p-4">
      <Accordion multiple>
        {data.map((pool, poolIndex) => (
          <AccordionTab 
            key={poolIndex}
            header={`Machine Pool ${poolIndex + 1}${pool.name ? ': ' + pool.name : ''}`}
          >
            <Grid>
              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">Pool Name *</label>
                  <InputText
                    value={pool.name}
                    onChange={(e) => handlePoolChange(poolIndex, 'name', e.target.value)}
                    className="w-full"
                  />
                </div>
              </Col>
              
              <Col size={6}>
                <div className="field">
                  <label className="block mb-2">Number of Worker Nodes *</label>
                  <InputNumber
                    value={pool.workerNodes}
                    onValueChange={(e) => handlePoolChange(poolIndex, 'workerNodes', e.value)}
                    min={1}
                    className="w-full"
                  />
                </div>
              </Col>

              {/* Storage Configuration Section */}
              <Col size={12}>
                <div className="field">
                  <h3>Storage Configuration</h3>
                  {pool.disks?.map((disk, diskIndex) => (
                    <div key={diskIndex} className="p-3 border-1 border-round mb-3">
                      <Grid>
                        <Col size={12}>
                          <CustomDropDown
                            label={`Select a storage disk(${diskIndex + 1}) option`}
                            value={disk.createType}
                            onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'createType', value)}
                            options={[
                              { name: "Create a new storage disk", value: "new" },
                              { name: "Attach an existing storage disk", value: "existing" },
                              { name: "Attach an image", value: "image" },
                            ]}
                            required
                          />
                        </Col>

                        <Col size={6}>
                          <CustomDropDown
                            label="Disk Type *"
                            value={disk.diskType}
                            onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'diskType', value)}
                            options={[
                              { name: "Disk", value: "disk" },
                              { name: "CDROM", value: "cdrom" },
                            ]}
                            required
                          />
                        </Col>

                        <Col size={6}>
                          <CustomDropDown
                            label="Bus Type"
                            value={disk.busType}
                            onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'busType', value)}
                            options={[
                              { name: "virtio", value: "virtio" },
                              { name: "sata", value: "sata" },
                              { name: "scsi", value: "scsi" },
                            ]}
                          />
                        </Col>

                        {disk.createType === 'new' && (
                          <>
                            <Col size={6}>
                              <CustomMemoryInput
                                label="Size *"
                                value={disk.size}
                                memoryType={disk.memoryType}
                                onChangeSize={(value) => handleDiskChange(poolIndex, diskIndex, 'size', value)}
                                onChangeType={(value) => handleDiskChange(poolIndex, diskIndex, 'memoryType', value)}
                                required
                              />
                            </Col>
                            <Col size={6}>
                              <CustomDropDown
                                label="Storage Class *"
                                value={disk.storageClass}
                                onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'storageClass', value)}
                                options={storageClassesDropdown}
                                required
                              />
                            </Col>
                            <Col size={6}>
                              <CustomDropDown
                                label="Access Mode *"
                                value={disk.accessMode}
                                onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'accessMode', value)}
                                options={accessModeDropdown}
                                required
                              />
                            </Col>
                            <Col size={6}>
                              <CustomDropDown
                                label="Type *"
                                value={disk.type}
                                onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'type', value)}
                                options={typesDropdown}
                                required
                              />
                            </Col>
                            {disk.type !== 'blank' && (
                              <Col size={12}>
                                <CustomInput
                                  label="URL"
                                  value={disk.url}
                                  onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'url', value)}
                                  placeholder="HTTP/S3/Registry source"
                                  required
                                />
                              </Col>
                            )}
                          </>
                        )}

                        {disk.createType === 'existing' && (
                          <Col size={12}>
                            <CustomDropDown
                              label="Select Disk *"
                              value={disk.disk}
                              onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'disk', value)}
                              options={disksDropdown.map(disk => ({ name: disk, value: disk }))}
                              required
                            />
                          </Col>
                        )}

                        {disk.createType === 'image' && (
                          <Col size={12}>
                            <CustomDropDown
                              label="Select Image *"
                              value={disk.image}
                              onChange={({ value }) => handleDiskChange(poolIndex, diskIndex, 'image', value)}
                              options={images.map(image => ({ name: image.name, value: image.name }))}
                              required
                            />
                          </Col>
                        )}

                        <Col size={12} className="flex align-items-center justify-content-end">
                          {pool.disks.length > 1 && (
                            <CustomButton
                              icon="pi pi-trash"
                              onClick={(e) => removeDisk(poolIndex, diskIndex, e)}
                              className="p-button-danger p-button-outlined"
                            />
                          )}
                        </Col>
                      </Grid>
                    </div>
                  ))}
                  <CustomButton
                    label="Add Disk"
                    icon="pi pi-plus"
                    onClick={() => addDisk(poolIndex)}
                    className="p-button-outlined"
                  />
                </div>
              </Col>

              {/* Network Configuration Section */}
              <Col size={12}>
                <div className="field">
                  <h3>Network Configuration</h3>
                  <Grid>
                    <Col size={6}>
                      <div className="field">
                        <label className="block mb-2">Subnet</label>
                        <InputText
                          value={pool.network.subnet}
                          onChange={(e) => handlePoolChange(poolIndex, 'network', { ...pool.network, subnet: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </Col>
                    <Col size={6}>
                      <div className="field">
                        <label className="block mb-2">IP Range</label>
                        <InputText
                          value={pool.network.ipRange}
                          onChange={(e) => handlePoolChange(poolIndex, 'network', { ...pool.network, ipRange: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </Col>
                  </Grid>
                </div>
              </Col>
            </Grid>
          </AccordionTab>
        ))}
      </Accordion>

      <div className="flex justify-content-end mt-3">
        <CustomButton
          label="Add Machine Pool"
          icon="pi pi-plus"
          onClick={addPool}
          className="p-button-outlined"
        />
      </div>
    </div>
  );
}
