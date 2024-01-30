import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: true,
  filter: false
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    changeMode: (state, action) => {
      state.mode = action.payload; // Corrected from state.mode = !mode
    },
    changeFilter: (state, action) => {
      state.filter = action.payload
    }
  },
});

export const { changeMode, changeFilter } = modeSlice.actions;

export default modeSlice.reducer;
