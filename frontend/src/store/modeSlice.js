import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: true,
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    changeMode: (state, action) => {
      state.mode = action.payload; 
    }
  },
});

export const { changeMode} = modeSlice.actions;

export default modeSlice.reducer;
