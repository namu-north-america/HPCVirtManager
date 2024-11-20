import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import commonSlice from "./slices/commonSlice";
import projectSlice from "./slices/projectSlice";
import reportingSlice from "./slices/reportingSlice";
import sshKeyReducer from './slices/sshKeySlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    common: commonSlice,
    project: projectSlice,
    reporting:reportingSlice,
    sshKeys: sshKeyReducer,
  },
});
