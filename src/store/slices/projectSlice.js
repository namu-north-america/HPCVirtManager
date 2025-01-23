import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vms: [],
  migrations: [],
  nodes: [],
  nodeDetail: {},
  nodesDropdown: [],
  namespaces: [],
  namespacesDropdown: [],
  storageClasses: [],
  storageClassesDropdown: [],
  disks: [],
  disksDropdown: [],
  images: [],
  accessModeDropdown: ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"],
  bindingModeDropdown: ["bridge", "masquerade"],
  priorityClassesDropdown: [],
  networksDropdown: [],
  instanceTypes: []
};

export const projectSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setVMs: (state, action) => {
      state.vms = action.payload;
    },
    setLiveMigrations: (state, action) => {
      state.migrations = action.payload;
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
      state.nodesDropdown = action.payload.map((item) => item?.name);
    },
    setNodeDetail: (state, action) => {
      state.nodeDetail = action.payload;
    },
    setNamespaces: (state, action) => {
      state.namespaces = action.payload;
      state.namespacesDropdown = action.payload.map((item) => item?.metadata?.name);
    },
    setStorageClasses: (state, action) => {
      state.storageClasses = action.payload;
      state.storageClassesDropdown = action.payload.map((item) => item?.name);
    },
    setDisks: (state, action) => {
      state.disks = action.payload;
      state.disksDropdown = action.payload.map((item) => item?.name);
    },

    setImages: (state, action) => {
      state.images = action.payload;
    },
    setPriorityClasses: (state, action) => {
      state.priorityClassesDropdown = action.payload.map((item) => item?.metadata?.name).reverse();
    },
    setNetworks: (state, action) => {
      state.networksDropdown = action.payload.map(item => item.name);
    },
    setInstanceTypes: (state, action) => {
      state.instanceTypes = action.payload;
    }
  },
});
export const {
  setVMs,
  setLiveMigrations,
  setNodes,
  setNodeDetail,
  setNamespaces,
  setStorageClasses,
  setDisks,
  setPriorityClasses,
  setImages,
  setNetworks,
  setInstanceTypes
} = projectSlice.actions;
export default projectSlice.reducer;
