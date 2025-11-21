import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalState = {
  selectedCompany: "",
  token: "",
  user: {} as User,
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
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setSelectedCompany, setToken, setUser } = globalSlice.actions;
export default globalSlice.reducer;
