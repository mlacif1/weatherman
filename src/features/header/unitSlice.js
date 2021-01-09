import { createSlice } from '@reduxjs/toolkit';

export const unitSlice = createSlice({
  name: 'unit',
  initialState: {
    value: localStorage.getItem("unit")
    ? localStorage.getItem("unit")
    : "metric"
  },
  reducers: {
    setUnit: (state, action) => {
      localStorage.setItem("unit", action.payload);
      state.value = action.payload;
    },
  },
});

export const { setUnit } = unitSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.unit.value)`
export const selectUnit = state => state.unit.value;

export default unitSlice.reducer;
