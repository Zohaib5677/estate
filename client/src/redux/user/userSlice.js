import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart(state) {
      state.loading = true;
      state.error = null;
    },

    setUserInfo(state, action) {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    
    },
    signInFailure(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    signOut(state) {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
      deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  signInStart,
  setUserInfo,
  signInFailure,
  signOut,
    signInSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
} = userSlice.actions;

export default userSlice.reducer;
