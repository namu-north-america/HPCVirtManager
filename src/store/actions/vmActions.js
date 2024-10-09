import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { setLiveMigrations } from "../slices/projectSlice";

import { getVMsAction } from "./projectActions";

const onAddVMAction = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let url = endPoints.ADD_VM({
    namespace: data.namespace,
    name: data.name,
  });
  let payload = {
    apiVersion: "kubevirt.io/v1alpha3",
    kind: "VirtualMachine",
    metadata: {
      name: data.name,
      namespace: data.namespace,
      labels: {
        "kubevirt.io/domain": data.name,
        "kubevirt-manager.io/managed": "true",
        "cloud-init.kubevirt-manager.io/username": "admin",
      },
    },
    spec: {
      running: false,
      template: {
        metadata: {},
        spec: {
          domain: {
            devices: {
              disks: [
                {
                  name: "disk1",
                  disk: {},
                },
                {
                  name: "disk3",
                  disk: {
                    bus: "virtio",
                  },
                },
              ],
              interfaces: [
                {
                  name: "net1",
                  [data.bindingMode]: {},
                },
              ],
              networkInterfaceMultiqueue: true,
            },
            cpu: {
              cores: parseInt(data.cores),
              threads: parseInt(data.threads),
              sockets: parseInt(data.sockets),
            },
            resources: {
              requests: {
                memory: `${data.memory}Gi`,
              },
            },
          },
          networks: [
            {
              name: "net1",
              pod: {},
            },
          ],
          volumes: [
            {
              name: "disk1",
              dataVolume: {
                name: data.storage,
              },
            },
            {
              name: "disk3",
              cloudInitNoCloud: {
                userData: `#cloud-config\nmanage_etc_hosts: true\nhostname: ${data.name}\nuser: admin\npassword: Admin@123\n`,
                networkData:
                  "version: 1\nconfig:\n    - type: physical\n      name: enp1s0\n      subnets:\n      - type: dhcp\n    - type: nameserver\n      address:\n      - '8.8.8.8'\n      - '8.8.4.4'\n",
              },
            },
          ],
          nodeSelector: {
            "kubernetes.io/hostname": data.node,
          },
        },
      },
    },
  };
  const res = await api("post", url, payload);
  if (res?.kind) {
    dispatch(getVMsAction());
    next();
  }
  setLoading(false);
};

const onAddVMAction2 = (data, disks, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let _disks = await Promise.all(
    disks.map(async (disk, i) => {
      if (disk?.createType === "new") {
        let diskData = await adddisk({
          ...disk,
          namespace: data?.namespace,
          name: `${data?.name}-disk${i + 1}`,
        });

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

  let _deviceDisk = _disks.map((disk, i) => {
    let busObj = {};
    if (disk?.busType) {
      busObj.bus = disk?.busType;
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
  });

  let _volumes = _disks.map((disk, i) => {
    return {
      name: disk?.diskName,
      dataVolume: {
        name: disk?.volumeName,
      },
    };
  });

  //add one disk and volume obj for username and password
  _deviceDisk.push({
    bootOrder: _deviceDisk.length + 1,
    name: `disk${_deviceDisk.length + 1}`,
    disk: {
      bus: "virtio",
    },
  });
  _volumes.push({
    name: `disk${_volumes.length + 1}`,
    cloudInitNoCloud: {
      userData: `#cloud-config\nmanage_etc_hosts: true\nhostname: ${data.name}\nuser: ${data.userName}\npassword: ${data.password}\n`,
      networkData:
        "version: 1\nconfig:\n    - type: physical\n      name: enp1s0\n      subnets:\n      - type: dhcp\n    - type: nameserver\n      address:\n      - '8.8.8.8'\n      - '8.8.4.4'\n",
    },
  });

  let url = endPoints.ADD_VM({
    namespace: data.namespace,
    name: data.name,
  });
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
              // disks: [
              //   {
              //     name: "disk1",
              //     disk: {},
              //   },
              //   {
              //     name: "disk3",
              //     disk: {
              //       bus: "virtio",
              //     },
              //   },
              // ],
              disks: _deviceDisk,

              interfaces: [
                {
                  name: "net1",
                  [data.bindingMode]: {},
                },
              ],
              networkInterfaceMultiqueue: true,
            },
            cpu: {
              cores: parseInt(data.cores),
              threads: parseInt(data.threads),
              sockets: parseInt(data.sockets),
            },
            resources: {
              requests: {
                memory: `${data.memory}${data.memoryType}`,
              },
            },
          },
          networks: [
            {
              name: "net1",
              pod: {},
            },
          ],
          // volumes: [
          //   {
          //     name: "disk1",
          //     dataVolume: {
          //       name: data.storage,
          //     },
          //   },
          //   {
          //     name: "disk3",
          //     cloudInitNoCloud: {
          //       userData: `#cloud-config\nmanage_etc_hosts: true\nhostname: ${data.name}\nuser: ${data.userName}\npassword: ${data.password}\n`,
          //       networkData:
          //         "version: 1\nconfig:\n    - type: physical\n      name: enp1s0\n      subnets:\n      - type: dhcp\n    - type: nameserver\n      address:\n      - '8.8.8.8'\n      - '8.8.4.4'\n",
          //     },
          //   },
          // ],
          volumes: _volumes,
          nodeSelector: {
            "kubernetes.io/hostname": data.node,
          },
        },
      },
    },
  };
  const res = await api("post", url, payload);
  if (res?.kind) {
    dispatch(getVMsAction());
    next();
  }
  setLoading(false);
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
  if (res?.kind) {
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

const adddisk = async (data) => {
  let url = endPoints.ADD_STORAGE_DISK({
    namespace: data.namespace,
    name: data.name,
  });

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
  return res.metadata;
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
  if (res?.kind) {
    dispatch(getVMsAction());
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

export {
  onAddVMAction,
  onAddVMAction2,
  onEditVMAction,
  onGetVMAction,
  getVolumesAction,
  onChangeVmStatusAction,
  onDeleteVMAction,
  onRestartVMAction,
  onPauseVMAction,
  onMigrateVMAction,
  getLiveMigrationsAction,
};
