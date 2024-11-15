import { setClusterCpuInfo,setMemoryInfo,setStorageInfo, setVmCpuStats, setVmMemoryStats, setVmStorageStats } from "../slices/reportingSlice";
import prometheusApi from "../../services/prometheusApi";
import endPoints from "../../services/endPoints";

const onGetStorageAction = () => async (dispatch) => {
  const cpuQuery =
    "(sum(container_fs_usage_bytes)/sum(kube_persistentvolume_capacity_bytes))*100";
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(cpuQuery)}`
  );
  if (res?.status === "success") {
    console.log("onGetStorageAction", res);
    console.log("getMemoryUsage", res);
    const value = res?.data?.result[0]?.value[1];
    const numericValue = parseFloat(value); // Convert to number
    
       let data = (!isNaN(numericValue)) ?numericValue.toFixed(2):0
        dispatch(setStorageInfo(data));
  } else {
    console.log("onGetStorageAction error", res);
  }
};

const getCPUUsage = (totalCores) => async (dispatch) => {
 
  const cpuQuery =
    "sum(rate(container_cpu_usage_seconds_total[10m])) by (cluster)";
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(cpuQuery)}`
  );

  if (res?.status === "success") {
    const usedCores = res?.data?.result[0]?.value[1];
    
    const cpuUsage = (parseFloat(usedCores) / parseInt(totalCores[1])) * 100;
    let usage = {
      totalCores: totalCores[1],
      usedCores: usedCores,
      cpuUsage: cpuUsage.toFixed(2),
    };
    dispatch(setClusterCpuInfo(usage));

  } else {
    console.log("getCPUUsage error", res);
  }
};
const getCPUTotalCores = () => async (dispatch) => {
  const cpuQuery = "(sum(rate(container_cpu_usage_seconds_total[10m])) by (cluster)/sum(machine_cpu_cores))*100";
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(cpuQuery)}`
  );

  if (res?.status === "success") {
    //dispatch(getCPUUsage(res?.data?.result[0]?.value));
    const value = res?.data?.result[0]?.value[1];
const numericValue = parseFloat(value); // Convert to number

    let usage = {
      totalCores: 0,
      usedCores: 0,
      cpuUsage: (!isNaN(numericValue)) ?numericValue.toFixed(2):0
    };
    dispatch(setClusterCpuInfo(usage));
  } else {
    console.log("getCPUUsage error", res);
  }
};
const getMemoryUsage = () => async (dispatch) => {
  const cpuQuery = "(sum(container_memory_usage_bytes) / sum(kube_node_status_allocatable{resource='memory'}))*100";
  const res = await prometheusApi(
    "get",
    `/api/v1/query?query=${encodeURIComponent(cpuQuery)}`
  );

  if (res?.status === "success") {
    console.log("getMemoryUsage", res);
    const value = res?.data?.result[0]?.value[1];
    const numericValue = parseFloat(value); // Convert to number
    
       let data = (!isNaN(numericValue)) ?numericValue.toFixed(2):0
        dispatch(setMemoryInfo(data));
  } else {
    console.log("getMemoryUsage error", res);
  }
};

const bytesToGB = (bytes) => {
  return bytes / (1024 * 1024 * 1024); // Convert bytes to GB
};

const getVmCpuStats = (vmName) => async (dispatch) => {
  const usedQuery = `sum(rate(kubevirt_vmi_vcpu_seconds_total{name="${vmName}"}[5m]))`;
  const totalQuery = `sum(kubevirt_vmi_vcpu_cores{name="${vmName}"})`;
  
  try {
    const [usedRes, totalRes] = await Promise.all([
      prometheusApi("get", `/api/v1/query?query=${encodeURIComponent(usedQuery)}`),
      prometheusApi("get", `/api/v1/query?query=${encodeURIComponent(totalQuery)}`)
    ]);

    if (usedRes?.status === "success" && totalRes?.status === "success") {
      const used = (parseFloat(usedRes?.data?.result[0]?.value[1] || 0));
      const total = (parseFloat(totalRes?.data?.result[0]?.value[1] || 0));
      
      dispatch(setVmCpuStats({ vmName, used, total }));
    }
  } catch (error) {
    console.error("getVmCpuUsage error", error);
  }
};
const getVmMemoryStats = (vmName) => async (dispatch) => {
  const usedQuery = `sum(kubevirt_vmi_memory_available_bytes{name="${vmName}"})`;
  const totalQuery = `sum(kubevirt_vmi_memory_size_bytes{name="${vmName}"})`;
  
  try {
    const [usedRes, totalRes] = await Promise.all([
      prometheusApi("get", `/api/v1/query?query=${encodeURIComponent(usedQuery)}`),
      prometheusApi("get", `/api/v1/query?query=${encodeURIComponent(totalQuery)}`)
    ]);

    if (usedRes?.status === "success" && totalRes?.status === "success") {
      const used = bytesToGB(parseFloat(usedRes?.data?.result[0]?.value[1] || 0));
      const total = bytesToGB(parseFloat(totalRes?.data?.result[0]?.value[1] || 0));
      
      dispatch(setVmMemoryStats({ vmName, used, total }));
    }
  } catch (error) {
    console.error("getVmMemoryUsage error", error);
  }
};

const getVmStorageStats = (vmName) => async (dispatch) => {
  const usedQuery = `sum(kubevirt_vmi_storage_read_traffic_bytes_total{name="${vmName}"})`;
  const totalQuery = `sum(kubevirt_vmi_storage_capacity_bytes{name="${vmName}"})`;
  
  try {
    const [usedRes, totalRes] = await Promise.all([
      prometheusApi("get", `/api/v1/query?query=${encodeURIComponent(usedQuery)}`),
      prometheusApi("get", `/api/v1/query?query=${encodeURIComponent(totalQuery)}`)
    ]);

    if (usedRes?.status === "success" && totalRes?.status === "success") {
      const used = bytesToGB(parseFloat(usedRes?.data?.result[0]?.value[1] || 0));
      const total = bytesToGB(parseFloat(totalRes?.data?.result[0]?.value[1] || 0));
      
      dispatch(setVmStorageStats({ vmName, used, total }));
    }
  } catch (error) {
    console.error("getVmStorageUsage error", error);
  }
};
  
export { getMemoryUsage, getCPUUsage, getCPUTotalCores, onGetStorageAction, getVmCpuStats, getVmMemoryStats, getVmStorageStats };
