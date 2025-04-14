import { configureStore } from "@reduxjs/toolkit";
import instagramReducer from "./instagramSlice";

export const store = configureStore({
  reducer: {
    instagram: instagramReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Correctly typed dispatch
