import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loader: false,
  clusterCpuInfo: {},
  memoryInfo: 0,
  storageInfo: 0,
  nodeMemory: { total: 0, used: 0 },
  nodeStorage: { total: 0, used: 0 },
  nodeCpu: { total: 0, used: 0 },
  vmCpu: { total: 0, used: 0 },
  vmMemory: { total: 0, used: 0 },
  vmStorage: { total: 0, used: 0 },
  vmStats: {
    // Will store stats by VM name
    // Example structure:
    // "vm1": { cpu: {used, total}, memory: {used, total}, storage: {used, total} }
  },
  vmEvents: []
};

export const reportingSlice = createSlice({
  name: "reporting",
  initialState,
  reducers: {
    setClusterCpuInfo: (state, action) => {
      state.clusterCpuInfo = action.payload
    },
    setMemoryInfo: (state, action) => {
      state.memoryInfo = action.payload
    },

    setStorageInfo: (state, action) => {
      state.storageInfo = action.payload
    },
    setNodeMemory: (state, action) => {
      let { type, size } = action.payload
      if (type === "total") state.nodeMemory.total = size
      else state.nodeMemory.used = size
    },
    setNodeStorage: (state, action) => {
      let { type, size } = action.payload
      if (type === "total") state.nodeStorage.total = size
      else state.nodeStorage.used = size
    },
    setNodeCpu: (state, action) => {
      let { type, size } = action.payload
      if (type === "total") state.nodeCpu.total = size
      else state.nodeCpu.used = size
    },
    setVmCpuStats: (state, action) => {
      const { vmName, used, total } = action.payload;
      if (!state.vmStats[vmName]) {
        state.vmStats[vmName] = { cpu: {}, memory: {}, storage: {} };
      }
      state.vmStats[vmName].cpu = { used, total };
    },
    setVmMemoryStats: (state, action) => {
      const { vmName, used, total } = action.payload;
      if (!state.vmStats[vmName]) {
        state.vmStats[vmName] = { cpu: {}, memory: {}, storage: {} };
      }
      state.vmStats[vmName].memory = { used, total };
    },
    setVmStorageStats: (state, action) => {
      const { vmName, used, total } = action.payload;
      if (!state.vmStats[vmName]) {
        state.vmStats[vmName] = { cpu: {}, memory: {}, storage: {} };
      }
      state.vmStats[vmName].storage = { used, total };
    },
    setVmEvents: (state, action) => {
      state.vmEvents = action.payload.reverse();
    }
  },
});

export const {
  setClusterCpuInfo,
  setMemoryInfo,
  setStorageInfo,
  setNodeMemory,
  setNodeStorage,
  setNodeCpu,
  setVmCpuStats,
  setVmMemoryStats,
  setVmStorageStats,
  setVmEvents
} = reportingSlice.actions;

export default reportingSlice.reducer;
