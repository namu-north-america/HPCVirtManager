import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import commonSlice from "./slices/commonSlice";
import projectSlice from "./slices/projectSlice";
import reportingSlice from "./slices/reportingSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    common: commonSlice,
    project: projectSlice,
    reporting:reportingSlice,
  },
});
