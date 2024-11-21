import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templates: [],
  selectedTemplate: null,
};

const vmSlice = createSlice({
  name: 'vm',
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
  },
});

export const { setTemplates, setSelectedTemplate } = vmSlice.actions;

export const selectTemplates = (state) => state.vm.templates;
export const selectSelectedTemplate = (state) => state.vm.selectedTemplate;

export default vmSlice.reducer;
