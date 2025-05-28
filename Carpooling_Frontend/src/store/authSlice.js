import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  token: localStorage.getItem("token") || null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token; 
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.isLoggedIn= false;
      state.token = null; // Clear the token
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token"); // Remove token from localStorage
    },
  },
});

// Export the actions and the reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
