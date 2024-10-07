import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loader: false,
  clusterCpuInfo: {},
  memoryInfo: 0,
  storageInfo:0,
  nodeMemory: {total:0,used:0},
  nodeStorage: {total:0,used:0},
  nodeCpu: {total:0,used:0},
};

export const reportingSlice = createSlice({
  name: "reporting",
  initialState,
  reducers: {
    setClusterCpuInfo: (state,action) => {
      state.clusterCpuInfo=action.payload
    },
    setMemoryInfo: (state, action) => {
      state.memoryInfo=action.payload
    },

    setStorageInfo: (state, action) => {
      state.storageInfo=action.payload
    },
    setNodeMemory: (state, action) => {
      let {type,size} = action.payload
      if(type==="total") state.nodeMemory.total=size
      else state.nodeMemory.used=size
    },
    setNodeStorage: (state, action) => {
      let {type,size} = action.payload
      if(type==="total") state.nodeStorage.total=size
      else state.nodeStorage.used=size
    },
    setNodeCpu: (state, action) => {
      let {type,size} = action.payload
      if(type==="total") state.nodeCpu.total=size
      else state.nodeCpu.used=size
    },
    
  },
});
export const { setClusterCpuInfo,setMemoryInfo,setStorageInfo ,setNodeMemory,setNodeStorage,setNodeCpu} =
reportingSlice.actions;
export default reportingSlice.reducer;
