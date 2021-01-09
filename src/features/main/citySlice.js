import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWeatherForCity } from "../../api/weatherApi";

export const getWeatherForCity = createAsyncThunk(
  "city/getWeatherForCity",
  async (args, { getState, requestId }) => {
    const { currentRequestId, loading } = getState().cityInfo;
    if (loading !== "pending" || requestId !== currentRequestId) {
      return;
    }

    try {
      const response = await fetchWeatherForCity(args.city, args.unit);
      return response.data.data;
    } catch (error) {
      return;
    }
  }
);

export const citySlice = createSlice({
  name: "cityInfo",
  initialState: {
    name: localStorage.getItem("city") ? localStorage.getItem("city") : "",
    weatherInfo: null,
    loading: "idle",
    currentRequestId: undefined,
    error: null,
  },
  reducers: {
    setCity: (state, action) => {
      localStorage.setItem("city", action.payload);
      state.name = action.payload;
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [getWeatherForCity.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        if (
          action.payload &&
          action.payload.getCityByName &&
          action.payload.getCityByName.weather
        ) {
          state.weatherInfo = action.payload.getCityByName;
        } else {
          state.weatherInfo = null;
        }
        state.currentRequestId = undefined;
      }
    },
    [getWeatherForCity.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
        state.weatherInfo = null;
      }
    },
    [getWeatherForCity.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = action.error;
        state.currentRequestId = undefined;
        state.weatherInfo = null;
      }
    },
  },
});

export const { setCity } = citySlice.actions;

// The function below is called a selector and allows us to select a name from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.cityInfo.name)`
export const selectCity = (state) => state.cityInfo.name;
export const selectWeather = (state) => state.cityInfo.weatherInfo;
export const selectLoading = (state) => state.cityInfo.loading;
export const selectError = (state) => state.cityInfo.error;

export default citySlice.reducer;
