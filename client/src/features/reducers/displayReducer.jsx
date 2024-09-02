import { createSlice } from "@reduxjs/toolkit";

const displayReducerSlice = createSlice({
  name: "displayReducer",
  initialState: {
    isVisible: false,
  },
  reducers: {
    toggleDisplay: (state) => {
      state.isVisible = !state.isVisible;
    },
    show: (state) => {
      state.isVisible = true;
    },
    hide: (state) => {
      state.isVisible = false;
    },
  },
});

export const { toggleDisplay, show, hide } = displayReducerSlice.actions;
export default displayReducerSlice.reducer;
