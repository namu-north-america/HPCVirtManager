import { setClusterCpuInfo,setMemoryInfo,setStorageInfo } from "../slices/reportingSlice";
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
export { getMemoryUsage, getCPUUsage, getCPUTotalCores, onGetStorageAction };
