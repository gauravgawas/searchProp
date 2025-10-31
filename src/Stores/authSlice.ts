import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  username: string | null;
  token: string | null;
  resourceUrl:string | null;
}

const initialState: AuthState = {
  username: null,
  token: null,
  resourceUrl:"https://searchprops-org3.onrender.com",//change url to local when runing locally
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action
    ) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.username = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
