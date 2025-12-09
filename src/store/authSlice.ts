import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  currentUser: string | null;
}

const initialState: AuthState = {
  isLoggedIn: localStorage.getItem('netflix_isLoggedIn') === 'true',
  currentUser: localStorage.getItem('netflix_currentUser'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<{ user: string }>) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload.user;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
    },
  },
});

export const { setLoggedIn, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
