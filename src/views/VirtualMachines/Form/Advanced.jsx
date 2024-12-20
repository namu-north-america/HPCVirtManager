import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { CustomForm } from "../../../shared/AllInputs";
import YamlEditor from "../../../shared/YamlEditor";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatedYamlString, yamlTemplate } from "../../../store/slices/vmSlice";
import jsYaml from "js-yaml";
import {
  _getAccessCredentials,
  _getDeviceFromDisk,
  _getDevices,
  _getNetworks,
  _getVolumeFromDisk,
  _getVolumes,
  _setUserDataAndNetworkDisks,
} from "../../../store/actions/vmActions";

export default function Advanced({ data, setDisks, disks, handleChange, onValidate, networks, setNetworks }) {
  const dispatch = useDispatch();
  const { updatedYamlString, useVmTemplate } = useSelector((state) => state.vm);
  const project = useSelector((state) => state.project);
  const yamlDataObjectRef = useRef();
  const [errors, setErrors] = useState([]);
  const initChange = useRef(true);

  const onChange = useCallback((value, yamlDataObject) => {
    if (initChange.current) {
      initChange.current = false;
    } else {
      dispatch(setUpdatedYamlString(value));
    }
    yamlDataObjectRef.current = yamlDataObject;
  }, []);

  const getMemoryParts = (memoryString) => {
    const match = (memoryString || "").match(/(\d+)(\D+)/);
    if (match) {
      return { size: match[1], unit: match[2] };
    }
    return { size: null, unit: null };
  };

  useEffect(() => {
    return () => {
      const yamlDataObject = yamlDataObjectRef.current;

      if (handleChange && yamlDataObject) {
        const name = yamlDataObject.metadata?.name || data.name;
        const namespace = yamlDataObject.metadata?.namespace || data.namespace;

        const newData = {
          name,
          namespace,
          cores: yamlDataObject.spec?.template?.spec?.domain?.cpu?.cores || data.cores,
          sockets: yamlDataObject.spec?.template?.spec?.domain?.cpu?.sockets || data.sockets,
          threads: yamlDataObject.spec?.template?.spec?.domain?.cpu?.threads || data.threads,
          advanced: yamlDataObject,
        };

        const memory = yamlDataObject.spec?.template?.spec?.domain?.resources?.requests?.memory;
        const memoryParts = getMemoryParts(memory);

        data.memory = memoryParts.size;
        data.memoryType = memoryParts.unit;

        const userDataAndNetwork = yamlDataObject.spec?.template?.spec?.volumes.at(-1).cloudInitNoCloud;
        const userData = jsYaml.load(userDataAndNetwork?.userData);

        if (userData) {
          data.userName = userData.user;
          data.password = userData.password;
        }

        handleChange({ ...data, ...newData });

        if (setDisks && yamlDataObject) {
          const dataVolumeTemplates = yamlDataObject.spec.dataVolumeTemplates;

          if (dataVolumeTemplates.length) {
            const deviceDisks = yamlDataObject.spec.template.spec.domain.devices.disks;
            const volumes = yamlDataObject.spec.template.spec.volumes;

            const newOrImageDisks = dataVolumeTemplates.map((template, i) => {
              const templateName = template.metadata.name;
              const storage = template.spec.pvc;
              const storageClass = storage.storageClassName;
              const storageSize = storage.resources?.requests?.storage;
              const accessModes = storage.accessModes ? storage.accessModes[0] : "";
              const source = template.spec.source;
              const storageParts = getMemoryParts(storageSize);
              /*
               * Based on this documentation about Disks and Volumes
               * We should find a device from this path
               *  "template" -> "volumes" => "devices.disks"
               *
               * https://kubevirt.io/user-guide/storage/disks_and_volumes/
               */
              const volume = volumes.find((vol) => vol.dataVolume?.name == templateName);
              const deviceDisk = deviceDisks.find((disk) => volume?.name === disk.name);

              /**
               * We should find the createType based on images' state
               * if an image exists with this url and type then this disk is
               * using an image
               */
              let image = project.images.find((item) => {
                return item.namespace === namespace && source[item?.type] && source[item.type].url === item.url;
              });

              let sourceType;
              let url;
              if (image) {
                sourceType = "http";
                url = image.url;
              } else {
                sourceType = Object.keys(source)[0];
                url = source[sourceType]?.url;
              }

              return {
                createType: image ? "image" : "new",
                diskType: "disk",
                busType: deviceDisk?.disk?.bus,
                memoryType: storageParts.unit,
                size: storageParts.size || "",
                storageClass: storageClass,
                accessMode: accessModes || "",
                image: image ? image.name : "",
                disk: "",
                type: sourceType,
                url: url,
              };
            });

            setDisks(newOrImageDisks);
          }
        }
      }
    };
  }, [setDisks, handleChange]);

  // Here we fill the Yaml template with values from `data` and `disks`
  useEffect(() => {
    let yaml = "";
    // !updatedYamlString && !useVmTemplate ? yamlTemplate: updatedYamlString;
    if (!updatedYamlString && !useVmTemplate) {
      yaml = yamlTemplate;
    } else {
      yaml = updatedYamlString;
    }

    const objectData = jsYaml.load(yaml);
    if (useVmTemplate) {
      return;
    }
    if (data.cores) objectData.spec.template.spec.domain.cpu.cores = parseInt(data.cores);
    if (data.sockets) objectData.spec.template.spec.domain.cpu.sockets = parseInt(data.sockets);
    if (data.threads) objectData.spec.template.spec.domain.cpu.threads = parseInt(data.threads);
    if (data.name) {
      objectData.metadata.name = data.name;
    }
    if (data.userName && objectData.metadata?.labels?.["cloud-init.kubevirt-manager.io/username"])
      objectData.metadata.labels["cloud-init.kubevirt-manager.io/username"] = data.userName;
    if (data.namespace) objectData.metadata.namespace = data.namespace;
    if (data.memory)
      objectData.spec.template.spec.domain.resources.requests.memory = parseInt(data.memory) + data.memoryType;
    if (data.node) {
      objectData.spec.template.spec.nodeSelector["kubernetes.io/hostname"] = data.node;
    }

    objectData.spec.template.spec.networks = _getNetworks(networks);

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

      if (!useVmTemplate) {
        objectData.spec.dataVolumeTemplates = [];
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

          if (i == 0 && disks.length === 1 && useVmTemplate) {
            const item = yamlDataVolumeTemplates[i] ? yamlDataVolumeTemplates[i] : [];
            const currentDevice = objectData.spec?.template?.spec?.domain?.devices?.disks[0];
            const diskType = disk.type;
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

                  resources: {
                    ...item.spec?.pvc?.resources,
                    requests: {
                      storage: storage || "",
                    },
                  },
                  storageClassName: storageClass || null,
                  accessModes: accessMode || null,
                },
                source: {
                  [diskType]: {
                    url: disk.url || item?.spec?.source[diskType]?.url,
                  },
                },
              },
            };
          } else {
            const image = project.images.find((item) => item.name === disk.image);

            const source = {};
            if (image) {
              source[image.type] = {
                url: image.url,
              };
            } else {
              source[disk.type] = {
                url: disk.url,
              };
            }
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
                      storage: `${disk.size ? disk.size : ""}${"Gi"}`,
                    },
                  },
                },
                source,
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

          let diskNameCheck = existingDisks.find((item) => item.name === diskName && item.namespace === diskNamespace);
          if (diskNameCheck) {
            setErrors([
              ...errors,
              { message: `Disk ${diskName} with name/namespace combination already exists!`, startLineNumber: 14 },
            ]);
          }

          let _obj = {
            diskType: disk?.diskType,
            busType: disk?.busType,
            diskName: `disk${i + 1}`,
            volumeName: diskName,
          };

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

      if (data.bindingMode) {
        // const interface = objectData.spec.template?.spec.domain.devices.interfaces[0];
        const interfaces = objectData.spec?.template?.spec?.networks.map((network) => {
          return {
            name: network ? network?.name : "",
            [data.bindingMode]: {},
          };
        });
        objectData.spec.template.spec.domain.devices.interfaces = interfaces;
      }
    }
    const yamlString = jsYaml.dump(objectData, {
      noArrayIndent: true,
      styles: { "!!str": "plain", "!!null": "empty" },
    });

    dispatch(setUpdatedYamlString(yamlString));
  }, []);

  return (
    <CustomForm>
      {updatedYamlString && (
        <YamlEditor
          onChange={onChange}
          name="advanced"
          defaultValue={updatedYamlString}
          value={updatedYamlString}
          objectValue={yamlDataObjectRef.current}
          onValidate={onValidate}
          customErrors={errors}
        />
      )}
      {/* <div style={{ padding: 10 }}>somet</div> */}
    </CustomForm>
  );
}
