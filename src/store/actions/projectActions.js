import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { convertKiToMBorGB } from "../../utils/commonFunctions";
import {
  setNamespaces,
  setNodes,
  setVMs,
  setStorageClasses,
  setDisks,
  setPriorityClasses,
} from "../slices/projectSlice";

const getVMsAction = () => async (dispatch) => {
  const res = await api("get", endPoints.VMS);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  items = await Promise.all(
    items.map(async (item, i) => {
      let instance = {};
      if (item?.status?.printableStatus === "Running") {
        instance = await api(
          "get",
          endPoints.GET_VM_INSTANCE({
            namespace: item?.metadata?.namespace,
            name: item?.metadata?.name,
          })
        );
      }

      return {
        id: item?.metadata?.uid,
        name: item?.metadata?.name,
        status: item?.status?.printableStatus,
        conditions: instance?.status?.conditions?.[0]?.type,
        ipAddress: instance?.status?.interfaces?.map((item) => item?.ipAddress),
        guestOS: instance?.status?.guestOSInfo?.name,
        node:
          item?.spec?.template?.spec?.nodeSelector?.[
            "kubernetes.io/hostname"
          ] || instance?.status?.nodeName,
        namespace: item?.metadata?.namespace,
        cluster: "-",
        time: item?.metadata?.creationTimestamp,

        sockets: item?.spec?.template?.spec?.domain?.cpu?.sockets,
        cores: item?.spec?.template?.spec?.domain?.cpu?.cores,
        threads: item?.spec?.template?.spec?.domain?.cpu?.threads,
        memory: item?.spec?.template?.spec?.domain?.resources?.requests?.memory,
      };
    })
  );
  dispatch(setVMs(items));
};
const getNodesAction = () => async (dispatch) => {
  const res = await api("get", endPoints.NODES);
  let items = [];
  if (res?.items) {
    console.log("node list logs",res);
    
    items = res.items;
  }

  items = items.map((item) => ({
    id: item?.metadata?.uid,
    name: item?.metadata?.name,
    status: "READY",
    operatingSystem: item?.status?.nodeInfo?.osImage,
    cpu: item?.status?.capacity?.cpu,
    memory: convertKiToMBorGB(item?.status?.capacity?.memory),
    storage: convertKiToMBorGB(item?.status?.capacity?.["ephemeral-storage"]),
    k8sVersion: item?.status?.nodeInfo?.kubeletVersion,
    time: item?.metadata?.creationTimestamp,
  }));
  dispatch(setNodes(items));
};
const getNamespacesAction = () => async (dispatch) => {
  const res = await api("get", endPoints.NAMESPACE);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  dispatch(setNamespaces(items));
};
const getStorageClassesAction = () => async (dispatch) => {
  const res = await api("get", endPoints.STORAGE_CLASSES);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  items = items.map((item) => ({
    id: 1,
    name: item?.metadata?.name,
    cluster: "-",
    provisioner: "-",
    time: item?.metadata?.creationTimestamp,
  }));
  dispatch(setStorageClasses(items));
};

const getPriorityClassAction = () => async (dispatch) => {
  const res = await api("get", endPoints.PRIORITY_CLASSES);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  dispatch(setPriorityClasses(items));
};
const getDisksAction = () => async (dispatch) => {
  const res = await api("get", endPoints.STORAGE_DISKS);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  items = await Promise.all(
    items.map(async (item) => {
      let storage = await api(
        "get",
        endPoints.GET_STORAGE_DISK({
          namespace: item?.metadata?.namespace,
          name: item?.metadata?.name,
        })
      );

      return {
        id: item?.metadata?.uid,
        name: item?.metadata?.name,
        size: storage?.spec?.resources?.requests?.storage,
        namespace: item?.metadata?.namespace,
        status: item?.status?.phase,
        conditions:
          item?.status?.conditions[item?.status?.conditions?.length - 1]
            ?.message,
        storageClass: item?.spec?.pvc?.storageClassName,
        OSImageURL:
          item?.spec?.source?.http?.url ||
          item?.spec?.source?.registry?.url ||
          item?.spec?.source?.gcs?.url ||
          item?.spec?.source?.s3?.url,
        accessMode: item?.spec?.pvc?.accessModes[0],
        time: item?.metadata?.creationTimestamp,
      };
    })
  );
  dispatch(setDisks(items));
};

const onDiskResizeAction =
  ({ namespace, name, size, memoryType }, next) =>
  async (dispatch) => {
    let payload = {
      spec: {
        resources: {
          requests: {
            storage: `${size}${memoryType}`,
          },
        },
      },
    };
    let res = await api(
      "patch",
      endPoints.STORAGE_DISK_RESIZE({ namespace, name }),
      payload,
      {},
      {
        "Content-Type": "application/merge-patch+json",
      }
    );

    if (res?.kind) {
      dispatch(getDisksAction());
      next(res?.metadata);
    }
  };

const onAddDiskAction = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
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
  if (res?.kind) {
    dispatch(getDisksAction());
    next(res?.metadata);
  }
  setLoading(false);
};

const onDeleteDiskAction = (data) => async (dispatch) => {
  let url = endPoints.DELETE_PERSISTENT_VOLUME_CLAIM({
    namespace: data.namespace,
    name: data.name,
  });
  await api("delete", url);
  let url1 = endPoints.DELETE_STORAGE_DISK({
    namespace: data.namespace,
    name: data.name,
  });
  const res1 = await api("delete", url1);
  if (res1.status) {
    dispatch(getDisksAction());
  }
};

const onAddUserAction = (data) => async (dispatch) => {
  let url = endPoints.ADD_USER;
  let payload = {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": {
      "name": "ma60813",
      "namespace": "default"
    },
    "data": {
      "username": "YWRtaW4=",   // Base64-encoded "admin"
      "password": "UGE1NXcwcmQ=" // Base64-encoded "Pa55w0rd"
    }
  };
  const res = await api("post", url, payload);
  if (res?.kind) {
    console.log("add user response",res);
    
  }
};
export {
  getVMsAction,
  getNodesAction,
  getNamespacesAction,
  getStorageClassesAction,
  getDisksAction,
  onDiskResizeAction,
  onAddDiskAction,
  onDeleteDiskAction,
  getPriorityClassAction,
  onAddUserAction,
};
