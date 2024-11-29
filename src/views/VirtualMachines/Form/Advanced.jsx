import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { CustomForm } from "../../../shared/AllInputs";
import YamlEditor from "../../../shared/YamlEditor";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatedYamlString } from "../../../store/slices/vmSlice";
import jsYaml from "js-yaml";
import {
  _getAccessCredentials,
  _getDeviceFromDisk,
  _getDevices,
  _getVolumeFromDisk,
  _getVolumes,
  _setUserDataAndNetworkDisks,
} from "../../../store/actions/vmActions";

export default function Advanced({ data, setDisks, disks, handleChange, onValidate }) {
  const dispatch = useDispatch();
  const { updatedYamlString } = useSelector((state) => state.vm);
  const project = useSelector((state) => state.project);
  const [yamlDataObject, setYamlObject] = useState();
  const initChange = useRef(true);

  const onChange = useCallback((value, yamlDataObject) => {
    if (initChange.current) {
      initChange.current = false;
    } else {
      dispatch(setUpdatedYamlString(value));
    }
    console.log("yaml data object___", yamlDataObject);
    setYamlObject(yamlDataObject);
  }, []);

  useEffect(() => {
    return () => {
      if (handleChange && yamlDataObject) {
        const newData = {
          name: yamlDataObject.metadata?.name || data.name,
          namespace: yamlDataObject.metadata?.namespace || data.namespace,
          cores: yamlDataObject.spec?.template?.spec?.domain?.cpu?.cores || data.cores,
          sockets: yamlDataObject.spec?.template?.spec?.domain?.cpu?.sockets || data.sockets,
          threads: yamlDataObject.spec?.template?.spec?.domain?.cpu?.threads || data.threads,
          advanced: yamlDataObject,
        };
        const memory = yamlDataObject.spec?.template?.spec?.domain?.resources?.requests?.memory;
        const match = (memory || "").match(/(\d+)(\D+)/);
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

  // Here we fill the Yaml template with values from `data` and `disks`
  useEffect(() => {
    if (updatedYamlString) {
      const objectData = jsYaml.load(updatedYamlString);
      console.log("object data_____", objectData, updatedYamlString);
      if (data.cores) objectData.spec.template.spec.domain.cpu.cores = parseInt(data.cores);
      if (data.sockets) objectData.spec.template.spec.domain.cpu.sockets = parseInt(data.sockets);
      if (data.threads) objectData.spec.template.spec.domain.cpu.threads = parseInt(data.threads);
      if (data.name) {
        objectData.metadata.name = data.name;
        objectData.metadata.labels["kubevirt.io/domain"] = data.name;
      }
      if (data.userName) objectData.metadata.labels["cloud-init.kubevirt-manager.io/username"] = data.userName;
      if (data.namespace) objectData.metadata.namespace = data.namespace;
      if (data.memory)
        objectData.spec.template.spec.domain.resources.requests.memory = parseInt(data.memory) + data.memoryType;
      if (data.node) {
        objectData.spec.template.spec.nodeSelector["kubernetes.io/hostname"] = data.node;
      }
      if (disks.length) {
        if (disks.length > 1) {
          if (objectData.spec.template?.spec?.domain?.devices?.disks) {
            objectData.spec.template.spec.domain.devices.disks = [];
          }
          if (objectData.spec?.template?.spec?.volumes) {
            objectData.spec.template.spec.volumes = [];
          }
          if (objectData.spec?.dataVolumeTemplates) {
            objectData.spec.dataVolumeTemplates = [];
          }
        }
        let yamlDataVolumeTemplates = objectData.spec.dataVolumeTemplates;

        if (!yamlDataVolumeTemplates) {
          objectData.spec.dataVolumeTemplates = [];
          yamlDataVolumeTemplates = objectData.spec.dataVolumeTemplates;
        }

        const name = data.name || objectData.metadata.name;
        const namespace = data.namespace || objectData.metadata.namespace;

        disks.forEach((disk, i) => {
          if (disk.createType == "new" || disk.createType === "image") {
            let diskName = `${name.trim()}-disk${i + 1}`;

            if (i == 0 && disks.length === 1) {
              const item = yamlDataVolumeTemplates[i] ? yamlDataVolumeTemplates[i] : [];
              const currentDevice = objectData.spec?.template?.spec?.domain?.devices?.disks[0];
              const diskType = disk.type === "blank" ? "http" : disk.type;
              const accessMode = disk.accessMode ? [disk.accessMode] : item.spec?.pvc?.accessModes;
              const storageClass = disk.storageClass ? disk.storageClass : item.spec?.pvc?.storageClassName;
              const storage = disk.size
                ? `${disk.size}${disk?.memoryType}`
                : item.spec?.pvc?.resources?.requests?.storage;
              yamlDataVolumeTemplates[i] = {
                ...item,
                metadata: {
                  name: diskName,
                },
                spec: {
                  ...item.spec,
                  pvc: {
                    ...item?.spec?.pvc,
                    storageClassName: storageClass,
                    accessModes: accessMode,
                    resources: {
                      ...item.spec?.pvc?.resources,
                      requests: {
                        storage: storage,
                      },
                    },
                  },
                  source: {
                    [diskType]: {
                      url: disk.url || item?.spec?.source[diskType].url,
                    },
                  },
                },
              };
              // if (!device.disk.bus) {
              //   device.disk.bus = currentDevice.disk.bus;
              // }
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
            }
          }
        });

        const _disks = disks.map((disk, i) => {
          if (disk?.createType === "new" || disk?.createType === "image") {
            const diskName = `${name.trim()}-disk${i + 1}`;
            const diskNamespace = namespace;

            let existingDisks = project.disks;

            let diskNameCheck = existingDisks.find(
              (item) => item.name === diskName && item.namespace === diskNamespace
            );
            if (diskNameCheck) {
              throw new Error(`Disk ${diskName} with name/namespace combination already exists!`);
            }

            let _obj = {
              cache: disk?.cache,
              diskType: disk?.diskType,
              busType: disk?.busType,
              diskName: `disk${i + 1}`,
              volumeName: diskName,
            };

            if (disk?.cache) {
              _obj.cache = disk?.cache;
            }

            return _obj;
          } else {
            let _obj = {
              diskType: disk?.diskType,
              busType: disk?.busType,
              diskName: `disk${i + 1}`,
              volumeName: disk?.disk,
            };
            if (disk?.cache) {
              _obj.cache = disk?.cache;
            }

            return _obj;
          }
        });

        const _devices = _getDevices(_disks);
        const _volumes = _getVolumes(_disks);

        _setUserDataAndNetworkDisks(_devices, _volumes, { name, username: data.userName, password: data.password });

        objectData.spec.template.spec.domain.devices.disks = _devices;
        objectData.spec.template.spec.volumes = _volumes;

        if (!yamlDataVolumeTemplates) {
          objectData.spec.dataVolumeTemplates = null;
        }

        if (data.sshKey) {
          objectData.spec.template.spec.accessCredentials = _getAccessCredentials(data.sshKey);
        }
      }
      const yamlString = jsYaml.dump(objectData, {
        noArrayIndent: true,
        styles: { "!!str": "plain", "!!null": "empty" },
      });

      dispatch(setUpdatedYamlString(yamlString));
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
