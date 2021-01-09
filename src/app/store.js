import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import unitReducer from "../features/header/unitSlice";
import cityReducer from "../features/main/citySlice";

export default configureStore({
  reducer: {
    unit: unitReducer,
    cityInfo: cityReducer
  },
  middleware: getDefaultMiddleware(),
});
