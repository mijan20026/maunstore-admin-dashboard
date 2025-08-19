// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './features/authSlice';
// import notificationReducer from './features/notificationSlice';
// import dataReducer from './features/dataSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     notification: notificationReducer,
//     data: dataReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice"; // your RTK Query api
import authReducer from "./features/authSlice";
import notificationReducer from "./features/notificationSlice";
import dataReducer from "./features/dataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    data: dataReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // Add RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
