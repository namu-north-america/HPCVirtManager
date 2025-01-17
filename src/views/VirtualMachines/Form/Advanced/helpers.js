import jsYaml from "js-yaml";
import { _getNetworks, _getDevices, _getVolumes, _setUserDataAndNetworkDisks, _getAccessCredentials } from "../../../../store/actions/vmActions";

export const updateYamlString = ({ data, objectData, useVmTemplate, networks, disks, project, setErrors, errors }) => {
    if (!useVmTemplate) {
        if (data.sockets) objectData.spec.template.spec.domain.cpu.sockets = parseInt(data.sockets);
        if (data.threads) objectData.spec.template.spec.domain.cpu.threads = parseInt(data.threads);

        objectData.spec.template.spec.networks = _getNetworks(networks);
    }

    if (data.cores) objectData.spec.template.spec.domain.cpu.cores = parseInt(data.cores);

    if (data.name) {
        objectData.metadata.name = data.name;
    }

    if (data.namespace) objectData.metadata.namespace = data.namespace;
    if (data.memory)
        objectData.spec.template.spec.domain.resources.requests.memory = parseInt(data.memory) + data.memoryType;

    if (data.userName && objectData.metadata?.labels?.["cloud-init.kubevirt-manager.io/username"])
        objectData.metadata.labels["cloud-init.kubevirt-manager.io/username"] = data.userName;

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
                    const diskType = Object.keys(item.spec.source)[0];
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
                                    url: item?.spec?.source[diskType]?.url,
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

        if (!useVmTemplate) {
            const _disks = disks.map((disk, i) => {
                if (disk?.createType === "new" || disk?.createType === "image") {
                    const diskName = `${name.trim()}-disk${i + 1}`;
                    const diskNamespace = namespace;

                    let existingDisks = project.disks;

                    let diskNameCheck = existingDisks.find(
                        (item) => item.name === diskName && item.namespace === diskNamespace
                    );
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
            } else {
                objectData.spec.template.spec.accessCredentials = _getAccessCredentials("test");
                objectData.spec.template.spec.accessCredentials[0].sshPublicKey.source.secret.secretName = "";
            }

            if (networks && networks.length) {
                // const interface = objectData.spec.template?.spec.domain.devices.interfaces[0];
                const interfaces = objectData.spec?.template?.spec?.networks.map((network, index) => {
                    return {
                        name: network ? network?.name : "",
                        [networks[index].bindingMode]: {},
                    };
                });
                objectData.spec.template.spec.domain.devices.interfaces = interfaces;
            }
        }
    }
    const yamlString = jsYaml.dump(objectData, {
        noArrayIndent: true,
        styles: { "!!str": "plain", "!!null": "empty" },
    });

    return yamlString;
};
