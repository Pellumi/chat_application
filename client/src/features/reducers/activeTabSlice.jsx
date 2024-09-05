import { createSlice } from "@reduxjs/toolkit";

const activeTabSlice = createSlice({
  name: "activeTab",
  initialState: { isActive: null },
  reducers: {
    setActiveTab: (state, action) => {
      state.isActive = action.payload;
    },
    removeActive: (state) => {
      state.isActive = null;
    },
  },
});

export const { setActiveTab, removeActive } = activeTabSlice.actions;
export default activeTabSlice.reducer;
