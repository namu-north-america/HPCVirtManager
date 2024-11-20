import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sshKeys: [],
  loading: false,
  error: null,
};

const sshKeySlice = createSlice({
  name: 'sshKeys',
  initialState,
  reducers: {
    setSSHKeys: (state, action) => {
      state.sshKeys = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSSHKeys, setLoading, setError } = sshKeySlice.actions;
export default sshKeySlice.reducer;
