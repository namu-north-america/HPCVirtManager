import api from "../../services/api";
import endPoints from "../../services/endPoints";
import prometheusApi from "../../services/prometheusApi";
import { convertKiToMBorGB, bytesToGB } from "../../utils/commonFunctions";
import {
  setNamespaces,
  setNodes,
  setNodeDetail,
  setVMs,
  setPriorityClasses,
} from "../slices/projectSlice";
import {
  setNodeMemory,
  setNodeStorage,
  setNodeCpu,
} from "../slices/reportingSlice";

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
        volumes: item?.spec?.template?.spec?.volumes
      };
    })
  );
  dispatch(setVMs(items));
};

// <----------------- Nodes Action-------------->>
const getNodesAction = () => async (dispatch) => {
  const res = await api("get", endPoints.NODES);
  let items = [];
  if (res?.items) {
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
const getNodeInstanceAction = (name) => async (dispatch) => {
  console.log(name);

  const res = await api(
    "get",
    endPoints.GET_NODE_INSTANCE({
      name: name,
    })
  );
  let node = {};
  if (res?.kind === "Node") {
    console.log("node logs", res);
    node = {
      id: res?.metadata?.uid,
      name: res?.metadata?.name,
      labels: res?.metadata.labels,
      status: res.status.conditions.find((cond) => cond.type === "Ready")
        .status,
      operatingSystem: res?.status?.nodeInfo?.osImage,
      cpu: res?.status?.capacity?.cpu,
      memory: convertKiToMBorGB(res?.status?.capacity?.memory),
      storage: convertKiToMBorGB(res?.status?.capacity?.["ephemeral-storage"]),
      k8sVersion: res?.status?.nodeInfo?.kubeletVersion,
      time: res?.metadata?.creationTimestamp,
      ip: res.status.addresses.find((addr) => addr.type === "InternalIP")
        .address,
    };
    dispatch(setNodeDetail(node));
  }

  // items = items.map((item) => ({
  //   id: item?.metadata?.uid,
  //   name: item?.metadata?.name,
  //   status: "READY",
  //   operatingSystem: item?.status?.nodeInfo?.osImage,
  //   cpu: item?.status?.capacity?.cpu,
  //   memory: convertKiToMBorGB(item?.status?.capacity?.memory),
  //   storage: convertKiToMBorGB(item?.status?.capacity?.["ephemeral-storage"]),
  //   k8sVersion: item?.status?.nodeInfo?.kubeletVersion,
  //   time: item?.metadata?.creationTimestamp,
  // }));
  // dispatch(setNodes(items));
};
//          memory
const getNodeTotalMemoryAction = (name) => async (dispatch) => {
  const Query = `node_memory_MemTotal_bytes{node='${name}'}`;
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(Query)}`
  );
  if (res?.status === "success") {
    const value = res?.data?.result[0]?.value[1];
    const numericValue = parseFloat(value); // Convert to number
    let data = !isNaN(numericValue) ? bytesToGB(numericValue.toFixed(2)) : 0;

    dispatch(setNodeMemory({ type: "total", size: data }));
    dispatch(getNodeUsedMemoryAction(name));
  } else {
    console.log("onGetStorageAction error", res);
  }
};
const getNodeUsedMemoryAction = (name) => async (dispatch) => {
  const Query = `node_memory_MemTotal_bytes{node="${name}"}-node_memory_MemFree_bytes{node='${name}'}-node_memory_Cached_bytes{node='${name}'}-node_memory_Buffers_bytes{node='${name}'}`;
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(Query)}`
  );
  if (res?.status === "success") {
    const value = res?.data?.result[0]?.value[1];
    const numericValue = parseFloat(value); // Convert to number
    let data = !isNaN(numericValue) ? bytesToGB(numericValue.toFixed(2)) : 0;

    dispatch(setNodeMemory({ type: "used", size: data }));
  } else {
    console.log("onGetStorageAction error", res);
  }
};
//          storage
const getNodeTotalStorageAction = (name) => async (dispatch) => {
  const Query = `node_filesystem_size_bytes{node="${name}",device!="/dev/loop.*",device!="tmpfs|nsfs",device!="gvfsd-fuse"}`;
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(Query)}`
  );
  if (res?.status === "success") {
    const value = res?.data?.result[0]?.value[1];
    const numericValue = parseFloat(value); // Convert to number
    let data = !isNaN(numericValue) ? bytesToGB(numericValue.toFixed(2)) : 0;

    dispatch(setNodeStorage({ type: "total", size: data }));
    dispatch(getNodeUsedStorageAction(name));
  } else {
    console.log("getNodeTotalStorageAction error", res);
  }
};
const getNodeUsedStorageAction = (name) => async (dispatch) => {
  const Query = `node_filesystem_size_bytes{node="${name}",device!~"/dev/loop.*",device!='tmpfs',device!="gvfsd-fuse"}- node_filesystem_avail_bytes{node="${name}"}`;
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(Query)}`
  );
  if (res?.status === "success") {
    const value = res?.data?.result[0]?.value[1];
    const numericValue = parseFloat(value); // Convert to number
    let data = !isNaN(numericValue) ? bytesToGB(numericValue.toFixed(2)) : 0;

    dispatch(setNodeStorage({ type: "used", size: data }));
  } else {
    console.log("getNodeUsedStorageAction error", res);
  }
};
//          cpu
const getNodeTotalCPUCoresAction = (name) => async (dispatch) => {
  const Query = `machine_cpu_cores{kubernetes_io_hostname='${name}'}`;
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(Query)}`
  );
  if (res?.status === "success") {
    const value = res?.data?.result[0]?.value[1];

    dispatch(setNodeCpu({ type: "total", size: value }));
    dispatch(getNodeUsedCPUCoresAction(name));
  } else {
    console.log("getNodeTotalCPUCoresAction error", res);
  }
};
const getNodeUsedCPUCoresAction = (name) => async (dispatch) => {
  const Query = `sum(rate(node_cpu_seconds_total{node='${name}'}[5m])) 
/ count(node_cpu_seconds_total{node='${name}'}) 
* 100
`;
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(Query)}`
  );
  if (res?.status === "success") {
    const value = res?.data?.result[0]?.value[1];

    dispatch(setNodeCpu({ type: "used", size: value }));
  } else {
    console.log("getNodeUsedCPUCoresAction error", res);
  }
};
// <-----------------End Nodes Action-------------->>
const getNamespacesAction = () => async (dispatch) => {
  const res = await api("get", endPoints.NAMESPACE);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  dispatch(setNamespaces(items));
};

const getPriorityClassAction = () => async (dispatch) => {
  const res = await api("get", endPoints.PRIORITY_CLASSES);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  dispatch(setPriorityClasses(items));
};

export {
  getVMsAction,
  getNodesAction,
  getNodeInstanceAction,
  getNodeTotalMemoryAction,
  getNodeUsedMemoryAction,
  getNodeTotalStorageAction,
  getNodeUsedStorageAction,
  getNodeTotalCPUCoresAction,
  getNodeUsedCPUCoresAction,
  getNamespacesAction,
  getPriorityClassAction,
};
