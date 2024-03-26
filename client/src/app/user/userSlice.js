import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  errorMessage: null,
  loading: false,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.errorMessage = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.errorMessage = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const { signInFailure, signInStart, signInSuccess, updateFailure, updateStart, updateSuccess} = UserSlice.actions;

export default UserSlice.reducer;
