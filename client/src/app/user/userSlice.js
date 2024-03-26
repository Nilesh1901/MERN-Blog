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
    deleteStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    deleteSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.errorMessage = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    signOutSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.errorMessage = null;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutSuccess,
} = UserSlice.actions;

export default UserSlice.reducer;
