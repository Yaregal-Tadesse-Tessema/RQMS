import { configureStore } from "@reduxjs/toolkit";

import { rqmsApi } from "@/lib/api/generated";

export const store = configureStore({
  reducer: {
    [rqmsApi.reducerPath]: rqmsApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rqmsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

