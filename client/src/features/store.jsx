import { configureStore } from "@reduxjs/toolkit";
import contactsReducer from "./reducers/contactSlice";
import displayReducer from "./reducers/displayReducer";
import activeTabSlice from "./reducers/activeTabSlice";

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    displayReducer: displayReducer,
    activeTab: activeTabSlice,
  },
});
