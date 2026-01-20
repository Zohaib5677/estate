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
    }
  }
});

export const {
  signInStart,
  setUserInfo,
  signInFailure,
  signOut,
    signInSuccess
} = userSlice.actions;

export default userSlice.reducer;
