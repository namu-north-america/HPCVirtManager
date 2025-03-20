import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  networks: [],
};

export const networkAccessSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {
    setNetworkAccess: (state, action) => {
      state.networks = action.payload;
    },
  },
});

export const { setNetworkAccess } = networkAccessSlice.actions;

export default networkAccessSlice.reducer;
