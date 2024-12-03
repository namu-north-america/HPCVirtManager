import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loader: false,
  toastInfo: {},
  formsFocusEvent: {
    addVirtualMachine: false,
  },
};

export const commonSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    showLoaderAction: (state) => {
      state.loader = true;
    },
    hideLoaderAction: (state) => {
      state.loader = false;
    },
    showToastAction: (state, action) => {
      state.toastInfo = action.payload;
    },
    setFormFocusEvent: (state, action) => {
      state.formsFocusEvent[action.payload.form] = action.payload.focus;
    },
  },
});
export const { showLoaderAction, hideLoaderAction, showToastAction, setFormFocusEvent } = commonSlice.actions;
export default commonSlice.reducer;
