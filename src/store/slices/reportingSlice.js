import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loader: false,
  clusterCpuInfo: {},
  memoryInfo: 0,
  storageInfo:0
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
    
  },
});
export const { setClusterCpuInfo,setMemoryInfo,setStorageInfo } =
reportingSlice.actions;
export default reportingSlice.reducer;
