import { configureStore } from "@reduxjs/toolkit";
import studentSlice from "./studentSlice";
import contactSlice from "./contactSlice";
import authSlice from "./slices/authSlice";

export const appStore = configureStore({
  reducer: {
    contact: contactSlice,
    student: studentSlice,
    auth: authSlice,
  },
});
