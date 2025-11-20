import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalState = {
  selectedCompany: "",
  token: "",
  mode: "employees",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload as "employees" | "candidates";
    },
  },
});

export const { setSelectedCompany, setToken, setMode } = globalSlice.actions;
export default globalSlice.reducer;
