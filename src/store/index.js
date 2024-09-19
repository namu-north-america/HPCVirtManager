import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import commonSlice from "./slices/commonSlice";
import projectSlice from "./slices/projectSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    common: commonSlice,
    project: projectSlice,
  },
});
