import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { showToastAction } from "../slices/commonSlice";
import { setLiveMigrations, setNetworks } from "../slices/projectSlice";
import { setVmEvents } from "../slices/reportingSlice";
import { getVMsAction } from "./projectActions";
import { setInstanceTypes } from "../slices/projectSlice";
import { getVMPoolsAction } from "./projectActions";
import moment from "moment";

const addVMRequest = async (payload, url, dispatch, next) => {
  const res = await api("post", url, payload);

  if (res?.status === "Failure") {
    if (res?.message) {
      dispatch(
        showToastAction({
          type: "error",
          title: res?.message,
        })
      );
    }
    if (next) next(false);
  } else if (res?.kind) {
    dispatch(getVMsAction());
    dispatch(
      showToastAction({
        type: "success",
        title: "Virtual Machine created successfully",
      })
    );
    if (next) next(true);
  }
};

const addDiskByYamlTemplate = async (namespace, template) => {
  let url = endPoints.ADD_STORAGE_DISK({
    namespace: namespace,
    name: template.metadata.name,
  });

  template.apiVersion = "cdi.kubevirt.io/v1beta1";
  template.kind = "DataVolume";

  const res = await api("post", url, template);
  if (res?.status === "Failure") {
    throw new Error(res?.message);
  }

  return res.metadata;
};

export const _getNetworks = (networks) => {
  let networksData = [];
  if (networks.length) {
    networksData.push({
      name: networks?.[0].networkType,
      pod: {},
    });

    if (networks.length > 1) {
      networksData.push({
        name: networks?.[1].networkType,
        multus: {
          networkName: networks?.[1].networkType,
        },
      });
    }
  }
  return networksData;
};

export const _getDeviceFromDisk = (disk, i) => {
  let busObj = {};
  if (disk?.busType) {
    busObj.bus = disk?.busType || "virtio";
  }

  let obj = {
    bootOrder: i + 1,
    name: disk?.diskName,
    [disk?.diskType]: busObj,
  };

  if (disk?.cache) {
    obj.cache = disk?.cache;
  }
  return obj;
};

export const _getDevices = (_disks) => {
  return _disks.map((disk, i) => {
    return _getDeviceFromDisk(disk, i);
  });
};

export const _getVolumeFromDisk = (disk) => {
  return {
    name: disk?.diskName,
    dataVolume: {
      name: disk?.volumeName,
    },
  };
};

export const _getVolumes = (_disks) =>
  _disks.map((disk, i) => {
    return _getVolumeFromDisk(disk);
  });

export const _setUserDataAndNetworkDisks = (_devices, _volumes, { name, username, password }) => {
  const deviceData = {
    bootOrder: _devices.length + 1,
    name: `disk${_devices.length + 1}`,
    disk: {
      bus: "virtio",
    },
  };

  if (_devices instanceof Array) {
    _devices.push(deviceData);
  }

  const volumeData = {
    name: `disk${_volumes.length + 1}`,
    cloudInitNoCloud: {
      userData: `#cloud-config\nmanage_etc_hosts: true\nhostname: ${name}\nuser: ${username}\npassword: ${password}\n`,
      networkData:
        "version: 1\nconfig:\n    - type: physical\n      name: enp1s0\n      subnets:\n      - type: dhcp\n    - type: nameserver\n      address:\n      - '8.8.8.8'\n      - '8.8.4.4'\n",
    },
  };

  if (_volumes instanceof Array) {
    _volumes.push(volumeData);
  }

  return { _volumes, _devices, deviceData, volumeData };
};

export const _getAccessCredentials = (sshKey) => {
  let _accessCredentials = [];
  if (sshKey) {
    _accessCredentials.push({
      sshPublicKey: {
        source: {
          secret: {
            secretName: sshKey,
          },
        },
        propagationMethod: {
          noCloud: {},
        },
      },
    });
  }
  return _accessCredentials;
};

const onAddVMAction = (data, disks, images, networks, isVmPool, setLoading, next) => async (dispatch, getState) => {
  try {
    const { sshKeys } = getState().sshKeys;
    const selectedKey = sshKeys.find((key) => key.name === data.sshKey);
    const sshKeyValue = selectedKey ? selectedKey.sshPublicKey : "";

    // TODO: later we can remove this if
    // we don't want send vm template directly to
    // api
    const sendDataVolumesInVm = false;

    let { project } = getState();
    let { vms } = project;
    let name, namespace;
    let { advanced } = data;
    name = data.name;
    namespace = data.namespace;

    const virtualMachineType = data.virtualMachineType;

    if (vms?.length && name) {
      let vmNameCheck = vms.find((item) => item.name === name && item.namespace === namespace);
      if (vmNameCheck) {
        dispatch(
          showToastAction({
            type: "error",
            title: "VM with name/namespace combination already exists!",
          })
        );
        setLoading(false);
        return;
      }
    }

    if (isVmPool) {
      const url = endPoints.ADD_VM_POOL({
        namespace: data.namespace,
        name: data.name,
      });

      advanced.spec.virtualMachineTemplate.spec.dataVolumeTemplates =
        advanced.spec.virtualMachineTemplate.spec.dataVolumeTemplates.map((template) => ({
          ...template,
          apiVersion: "cdi.kubevirt.io/v1beta1",
          kind: "DataVolume",
        }));

      setLoading(true);
      await addVMRequest(advanced, url, dispatch, next);
      return;
    }
    // With the last changes on Yaml Editor in advanced step
    // We have the advanced value already all the time
    // TODO: we can remove
    if (advanced && sendDataVolumesInVm) {
      let url = endPoints.ADD_VM({
        namespace: data.namespace,
        name: data.name,
      });
      setLoading(true);
      await addVMRequest(advanced, url, dispatch, next);
      return;
    }

    // if (advanced) {
    //   let _disks = await Promise.all(
    //     advanced.spec.dataVolumeTemplates.map(async (disk, i) => {
    //       const metadata = await addDiskByYamlTemplate(namespace, disk);
    //       return {
    //         diskName: `disk${i + 1}`,
    //         volumeName: metadata?.name,
    //       };
    //     })
    //   );

    //   let url = endPoints.ADD_VM({
    //     namespace: data.namespace,
    //     name: data.name,
    //   });

    //   next(false);

    //   const _deviceDisk = _getDevices(_disks);
    //   const _volumes = _getVolumes(_disks);

    //   advanced.spec.template.spec.domain.devices.disks = _deviceDisk;
    //   advanced.spec.template.spec.volumes = _volumes;

    //   await addVMRequest(advanced, url, dispatch, next);

    //   setLoading(false);
    //   return;
    // }

    let _disks = await Promise.all(
      disks.map(async (disk, i) => {
        if (disk?.createType === "new" || disk?.createType === "image") {
          const diskName = `${name.trim()}-disk${i + 1}`;
          const diskNamespace = namespace;

          let existingDisks = project.disks;

          let diskNameCheck = existingDisks.find((item) => item.name === diskName && item.namespace === diskNamespace);
          if (diskNameCheck) {
            throw new Error(`Disk ${diskName} with name/namespace combination already exists!`);
          }

          let diskData = await adddisk(
            {
              ...disk,
              namespace: diskNamespace,
              name: diskName,
            },
            images,
            dispatch
          );

          let _obj = {
            cache: disk?.cache,
            diskType: disk?.diskType,
            busType: disk?.busType,
            diskName: `disk${i + 1}`,
            volumeName: diskData?.name,
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
      })
    );

    let _deviceDisk = _getDevices(_disks);

    let _accessCredentials = [];
    if (data.sshKey) {
      _accessCredentials.push({
        sshPublicKey: {
          source: {
            secret: {
              secretName: data.sshKey,
            },
          },
          propagationMethod: {
            noCloud: {},
          },
        },
      });
    }

    let _volumes = _getVolumes(_disks);

    //add one disk and volume obj for username and password
    _setUserDataAndNetworkDisks(_deviceDisk, _volumes, {
      name: data.name,
      username: data.userName,
      password: data.password,
    });

    const interfaces = networks.map((net) => {
      return {
        name: net.networkType,
        [net.bindingMode]: {},
      };
    });

    const networkData = _getNetworks(networks);

    let payload = {
      apiVersion: "kubevirt.io/v1alpha3",
      kind: "VirtualMachine",
      metadata: {
        name: data.name,
        namespace: data.namespace,
        labels: {
          "kubevirt.io/domain": data.name,
          "kubevirt-manager.io/managed": "true",
          "cloud-init.kubevirt-manager.io/username": data.userName,
        },
      },
      spec: {
        running: false,
        template: {
          metadata: {},
          spec: {
            domain: {
              devices: {
                disks: _deviceDisk,
                interfaces: interfaces,
                networkInterfaceMultiqueue: true,
              },
            },
            networks: networkData,
            // networks: [
            //   {
            //     name: "net1",
            //     pod: {},
            //   },
            // ],
            accessCredentials: _accessCredentials,
            volumes: _volumes,
            // nodeSelector: {
            //   "kubernetes.io/hostname": data.node,
            // },
          },
        },
      },
    };

    if (virtualMachineType === "custom") {
      payload.spec.template.spec.domain.cpu = {
        sockets: parseInt(data.sockets),
        cores: parseInt(data.cores),
        threads: parseInt(data.threads),
      };
      payload.spec.template.spec.domain.resources = {
        requests: {
          memory: `${data.memory}${data.memoryType}`,
        },
      };
    } else {
      payload.spec["instancetype"] = {
        kind: "VirtualMachineClusterInstancetype",
        name: virtualMachineType,
      };
    }

    let url = endPoints.ADD_VM({
      namespace: data.namespace,
      name: data.name,
    });

    await addVMRequest(payload, url, dispatch, next);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    dispatch(
      showToastAction({
        type: "error",
        title: error.message,
      })
    );
  }
};

const onEditVMAction = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let url = endPoints.EDIT_VM({
    namespace: data.namespace,
    name: data.name,
  });
  let payload = {
    spec: {
      template: {
        spec: {
          domain: {
            cpu: {
              sockets: parseInt(data.sockets),
              cores: parseInt(data.cores),
              threads: parseInt(data.threads),
            },
            resources: {
              requests: {
                memory: data.memory + data.memoryType,
              },
            },
          },
        },
      },
    },
  };
  const res = await api(
    "patch",
    url,
    payload,
    {},
    {
      "Content-Type": "application/merge-patch+json",
    }
  );
  if (res?.status === "Failure") {
    if (res?.details?.causes) {
      res?.details?.causes?.forEach((element) => {
        dispatch(
          showToastAction({
            type: "error",
            title: element?.message,
          })
        );
      });
    }
  } else if (res?.kind) {
    dispatch(getVMsAction());
    next();
  }
  setLoading(false);
};

const onGetVMAction = (data, next) => async () => {
  let url = endPoints.GET_VM({
    namespace: data.namespace,
    name: data.name,
  });

  let instance = await api(
    "get",
    endPoints.GET_VM_INSTANCE({
      namespace: data.namespace,
      name: data.name,
    })
  );
  const res = await api("get", url);
  if (res?.kind) {
    next(res, instance);
  }
};

const onGetVMPoolAction =
  ({ name, namespace }, next) =>
  async (dispatch) => {
    let url = endPoints.GET_VM_POOL({
      name,
      namespace,
    });

    const res = await api("get", url);

    if (res) {
      next(res);
    }
  };

const getVolumesAction = (namespace, volumes, next) => async () => {
  const data = await Promise.all(
    volumes.map(async (item) => {
      if (item?.dataVolume) {
        let res = await api(
          "get",
          endPoints.GET_VOLUME({
            namespace,
            name: item?.dataVolume?.name,
          })
        );
        if (res?.kind) {
          return { ...res, name: item.name };
        }
        return null;
      } else {
        return null;
      }
    })
  );
  const filteredData = data.filter((item) => item !== null);
  next(filteredData);
};

// Start and Stop
const onChangeVmStatusAction = (data, status, next) => async (dispatch) => {
  let url = endPoints.CHANGE_VM_STATUS({
    namespace: data.namespace,
    name: data.name,
  });

  let payload = {
    spec: status,
  };
  const res = await api(
    "patch",
    url,
    payload,
    {},
    {
      "Content-Type": "application/merge-patch+json",
    }
  );
  if (res?.kind) {
    dispatch(getVMsAction());
    if (next) {
      next();
    }
  }
};
const onRestartVMAction = (data) => async (dispatch) => {
  let url = endPoints.RESTART_VM({
    namespace: data.namespace,
    name: data.name,
  });
  const res = await api("put", url);
  if (res?.kind) {
    dispatch(getVMsAction());
  }
};
// Pause UnPause
const onPauseVMAction = (data, next) => async () => {
  let url = endPoints.PAUSE_VM({
    namespace: data.namespace,
    name: data.name,
    type: data.type,
  });
  await api("put", url);
  if (next) {
    next();
  }
};

const onDeleteVMAction = (data) => async (dispatch) => {
  let url = endPoints.DELETE_VM({
    namespace: data.namespace,
    name: data.name,
  });

  const res = await api("delete", url);
  if (res?.kind) {
    dispatch(getVMsAction());
  }
};

const adddisk = async (data, images, dispatch) => {
  try {
    let url = endPoints.ADD_STORAGE_DISK({
      namespace: data.namespace,
      name: data.name,
    });

    if (data.createType === "image") {
      let image = images.find((item) => item.name === data.image);
      if (image) {
        data.type = image.type;
        data.url = image.url;
      }
    }

    let source = {
      [data?.type]: {},
    };

    if (data?.url) {
      source[data?.type]["url"] = data?.url;
    }

    let payload = {
      apiVersion: "cdi.kubevirt.io/v1beta1",
      kind: "DataVolume",
      metadata: {
        name: data.name,
        namespace: data.namespace,
        annotations: {
          "cdi.kubevirt.io/storage.deleteAfterCompletion": "false",
        },
        labels: {},
      },
      spec: {
        pvc: {
          storageClassName: data.storageClass,
          accessModes: [data.accessMode],
          resources: {
            requests: {
              storage: `${data.size}${data?.memoryType}`,
            },
          },
        },
        source,
      },
    };

    const res = await api("post", url, payload);
    if (res?.status === "Failure") {
      throw new Error(res?.message);
    }
    return res.metadata;
  } catch (error) {
    throw error;
  }
};

const onMigrateVMAction = (data, next) => async (dispatch) => {
  let url = endPoints.MIGRATE_VM({
    namespace: data.namespace,
  });

  const vmiName = data.name;
  const migrationName = `${vmiName}-migration-${new Date().getTime()}`;

  const payload = {
    apiVersion: "kubevirt.io/v1",
    kind: "VirtualMachineInstanceMigration",
    metadata: {
      name: migrationName,
    },
    spec: {
      vmiName: vmiName,
    },
  };
  const res = await api("post", url, payload);
  if (res?.status === "Failure") {
    if (res?.details?.causes) {
      res?.details?.causes?.forEach((element) => {
        dispatch(
          showToastAction({
            type: "error",
            title: element?.message,
          })
        );
      });
    }
  } else {
    dispatch(getVMsAction());
  }
  if (next) {
    next();
  }
};

const onAddHotPlugVmAction = (namespace, name, data, next) => async (dispatch) => {
  let url = endPoints.HOT_PLUG_VOLUME({ namespace, name });

  const payload = {
    name: data.volume,
    disk: {
      name: data.volume,
      serial: "test",
      cache: data.cache,
      disk: {
        readonly: data.isReadOnly,
        bus: "scsi",
      },
    },
    volumeSource: {
      dataVolume: {
        name: data.volume,
        hotpluggable: true,
      },
    },
  };

  const res = await api("put", url, payload);
  if (res?.status === "Failure") {
    if (res?.reason == "BadRequest") {
      dispatch(
        showToastAction({
          type: "error",
          title: res?.message,
        })
      );
    }
  } else if (res?.kind) {
    // dispatch(getVMsAction());
  }
  if (next) {
    next();
  }
};

export const onAddNetworkHotPlugVmAction = (namespace, name, networks, interfaces, data, next) => async (dispatch) => {
  let url = endPoints.HOT_PLUG_NETWORK({ namespace, name });

  const payload = {
    // apiVersion: "cdi.kubevirt.io/v1beta1",
    kind: "DataVolume",
    spec: {
      template: {
        spec: {
          networks: [
            ...networks,
            {
              name: data.networkType,
              multus: {
                networkName: data.networkType,
              },
            },
          ],
          domain: {
            devices: {
              interfaces: [
                ...interfaces,
                {
                  name: data?.networkType,
                  [data?.bindingMode]: {},
                },
              ],
            },
          },
        },
      },
    },
  };

  const res = await api("patch", url, payload, {}, { "Content-Type": "application/merge-patch+json" });
  if (res?.status === "Failure") {
    if (res?.reason == "BadRequest") {
      dispatch(
        showToastAction({
          type: "error",
          title: res?.message,
        })
      );
    }
  } else if (res?.kind) {
    // dispatch(getVMsAction());
  }
  if (next) {
    next();
  }
};

const getLiveMigrationsAction = (namespaces) => async (dispatch) => {
  let items = await Promise.all(
    namespaces.map(async (namespace, i) => {
      let data = await api(
        "get",
        endPoints.MIGRATE_VM({
          namespace,
        })
      );
      if (data?.items) {
        return data?.items;
      }
      return [];
    })
  );
  items = items.flatMap((item) => item);
  items = items.map((item) => ({
    name: item?.metadata?.name,
    namespace: item?.metadata?.namespace,
    time: item?.metadata?.creationTimestamp,
    status: item?.status?.phase,
    vmName: item?.spec?.vmiName,
    completed: item?.status?.migrationState?.completed,
    sourceNode: item?.status?.migrationState?.sourceNode,
    targetNode: item?.status?.migrationState?.targetNode,
    targetNodeAddress: item?.status?.migrationState?.targetNodeAddress,
    startTimestamp: item?.status?.migrationState?.startTimestamp,
    endTimestamp: item?.status?.migrationState?.endTimestamp,
  }));
  dispatch(setLiveMigrations(items));
};

export const getNetworksAction = (next) => async (dispatch) => {
  let res = await api("get", endPoints.GET_NETWORKS());

  if (res?.kind) {
    const networks = res.items.map((network) => {
      return {
        name: network.metadata.name,
      };
    });

    dispatch(setNetworks(networks));
    // next(res);
  }
};

const getVmEvents = (namespace, name, next) => async (dispatch) => {
  let url = endPoints.GET_VM_EVENTS({ namespace, name });
  try {
    const res = await api("get", url);

    if (res.kind === "EventList") {
      const events = res.items.map((item) => {
        const timestamp = item.firstTimestamp;
        const now = moment();
        const targetTime = moment.utc(timestamp);
        const duration = moment.duration(now.diff(targetTime));
        const hours = duration.hours();
        const minutes = duration.minutes();
        // const seconds = duration.seconds();
        // const seconds = totalSeconds % 60;

        return {
          type: item.type,
          message: item.message,
          reason: item.reason,
          lastSeen: `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""} ${duration.seconds()}s`,
          // lastSeen: moment(targetTime).fromNow(true),
        };
      });

      dispatch(setVmEvents(events));
    }
  } catch (err) {}
};

const getInstanceTypesAction = () => async (dispatch) => {
  const url = endPoints.GET_INSTANCE_TYPES();
  const res = await api("get", url);
  if (res?.kind) {
    const items = res.items.map((item) => ({
      name: item.metadata.name,
      cpu: item.spec.cpu.guest,
      memory: item.spec.memory.guest,
    }));
    dispatch(setInstanceTypes(items));
  }
};

const onAddInstanceTypeAction = (data, next) => async (dispatch) => {
  const url = endPoints.INSTANCE_TYPE({ name: data.name });
  const payload = {
    apiVersion: "instancetype.kubevirt.io/v1beta1",
    kind: "VirtualMachineClusterInstancetype",
    metadata: {
      name: data.name,
    },
    spec: {
      cpu: {
        guest: data.cpu,
      },
      memory: {
        guest: data.memory + "Gi",
      },
    },
  };

  const res = await api("post", url, payload);
  if (res?.kind) {
    dispatch(getInstanceTypesAction());
    next(res);
  }
};

const onEditInstanceType = (data, next) => async (dispatch) => {
  const url = endPoints.INSTANCE_TYPE({ name: data.name });
  const payload = {
    apiVersion: "instancetype.kubevirt.io/v1beta1",
    kind: "VirtualMachineClusterInstancetype",
    metadata: {
      name: data.name,
    },
    spec: {
      cpu: {
        guest: data.cpu,
      },
      memory: {
        guest: data.memory + "Gi",
      },
    },
  };

  const res = await api(
    "patch",
    url,
    payload,
    {},
    {
      "Content-Type": "application/merge-patch+json",
    }
  );
  if (res?.kind) {
    dispatch(getInstanceTypesAction());
    next(res);
  }
};

const onDeleteInstanceType =
  ({ name }, next) =>
  async (dispatch) => {
    const url = endPoints.INSTANCE_TYPE({ name });

    const res = await api("delete", url);

    if (res?.kind) {
      dispatch(getInstanceTypesAction());
      next(res);
    }
  };

const onStopOrStartVMPoolActions =
  ({ name, namespace, action = "stop" }, next) =>
  async (dispatch) => {
    const url = endPoints.PATCH_VM_POOL({ name, namespace });

    let payload = {
      spec: {
        virtualMachineTemplate: {
          spec: {
            running: action !== "stop",
          },
        },
      },
    };

    const res = await api(
      "patch",
      url,
      payload,
      {},
      {
        "Content-Type": "application/merge-patch+json",
      }
    );

    if (res?.kind) {
      dispatch(getVMPoolsAction());
      if (next) {
        next();
      }
    }
  };

const onVmPoolsScaleAction =
  ({ name, namespace, replicas }, next) =>
  async (dispatch) => {
    const url = endPoints.PATCH_VM_POOL({ name, namespace });

    let payload = {
      spec: {
        replicas,
      },
    };

    const res = await api(
      "patch",
      url,
      payload,
      {},
      {
        "Content-Type": "application/merge-patch+json",
      }
    );

    if (res?.kind) {
      dispatch(getVMPoolsAction());
      if (next) {
        next();
      }
    }
  };

const onDeleteVmPoolAction =
  ({ name, namespace }, next) =>
  async (dispatch) => {
    const url = endPoints.DELETE_VM_POOL({ name, namespace });
    const res = await api("delete", url);
    if (res?.kind) {
      dispatch(getVMPoolsAction());
      if (next) {
        next();
      }
    }
  };

const onEditVmPoolAction =
  ({ name, namespace, data }, next) =>
  async (dispatch) => {
    const url = endPoints.PATCH_VM_POOL({ name, namespace });
    const payload = {
      spec: {
        virtualMachineTemplate: {
          spec: {
            instancetype: {
              name: data.instancetype,
            },
          },
        },
      },
    };

    const res = await api(
      "patch",
      url,
      payload,
      {},
      {
        "Content-Type": "application/merge-patch+json",
      }
    );

    if (res?.kind) {
      dispatch(getVMPoolsAction());
      if (next) {
        next();
      }
    }
  };

const onRemoveVmFromPoolAction =
  ({ name, namespace, node }) =>
  async (dispatch) => {
    const url = endPoints.DELETE_VM({ name, namespace });

    const payload = {
      metadata: {
        labels: {
          "kubevirt.io/domain": name,
          "kubevirt.io/vmpool": null,
        },
        ownerReferences: null,
      },
      spec: {
        template: {
          spec: {
            nodeSelector: {
              "kubernetes.io/hostname": node,
            },
          },
          metadata: {
            labels: {
              "kubevirt.io/domain": name,
              "kubevirt.io/vmpool": null,
            },
          },
        },
      },
    };

    const res = await api(
      "patch",
      url,
      payload,
      {},
      {
        "Content-Type": "application/merge-patch+json",
      }
    );

    if (res?.kind) {
      dispatch(getVMsAction({ name, namespace, isVmPool: true }));
    }

    console.log("payload for vm delete___vm pool", payload, res);
  };

export {
  onAddVMAction,
  onEditVMAction,
  onGetVMAction,
  getVolumesAction,
  onChangeVmStatusAction,
  onDeleteVMAction,
  onRestartVMAction,
  onPauseVMAction,
  onMigrateVMAction,
  getLiveMigrationsAction,
  onAddHotPlugVmAction,
  getVmEvents,
  onAddInstanceTypeAction,
  getInstanceTypesAction,
  onDeleteInstanceType,
  onEditInstanceType,
  onStopOrStartVMPoolActions,
  onGetVMPoolAction,
  onVmPoolsScaleAction,
  onDeleteVmPoolAction,
  onEditVmPoolAction,
  onRemoveVmFromPoolAction,
};
