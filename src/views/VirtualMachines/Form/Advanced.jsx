import React, { useCallback, useEffect, useRef, useState } from "react";
import { CustomForm } from "../../../shared/AllInputs";
import YamlEditor from "../../../shared/YamlEditor";
import { useDispatch, useSelector } from "react-redux";
import { setYamlString } from "../../../store/slices/vmSlice";
import jsYaml from "js-yaml";
import { _getDeviceFromDisk } from "../../../store/actions/vmActions";

export default function Advanced({ data, setDisks, disks, handleChange, onValidate }) {
  const dispatch = useDispatch();
  const { updatedYamlString } = useSelector((state) => state.vm);
  const [yamlDataObject, setYamlObject] = useState();
  const initChange = useRef(true);

  const onChange = useCallback((value, yamlDataObject) => {
    if (initChange.current) {
      initChange.current = false;
    } else {
      dispatch(setYamlString(value));
    }
    setYamlObject(yamlDataObject);
  }, []);

  useEffect(() => {
    return () => {
      if (handleChange && yamlDataObject) {
        const newData = {
          name: yamlDataObject.metadata?.name,
          namespace: yamlDataObject.metadata?.namespace,
          cores: yamlDataObject.spec?.template?.spec?.domain?.cpu?.cores,
          sockets: yamlDataObject.spec?.template?.spec?.domain?.cpu?.sockets,
          threads: yamlDataObject.spec?.template?.spec?.domain?.cpu?.threads,

          advanced: yamlDataObject,
        };
        const memory = yamlDataObject.spec?.template?.spec?.domain?.resources?.requests?.memory;
        const match = memory.match(/(\d+)(\D+)/);
        if (match) {
          data.memory = match[1];
          data.memoryType = match[2];
        }
        handleChange({ ...data, ...newData });
        if (setDisks && yamlDataObject) {
        }
      }
    };
  }, [yamlDataObject]);

  useEffect(() => {
    if (updatedYamlString) {
      const objectData = jsYaml.load(updatedYamlString);

      if (data.cores) objectData.spec.template.spec.domain.cpu.cores = parseInt(data.cores);
      if (data.sockets) objectData.spec.template.spec.domain.cpu.sockets = parseInt(data.sockets);
      if (data.threads) objectData.spec.template.spec.domain.cpu.threads = parseInt(data.threads);
      if (data.name) objectData.metadata.name = data.name;
      if (data.namespace) objectData.metadata.namespace = data.namespace;
      if (data.memory)
        objectData.spec.template.spec.domain.resources.requests.memory = parseInt(data.memory) + data.memoryType;

      if (disks.length) {
        const yamlDataVolumeTemplates = objectData.spec.dataVolumeTemplates;
        const devicesSection = objectData.spec.template?.spec?.domain?.devices;
        const name = data.name || objectData.metadata.name;
        disks.forEach((disk, i) => {
          if (disk.createType == "new") {
            let diskName = `${name.trim()}-disk${i + 1}`;
            const device = _getDeviceFromDisk({ ...disk, diskName }, i);
            if (yamlDataVolumeTemplates.length) {
              if (yamlDataVolumeTemplates[i]) {
                const item = yamlDataVolumeTemplates[i];
                yamlDataVolumeTemplates[i] = {
                  ...item,
                  metadata: {
                    name: diskName,
                  },
                  spec: {
                    ...item.spec,
                    pvc: {
                      ...item.spec.pvc,
                      storageClassName: disk.storageClass,
                      accessModes: [disk.accessMode],
                      resources: {
                        ...item.spec?.pvc?.resources,
                        requests: {
                          storage: `${disk.size}${disk?.memoryType}`,
                        },
                      },
                    },
                    source: {
                      [disk.type]: {
                        url: disk.url,
                      },
                    },
                  },
                };
                objectData.spec.template.spec.domain.devices.disks[i] = device;
              } else {
                yamlDataVolumeTemplates.push({
                  metadata: {
                    name: diskName,
                  },
                  spec: {
                    pvc: {
                      storageClassName: disk.storageClass,
                      accessModes: [disk.accessMode],
                      resources: {
                        requests: {
                          storage: `${disk.size}${disk?.memoryType}`,
                        },
                      },
                    },
                    source: {
                      [disk.type]: {
                        url: disk.url,
                      },
                    },
                  },
                });

                objectData.spec.template.spec.domain.devices.disks.push(device);
              }
            }
          }
        });
      }
      const yamlString = jsYaml.dump(objectData, {
        noArrayIndent: true,
        styles: { "!!str": "plain", "!!null": "empty" },
      });

      dispatch(setYamlString(yamlString));
    }
  }, []);

  return (
    <CustomForm>
      <YamlEditor
        onChange={onChange}
        name="advanced"
        defaultValue={updatedYamlString}
        value={updatedYamlString}
        objectValue={yamlDataObject}
        onValidate={onValidate}
      />
    </CustomForm>
  );
}
